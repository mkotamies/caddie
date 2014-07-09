package fi.kj.caddie.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fi.kj.caddie.service.EmailService;

@RestController
@RequestMapping("/api/rounds")
public class RoundController {
	
	@Autowired
	private EmailService mailService;

	@RequestMapping(value = "/", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseStatus(HttpStatus.OK)
	public void saveRound(@RequestBody RoundData roundData) {
		
		mailService.sendRoundToEmail(roundData.getData(), roundData.getEmail());
	}
}
