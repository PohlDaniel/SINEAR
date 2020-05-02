package de.sinear.rest;

import de.sinear.dao.PersonDao;
import de.sinear.entities.Person;
import de.sinear.repository.PersonRepository;
import de.sinear.entities.enums.Role;
import de.sinear.utils.MailHandlerThread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.*;

@RestController
@RequestMapping("/restAPI/persons")
public class PersonController {

	private Logger log = LoggerFactory.getLogger(PersonController.class);
	
	@Autowired
    private PersonRepository personRepository;
  
	@Autowired
    private PersonDao personDao;
    
    @Value("${url}")
    private String url;
    
   
    
    private MailHandlerThread mailHandlerThread;
    private String pepper = "sjddjw768wlsmj882z2rnknlahffajsdgw2mAW!sjhjsc9870asfj3f";

    public PersonController(JavaMailSender javaMailSender) {
        this.mailHandlerThread = new MailHandlerThread(javaMailSender);
    }


    @GetMapping(value = "/getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Iterable<Person>> getAllPersons() {
    	    	
    	Iterable<Person> persons = personDao.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(persons);
    }

    @GetMapping(value = "/getById", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getById(String id) {
        log.info("/persons/getByBid was called");
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(personRepository.findByIdIgnoreCase(id).get());
        } catch (NoSuchElementException e) {
            log.info("/persons/getByBid failed with error message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Person nicht gefunden");
        }
    }

    /**requestAttribute is set at RestAPIFilter.java*/
    @PostMapping(value = "/create")
    public ResponseEntity<Object> createPerson(@RequestBody Person person, @RequestAttribute("reqUser") Person reqUser) {
        log.info("/persons/create was called");
        if (reqUser.getRole().equals(Role.USER) || reqUser.getRole().equals(Role.TOPICAREA_MANAGER) || reqUser.getRole().equals(Role.ACTION_MANAGER) && !person.getRole().equals(Role.USER)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {      	
        	GregorianCalendar cal = new GregorianCalendar();
            Optional<Person> existedPerson = personRepository.findByIdIgnoreCase(person.getId());
            if (existedPerson.isPresent()) {         	
            	 //in case an User/Admin etc. edit his own data the SessionIdExpiryDate has to overcome to avoid closing the session
                if(reqUser.getId().equals(person.getId())) {       
                	cal.setTimeInMillis(person.getSessionIdExpiryDate().getTimeInMillis());
                	person.setSessionIdExpiryDate(cal);
                }else {                
                	if(person.getSessionIdExpiryDate() != null) {
                		cal.setTimeInMillis(person.getSessionIdExpiryDate().getTimeInMillis());
                		person.setSessionIdExpiryDate(cal);
                	}
                }
                person.setPasswordHash(existedPerson.get().getPasswordHash());
            }
            
            Person createdPerson = personRepository.save(person);
            String token = UUID.randomUUID().toString();
            String urlUser = url + "/changePassword?bid=" + createdPerson.getId() + "&token=" + token;
            cal = new GregorianCalendar();
            cal.add(GregorianCalendar.HOUR, 24);
            createdPerson.setPasswortResetToken(token);
            createdPerson.setPasswortResetTokenExpiryDate(cal);
            personRepository.save(createdPerson);
            
            /**In case there is an valid mail adress the new created person get an E-Mail to set there password*/
            if (!existedPerson.isPresent()) {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(createdPerson.getMail());
                msg.setSubject("Set password");
                msg.setText("Dear User " + existedPerson.get().getPrename() + " set your password at the following link \n" + urlUser + "\n\nBest regards");
                mailHandlerThread.setSimpleMailMessage(msg);
                new Thread(mailHandlerThread).start();
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPerson);
        } catch (IllegalArgumentException e) {
            log.info("/persons/create failed with error message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/delete", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> deleteAction(@RequestBody Person person) {
        log.info("/persons/delete was called");
        try {
            Person p = personRepository.findByIdIgnoreCase(person.getId()).get();
            personRepository.delete(p);
        } catch (Exception e) {
            log.info("/persons/delete failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    
    @PostMapping(value = "/authenticate")
    public ResponseEntity<Object> authenticatePerson(@RequestBody Map<String, String> resp) {
        log.info("/persons/authenticate was called");
        try {
            Optional<Person> optionalPerson = personRepository.findByIdIgnoreCase(resp.get("id"));
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            byte[] hash = digest.digest((resp.get("passwordHash") + pepper).getBytes());
            String hexHash = String.format("%x", new BigInteger(1, hash));
            if (optionalPerson.isPresent()) {
                Person person = optionalPerson.get();
                if (person.getPasswordHash() != null && person.getPasswordHash().equals(hexHash)) {
                    String sessionId = UUID.randomUUID().toString();
                    person.setSessionId(sessionId);
                    person.updateExpiryDate();
                    personRepository.save(person);
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body(personRepository.findByIdIgnoreCase(resp.get("id")).get());
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PostMapping(value = "/resetPassword")
    public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> resp) {
        log.info("/persons/resetPassword was called");
        Optional<Person> user = personRepository.findByIdIgnoreCase(resp.get("id"));
        try {
            String token = UUID.randomUUID().toString();
            GregorianCalendar cal = new GregorianCalendar();
            cal.add(GregorianCalendar.HOUR, 24);
            user.get().setPasswortResetToken(token);
            user.get().setPasswortResetTokenExpiryDate(cal);
            personRepository.save(user.get());
            String urlUser = url + "/changePassword?id=" +
                    user.get().getId() + "&token=" + token;
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(user.get().getMail());
            msg.setSubject("Reset password");
            msg.setText("Dear User " + user.get().getPrename() + " set your password at the following link \n" + urlUser + "\n\nBest regards");
            mailHandlerThread.setSimpleMailMessage(msg);
            new Thread(mailHandlerThread).start();
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(null);
        } catch (NoSuchElementException e) {
            log.info("/persons/resetPassword failed with error message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(value = "/changePassword")
    public ResponseEntity<Object> changePassword(@RequestBody Map<String, String> resp) {
        log.info("/persons/changePassword was called");
        if (!resp.get("passwordHash").matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!?$%&*#@<>+-]).{8,}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The password must contain at least one uppercase and lowercase letter, a number and a special character.");
        }
        try {
            if (!personRepository.findByPasswortResetToken(resp.get("token")).isEmpty()) {
                Person user = personRepository.findByPasswortResetToken(resp.get("token")).get(0);
                if (user.getId().equals(resp.get("id"))) {
                    if (user.getPasswortResetTokenExpiryDate().after(new GregorianCalendar())) {
                        MessageDigest digest = MessageDigest.getInstance("SHA-512");
                        byte[] hash = digest.digest((resp.get("passwordHash") + pepper).getBytes());
                        String hexHash = String.format("%x", new BigInteger(1, hash));
                        if (hexHash.equals(user.getPasswordHash())) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The new password cannot be the old one.");
                        user.setPasswordHash(hexHash);
                        user.setPasswortResetTokenExpiryDate(null);
                        user.setPasswortResetToken(null);
                        personRepository.save(user);
                        return ResponseEntity.status(HttpStatus.ACCEPTED).body(null);
                    }
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Der Link ist nicht gültig. Sie können einen neuen Link anfordern, indem Sie auf der Hauptseite auf \"Passwort zurücksetzen\" klicken");
    }

    

}
