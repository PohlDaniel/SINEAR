package de.sinear.dao;

import java.util.List;

import de.sinear.entities.Person;

public interface PersonDao {

	List<Person> findAll();
}
