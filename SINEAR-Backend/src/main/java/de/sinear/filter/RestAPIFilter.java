package de.sinear.filter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Optional;
import java.util.StringTokenizer;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.apache.commons.codec.binary.Base64;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import de.sinear.entities.Person;
import de.sinear.repository.PersonRepository;

@WebFilter
public class RestAPIFilter implements Filter{

	 private static final org.slf4j.Logger log = LoggerFactory.getLogger(RestAPIFilter.class);
	
	 private List<String> corsUrls = new ArrayList<>(Arrays.asList("http://localhost:5000", "http://127.0.0.1:5000", "http://0:0:0:0:0:0:0:1:5000"));
	 private List<String> alwaysAvailableUrls = new ArrayList<String>(Arrays.asList("/h2-console", "/restAPI/persons/authenticate"));
	 
	 private PersonRepository personRepository;
	 private String usernameRest;
	 private String passwordRest;
	 
	 public RestAPIFilter(final PersonRepository personRepository, final String usernameRest, final String passwordRest) {
		 this.personRepository = personRepository;
		 this.usernameRest = usernameRest;
		 this.passwordRest = passwordRest;	 
	 }
	 
	 @Override
	 public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		 
		 HttpServletRequest httpServletRequest = (HttpServletRequest) request;
	     HttpServletResponse httpServletResponse = (HttpServletResponse) response;
	     
	     String origin = httpServletRequest.getHeader("Origin");
	     for (String url : corsUrls) {
	        if (origin != null && origin.startsWith(url)) {
	                httpServletResponse.setHeader("Access-Control-Allow-Origin", origin);
	        }
	     }
	     
	     //Depending on the browser localhost uses IPv4 or IPv6. IPv6 "0:0:0:0:0:0:0:1" z.B. Chrome   IPv4 "127.0.0.1" z.B. FireFox
	     if (httpServletRequest.getRemoteAddr().equals("0:0:0:0:0:0:0:1") || httpServletRequest.getRemoteAddr().equals("127.0.0.1"))
	         httpServletResponse.setHeader("Access-Control-Allow-Origin", "*");
	     //Stop all unsafe requests
	     else if (!httpServletRequest.isSecure()) {
	    	 return; 
	     }
	     
	     httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");
	     httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	     httpServletResponse.setHeader("Access-Control-Allow-Headers", "X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, Authorization, sessionid");
	     
	     if (httpServletRequest.getMethod().equals(HttpMethod.OPTIONS.name())) {
	         return;
	     }
	     
	     String authHeader = httpServletRequest.getHeader("Authorization");	 
	     
	     String sessionId = httpServletRequest.getHeader("sessionid");
	     String reqEndpoint = httpServletRequest.getServletPath();
	     
	     if(authHeader != null && sessionId == null) {
	    	 StringTokenizer st = new StringTokenizer(authHeader);
	    	 if(st.hasMoreTokens()) {
	    		 
	    		 String basic = st.nextToken();
	    		 
	    		 if(basic.equalsIgnoreCase("Basic")) {
	    		   try {
	    			 String credentials = new String(Base64.decodeBase64(st.nextToken()), "UTF-8");
	    			 int p = credentials.indexOf(":");
	    			 if(p != -1) {
	    				 String username = credentials.substring(0, p).trim();
	    				 String password = credentials.substring(p + 1).trim();
	    				 
	    				 if(!username.equalsIgnoreCase(usernameRest) || !password.equalsIgnoreCase(passwordRest)) {
	    					 httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
	    					 return;
	    				 }
	    				 
	    				 /**In case there is a valid basic authentication the request will be a admin request. This case is mainly used to make request e.q. from postman.*/
	    				 Optional<Person> person = personRepository.findByIdIgnoreCase("admin");
	    				 httpServletRequest.setAttribute("reqUser", person.get());
	    				 chain.doFilter(httpServletRequest, httpServletResponse);
	    			 }else {
	    				 httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
	    				 return;
	    			 }
	    				 
	    		   }catch(UnsupportedEncodingException e) {
	    			   log.error("Couldn't retrieve authentication", e);
	    		   }
	    		 }
	    	 }
	     /**This case will be the none development use-case. It checks for a valid sessionId and tracks the role of the request owner through the requestAttribute(reqUser).*/
	     }else {
	    	 
	    	 if (!accessGranted(reqEndpoint, sessionId, httpServletRequest)) {
	             httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
	             return;
	         }
	    	 
	    	 httpServletResponse.addHeader("sessionid", sessionId);
	         chain.doFilter(httpServletRequest, httpServletResponse);
	     }
	     
	    
	 }
	 
	 
	 public boolean accessGranted(String endpoint, String sessionId, HttpServletRequest httpServletRequest) {
	        for (String url : alwaysAvailableUrls) {
	            if (endpoint.startsWith(url)) return true;
	        }
	        List<Person> personList = personRepository.findBySessionId(sessionId);
	        if (personList.size() != 1) return false;
	        Person person = personList.get(0);
	        // Mit Hilfe des verifizierten Attributs können andere Funktionen Restriktionen einbauen
	        httpServletRequest.setAttribute("reqUser", person);
	        if (person.getSessionIdExpiryDate().before(new GregorianCalendar())) return false;
	        person.updateExpiryDate();
	        personRepository.save(person);
	       return true;
	    }
}
