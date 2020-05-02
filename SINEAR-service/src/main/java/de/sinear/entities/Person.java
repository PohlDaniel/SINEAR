package de.sinear.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import de.sinear.entities.enums.Role;

import javax.persistence.*;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Person {

    @Id
    private String id;

    private String surname;

    private String prename;

    private String mail;

    private String externalCompany;

    @JsonIgnore
    private String passwordHash;

    private Role role;

    private String sessionId;

    private GregorianCalendar sessionIdExpiryDate;

    private String passwortResetToken;

    private GregorianCalendar passwortResetTokenExpiryDate;

    @ManyToMany(mappedBy = "persons", fetch = FetchType.EAGER)
    @JsonIgnoreProperties("persons")
    private Set<TopicArea> topicAreas = new HashSet<>();

    public Person() {
    }

    @PreRemove
    private void removeTopicAreas() {
        for (TopicArea topicArea : topicAreas) {
            topicArea.getPersons().remove(this);
        }
    }

    public void updateExpiryDate() {
        GregorianCalendar cal = new GregorianCalendar();
        cal.add(GregorianCalendar.MINUTE, 20);
        setSessionIdExpiryDate(cal);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return  Objects.equals(id, person.id) &&
                Objects.equals(surname, person.surname) &&
                Objects.equals(prename, person.prename) &&
                Objects.equals(mail, person.mail) &&
                Objects.equals(externalCompany, person.externalCompany) &&
                role == person.role &&
                Objects.equals(sessionId, person.sessionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, surname, prename, mail, externalCompany, role, sessionId);
    }

    @Override
    public String toString() {
        return "Person{" +
                "id='" + id + '\'' +
                ", surname='" + surname + '\'' +
                ", prename='" + prename + '\'' +
                ", mail='" + mail + '\'' +
                ", externalCompany='" + externalCompany + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                ", role=" + role +
                ", sessionId='" + sessionId + '\'' +
                ", sessionIdExpiryDate=" + sessionIdExpiryDate +
                '}';
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getPrename() {
		return prename;
	}

	public void setPrename(String prename) {
		this.prename = prename;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getExternalCompany() {
		return externalCompany;
	}

	public void setExternalCompany(String externalCompany) {
		this.externalCompany = externalCompany;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public GregorianCalendar getSessionIdExpiryDate() {
		return sessionIdExpiryDate;
	}

	public void setSessionIdExpiryDate(GregorianCalendar sessionIdExpiryDate) {
		this.sessionIdExpiryDate = sessionIdExpiryDate;
	}

	public String getPasswortResetToken() {
		return passwortResetToken;
	}

	public void setPasswortResetToken(String passwortResetToken) {
		this.passwortResetToken = passwortResetToken;
	}

	public GregorianCalendar getPasswortResetTokenExpiryDate() {
		return passwortResetTokenExpiryDate;
	}

	public void setPasswortResetTokenExpiryDate(GregorianCalendar passwortResetTokenExpiryDate) {
		this.passwortResetTokenExpiryDate = passwortResetTokenExpiryDate;
	}

	public Set<TopicArea> getTopicAreas() {
		return topicAreas;
	}

	public void setTopicAreas(Set<TopicArea> topicAreas) {
		this.topicAreas = topicAreas;
	}
    
    
}
