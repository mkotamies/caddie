package fi.kj.caddie.domain;

import java.util.Map;

public class RoundData {

	public String tee;
	public Integer slope;
	public Double cr;
	public Integer par;
	
	public Integer strokes;
	public Integer toPar;
	
	public Map<String, HoleData> holes;
}
