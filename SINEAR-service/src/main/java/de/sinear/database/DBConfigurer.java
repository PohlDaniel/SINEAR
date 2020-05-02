package de.sinear.database;

import de.sinear.repository.ActionRepository;
import de.sinear.repository.PersonRepository;
import de.sinear.repository.TopicAreaRepository;
import de.sinear.entities.*;
import de.sinear.entities.builder.ActionBuilder;
import de.sinear.entities.builder.PersonBuilder;
import de.sinear.entities.builder.TopicAreaBuilder;
import de.sinear.entities.enums.Role;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.GregorianCalendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DBConfigurer {
	
	@Autowired
    private ActionRepository actionRepository;
	
	@Autowired
    private PersonRepository personRepository;
	
	@Autowired
    private TopicAreaRepository topicAreaRepository;


    public static final ArrayList<Action> actionRepositoryContent = new ArrayList<Action>();

    public static final ArrayList<TopicArea> topicAreaRepositoryContent = new ArrayList<TopicArea>();

    public static final ArrayList<Person> personRepositoryContent = new ArrayList<Person>();

   


    public DBConfigurer(ActionRepository actionRepository,
                        PersonRepository personRepository,
                        TopicAreaRepository topicAreaRepository) {
        this.actionRepository = actionRepository;
        this.personRepository = personRepository;
        this.topicAreaRepository = topicAreaRepository;
    }

    public void emptyRepositories() {
       
        actionRepository.deleteAll();
        topicAreaRepository.deleteAll();
        personRepository.deleteAll();
        
        actionRepositoryContent.clear();
        topicAreaRepositoryContent.clear();
        personRepositoryContent.clear();
    }

   
    public void fillRepositories() {
        //ACTIONS FIRST
        Action a1Created = actionRepository.save(a1);
        Action a2Created = actionRepository.save(a2);
        Action a3Created = actionRepository.save(a3);
        Action a4Created = actionRepository.save(a4);
        Action a5Created = actionRepository.save(a5);
        actionRepositoryContent.add(a1Created);
        actionRepositoryContent.add(a2Created);
        actionRepositoryContent.add(a3Created);
        actionRepositoryContent.add(a4Created);
        actionRepositoryContent.add(a5Created);

        //PERSONS FOURTH
        Person p1Created = personRepository.save(p1);
        personRepositoryContent.add(p1Created);
        Person p2Created = personRepository.save(p2);
        Person p3Created = personRepository.save(p3);
        Person p4Created = personRepository.save(p4);
        personRepositoryContent.add(p2Created);
        personRepositoryContent.add(p3Created);
        personRepositoryContent.add(p4Created);

        //TOPICAREAS FIFTH
        TopicArea t1Created = topicAreaRepository.save(t1);
        t2.addPerson(p1Created);
        t2.addPerson(p2Created);
        t2.addPerson(p3Created);
        t2.addPerson(p4Created);
        TopicArea t2Created = topicAreaRepository.save(t2);
        TopicArea t3Created = topicAreaRepository.save(t3);
        t4.addPerson(p1Created);
        t4.addPerson(p2Created);
        t4.addPerson(p3Created);
        t4.addPerson(p4Created);
        TopicArea t4Created = topicAreaRepository.save(t4);
        TopicArea t5Created = topicAreaRepository.save(t5);
        TopicArea t6Created = topicAreaRepository.save(t6);
        TopicArea t7Created = topicAreaRepository.save(t7);
        topicAreaRepositoryContent.add(t1Created);
        topicAreaRepositoryContent.add(t2Created);
        topicAreaRepositoryContent.add(t3Created);
        topicAreaRepositoryContent.add(t4Created);
        topicAreaRepositoryContent.add(t5Created);
        topicAreaRepositoryContent.add(t6Created);
        topicAreaRepositoryContent.add(t7Created);

        
    }


    private Action a1 = new ActionBuilder()
            .name("Action 1")
            .startDate(new Timestamp(new GregorianCalendar(2019, 4, 1).getTimeInMillis()))
            .endDate(new Timestamp(new GregorianCalendar(2019, 4, 8).getTimeInMillis()))
            .finishedPlanning(true)
            .finished(false)
            .build();
    private Action a2 = new ActionBuilder()
            .name("Action 2")
            .startDate(new Timestamp(new GregorianCalendar(2019, 5, 1).getTimeInMillis()))
            .endDate(new Timestamp(new GregorianCalendar(2019, 5, 6).getTimeInMillis()))
            .finishedPlanning(false)
            .finished(false)
            .build();
    private Action a3 = new ActionBuilder()
            .name("Action 3")
            .startDate(new Timestamp(new GregorianCalendar(2019, 3, 1).getTimeInMillis()))
            .endDate(new Timestamp(new GregorianCalendar(2019, 3, 4).getTimeInMillis()))
            .finishedPlanning(true)
            .finished(true)
            .build();
    private Action a4 = new ActionBuilder()
            .name("Action 4")
            .startDate(new Timestamp(new GregorianCalendar(2019, 3, 1).getTimeInMillis()))
            .endDate(new Timestamp(new GregorianCalendar(2019, 3, 4).getTimeInMillis()))
            .finishedPlanning(false)
            .finished(true)
            .build();
    private Action a5 = new ActionBuilder()
            .name("Action 5")
            .startDate(new Timestamp(new GregorianCalendar(2019, 3, 1).getTimeInMillis()))
            .endDate(new Timestamp(new GregorianCalendar(2019, 3, 4).getTimeInMillis()))
            .finishedPlanning(false)
            .finished(true)
            .build();
    
    private Person p1 = new PersonBuilder()
            .bid("admin")
            .prename("Anke")
            .surname("Admin")
            .mail("test@test.de")
            .externalCompany("N.N.")
            //passwordHash equals to "salt"
            .passwordHash("ad34a4c6cfa60e394de76cf9fadff087cdb934b1112ba580cbef43f3aba8376347aed86b887ad81685c26f5c72439cfc0e724f9e1e022aa57a20d143a511c149")
            .role(Role.ADMIN)
            .sessionId("hallo")
            .sessionIdExpiryDate(new GregorianCalendar(3000, 01, 01))
            .build();
    private Person p2 = new PersonBuilder()
            .bid("actionmanager")
            .prename("Alex")
            .surname("Actionmanager")
            .mail("test@test.de")
            .externalCompany("N.N.")
            .passwordHash("ad34a4c6cfa60e394de76cf9fadff087cdb934b1112ba580cbef43f3aba8376347aed86b887ad81685c26f5c72439cfc0e724f9e1e022aa57a20d143a511c149")
            .role(Role.ACTION_MANAGER)
            .build();
    private Person p3 = new PersonBuilder()
            .bid("topicareamanager")
            .prename("Rolf")
            .surname("Topicareamanager")
            .mail("test@test.de")
            .externalCompany("N.N.")
            .passwordHash("ad34a4c6cfa60e394de76cf9fadff087cdb934b1112ba580cbef43f3aba8376347aed86b887ad81685c26f5c72439cfc0e724f9e1e022aa57a20d143a511c149")
            .role(Role.TOPICAREA_MANAGER)
            .build();
    private Person p4 = new PersonBuilder()
            .bid("user")
            .prename("Bibi")
            .surname("User")
            .mail("test@test.de")
            .externalCompany("N.N.")
            .passwordHash("ad34a4c6cfa60e394de76cf9fadff087cdb934b1112ba580cbef43f3aba8376347aed86b887ad81685c26f5c72439cfc0e724f9e1e022aa57a20d143a511c149")
            .role(Role.USER)
            .build();
    
    private TopicArea t1 = new TopicAreaBuilder()
            .name("OMS")
            .build();
    private TopicArea t2 = new TopicAreaBuilder()
            .name("AIMS")
            .build();
    private TopicArea t3 = new TopicAreaBuilder()
            .name("Coffee")
            .build();
    private TopicArea t4 = new TopicAreaBuilder()
            .name("Elastic")
            .build();
    private TopicArea t5 = new TopicAreaBuilder()
            .name("Organisation")
            .build();
    private TopicArea t6 = new TopicAreaBuilder()
            .name("Cloud")
            .build();
    private TopicArea t7 = new TopicAreaBuilder()
            .name("Illnes")
            .build();
   
}
