package fi.kj.caddie.domain;

import org.joda.time.DateTime;

public class RoundHeader {

	String id;
	DateTime timestamp;
	String caption;
	Integer strokes;
	Integer toPar;
	
	public String getId() {
		return id;
	}
	
	public DateTime getTimestamp() {
		return timestamp;
	}
	
	public String getCaption() {
		return caption;
	}
	
	public Integer getStrokes() {
		return strokes;
	}
	
	public Integer getToPar() {
		return toPar;
	}
}
