package de.sinear.dao.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import de.sinear.dao.PersonDao;
import de.sinear.entities.Person;

@Transactional
@Repository
public class PersonDaoImpl implements PersonDao{

	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	@Override
	public List<Person> findAll() {
		List<Person> employees = null;
		
		String hql = "FROM Person as p ORDER BY p.id";
		employees = (List<Person>) entityManager.createQuery(hql).getResultList();
		
		return employees;
	}
}

