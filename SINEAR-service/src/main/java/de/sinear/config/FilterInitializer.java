package de.sinear.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import de.sinear.filter.RestAPIFilter;
import de.sinear.repository.PersonRepository;

@Configuration
public class FilterInitializer {

	@Autowired
	PersonRepository personRepository;
	
	@Value("${credentials.rest.username}")
	private String usernameRest;
	
	@Value("${credentials.rest.password}")
	private String passwordRest;
	
	@Bean
	public FilterRegistrationBean<RestAPIFilter> restAPIFilterRegistration() {
		FilterRegistrationBean<RestAPIFilter> registration = new FilterRegistrationBean<RestAPIFilter>();
		registration.setFilter(new RestAPIFilter(personRepository, usernameRest, passwordRest));
		registration.addUrlPatterns("/restAPI/*");
		return registration;
	}
}
