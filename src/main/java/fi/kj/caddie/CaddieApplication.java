package fi.kj.caddie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.joda.JodaModule;

@Configuration
@EnableAutoConfiguration
@ComponentScan
public class CaddieApplication {

	@Bean
	public Module jodaModule() {
		return new JodaModule();
	}

	public static void main(String[] args) {
		SpringApplication.run(CaddieApplication.class, args);
	}
}
