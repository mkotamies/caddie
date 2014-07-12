package fi.kj.caddie.rest;

import java.util.UUID;

import org.joda.time.DateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="rounds")
public class RoundData {

	@Id
	private String id;
	private String deviceId;
	private DateTime timestamp;
	private String caption;
	private Long strokes;
	private Long toPar;
	private String data;
	
	public String getId() {
		return id;
	}
	
	public String getDeviceId() {
		return deviceId;
	}
	
	public DateTime getTimestamp() {
		return timestamp;
	}
	
	public String getCaption() {
		return caption;
	}
	
	public String getData() {
		return data;
	}
	
	public Long getStrokes() {
		return strokes;
	}
	
	public Long getToPar() {
		return toPar;
	}

	public void generateId() {
		this.id = UUID.randomUUID().toString();
		this.timestamp = new DateTime();
	}
	
	public RoundHeader getHeader() {
		RoundHeader header = new RoundHeader();
		header.id = id;
		header.caption = caption;
		header.timestamp = timestamp;
		header.strokes = strokes;
		header.toPar = toPar;
		
		return header;
	}
}
