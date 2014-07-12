package fi.kj.caddie;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.authentication.UserCredentials;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;

@Configuration
@EnableMongoRepositories(basePackages = "fi.kj.caddie.service")
@ConfigurationProperties("mongo")
public class MongoConfig extends AbstractMongoConfiguration {

	 private String url;
	 
	 private String database;
	 
	 private String username;
	 
	 private String password;
	
	@Override
	protected String getDatabaseName() {
		return database;
	}

	@Override
	public Mongo mongo() throws Exception {
		return new MongoClient(new MongoClientURI(url));
	}
	
	@Override
	protected UserCredentials getUserCredentials() {
		return new UserCredentials(username, password);
	}
	
	
	public void setUrl(String url) {
		this.url = url;
	}
	
	public void setDatabase(String database) {
		this.database = database;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}

}
