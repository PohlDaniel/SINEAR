package de.sinear.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

	@Bean
	WebMvcConfigurer configurer() {
		return new WebMvcConfigurer() {
			
			//@Override
			//public void addResourceHandlers(ResourceHandlerRegistry registry) {
			//	registry.addResourceHandler("/sinear/**").addResourceLocations("/");
			//}
			
			@Override
			public void addViewControllers(ViewControllerRegistry registry) {
				registry.addViewController("/login").setViewName("redirect:/index.html");
			}
		};
	}
}
