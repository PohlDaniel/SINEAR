package de.sinear.rest;

import de.sinear.entities.Person;
import de.sinear.entities.TopicArea;
import de.sinear.repository.PersonRepository;
import de.sinear.repository.TopicAreaRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/restAPI/topicareas")
public class TopicAreaController {

	private Logger log = LoggerFactory.getLogger(TopicAreaController.class);
	
    private TopicAreaRepository topicAreaRepository;
    private PersonRepository personRepository;

    public TopicAreaController(TopicAreaRepository topicAreaRepository,
                            PersonRepository personRepository) {
        this.topicAreaRepository = topicAreaRepository;
        this.personRepository = personRepository;
    }


    @GetMapping(value = "/getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getAllTopicAreas() {
        log.info("/topicareas/getAll was called");
        return ResponseEntity.status(HttpStatus.OK).body(topicAreaRepository.findAll());
    }


    @PostMapping(value = "/create")
    public ResponseEntity<Object> createTopicArea(@RequestBody TopicArea topicArea) {
        log.info("/topicareas/create was called");
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(topicAreaRepository.save(topicArea));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
        }
    }

    @PostMapping(value = "/addPerson")
    public ResponseEntity<Object> addPerson(@RequestBody Map<String, String> request) {
        log.info("/topicareas/addPerson was called");
        try {
            if (!topicAreaRepository.findById(request.get("topicAreaName")).isPresent())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Themengebiet nicht gefunden");
            if (!personRepository.findById(request.get("bid")).isPresent())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Person nicht gefunden");
            TopicArea topicArea = topicAreaRepository.findById(request.get("topicAreaName")).get();
            Person person = personRepository.findById(request.get("bid")).get();
            topicArea.addPerson(person);
            topicAreaRepository.save(topicArea);
            return ResponseEntity.status(HttpStatus.CREATED).body(topicArea);
        } catch (Exception e) {
            log.info("/topicareas/addPerson failed with error message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(value = "/removePerson")
    public ResponseEntity<Object> removePerson(@RequestBody Map<String, String> request) {
        log.info("/topicareas/removePerson was called");
        try {
            TopicArea t = topicAreaRepository.findById(request.get("topicAreaName")).get();
            Person p = personRepository.findById(request.get("bid")).get();
            t.removePerson(p);
            topicAreaRepository.save(t);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            log.info("/topicareas/delete failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/delete", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> deleteAction(@RequestBody TopicArea topicArea) {
        log.info("/topicareas/delete was called");
        try {
            TopicArea t = topicAreaRepository.findById(topicArea.getName()).get();
            topicAreaRepository.delete(t);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            log.info("/topicareas/delete failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
