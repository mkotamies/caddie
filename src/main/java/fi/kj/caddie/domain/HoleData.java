package fi.kj.caddie.domain;

import java.util.List;

public class HoleData {
	
	public Integer par;
	public Integer length;
	public Integer hcp;
	public Integer gamePar;
	
	public Integer strokes;
	
	public List<StrokeInfo> opening;
	public List<StrokeInfo> approach;
	public List<StrokeInfo> chip;
	public List<StrokeInfo> puts;
}
