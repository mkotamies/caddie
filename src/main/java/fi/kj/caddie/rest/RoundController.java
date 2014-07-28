package fi.kj.caddie.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fi.kj.caddie.domain.Round;
import fi.kj.caddie.domain.RoundHeader;
import fi.kj.caddie.service.RoundRepository;

@RestController
@RequestMapping("/api/rounds")
public class RoundController {
	
	@Autowired
	private RoundRepository roundRepo;

	@RequestMapping(value = "/", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String saveRound(@RequestBody Round roundData) {
		
		roundData.generateId();
		
		Round saved = roundRepo.save(roundData);
		return saved.getId(); 
	}
	
	@RequestMapping(value = "/headers", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<RoundHeader> listRoundHeaders(@RequestParam("deviceId") String deviceId) {
		
		List<Round> data = roundRepo.findByDeviceId(deviceId);
		
		List<RoundHeader> headers = new ArrayList<>(data.size());
		
		for(Round entry : data) {
			headers.add(entry.getHeader());
		}
		
		return headers;
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Round getRound(@PathVariable("id") String id) {
		return roundRepo.findById(id);
	}
}
