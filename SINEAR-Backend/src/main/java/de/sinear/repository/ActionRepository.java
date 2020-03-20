package de.sinear.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import de.sinear.entities.Action;


@Repository
public interface ActionRepository extends CrudRepository<Action, String> {
}
