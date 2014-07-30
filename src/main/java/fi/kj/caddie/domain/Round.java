package fi.kj.caddie.domain;

import java.util.UUID;

import org.joda.time.DateTime;
import org.springframework.data.annotation.Id;

public class Round {

	@Id
	private String id;
	public String deviceId;
	public DateTime timestamp;
	
	public String courseName;
	public Double hcp;
	public Integer gameHcp;
	public Double newHcp;
	
	public RoundData data;
	
	public String version;
	
	public void generateId() {
		this.id = UUID.randomUUID().toString();
		this.timestamp = new DateTime();
	}
	
	public RoundHeader getHeader() {
		RoundHeader header = new RoundHeader();
		header.id = id;
		header.caption = courseName;
		header.timestamp = timestamp;
		header.strokes = data.strokes;
		header.toPar = data.toPar;
		
		return header;
	}

	public String getId() {
		return id;
	}
}
