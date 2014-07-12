package fi.kj.caddie.rest;

import org.joda.time.DateTime;

public class RoundHeader {

	String id;
	DateTime timestamp;
	String caption;
	
	public String getId() {
		return id;
	}
	
	public DateTime getTimestamp() {
		return timestamp;
	}
	
	public String getCaption() {
		return caption;
	}
}
