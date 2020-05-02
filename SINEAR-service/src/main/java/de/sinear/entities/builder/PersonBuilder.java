package de.sinear.entities.builder;

import java.util.GregorianCalendar;

import org.apache.commons.lang3.builder.Builder;

import de.sinear.entities.Person;
import de.sinear.entities.enums.Role;



public class PersonBuilder implements Builder<Person>{

	private Person person;
	
	public PersonBuilder() {
	
		this.person = new Person();
	}

	public PersonBuilder bid(String bid) {
		this.person.setId(bid);
		return this;
	}

	public PersonBuilder surname(String surname) {
		this.person.setSurname(surname);
		return this;
	}

	public PersonBuilder prename(String prename) {
		this.person.setPrename(prename);
		return this;
	}

	public PersonBuilder mail(String mail) {
		this.person.setMail(mail);
		return this;
	}

	public PersonBuilder externalCompany(String externalCompany) {
		this.person.setExternalCompany(externalCompany);
		return this;
	}

	public PersonBuilder passwordHash(String passwordHash) {
		this.person.setPasswordHash(passwordHash);
		return this;
	}

	public PersonBuilder role(Role role) {
		this.person.setRole(role);
		return this;
	}

	public PersonBuilder sessionId(String sessionId) {
		this.person.setSessionId(sessionId);
		return this;
	}

	public PersonBuilder sessionIdExpiryDate(GregorianCalendar sessionIdExpiryDate) {
		this.person.setSessionIdExpiryDate(sessionIdExpiryDate);
		return this;
	}
	
	@Override
	public Person build() {

	     return person;
	  }
	
}
