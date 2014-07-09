package fi.kj.caddie.service;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

import com.sendgrid.SendGrid;
import com.sendgrid.SendGrid.Email;
import com.sendgrid.SendGridException;

@Service
@ConfigurationProperties("email")
public class EmailService {

	private String fromAddress;
	private String fromName;

	private SendGrid grid;

	public EmailService() {
		grid = new SendGrid("klaxuz", "Ms-k5Mxz");
	}
	
	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}
	
	public void setFromName(String fromName) {
		this.fromName = fromName;
	}

	public void sendRoundToEmail(String roundData, String recipient) {

		System.out.println(fromAddress);
		
		Email mail = new Email();
		mail.addTo(recipient);
		mail.setFrom(fromAddress);
		mail.setFromName(fromName);
		mail.setSubject("Your round data from Caddie");
		mail.setText(roundData);

		System.out.println("Sending email of round");
		try {
			SendGrid.Response response = grid.send(mail);
			System.out.println(response.getMessage());
		} catch (SendGridException e) {
			System.out.println("Failed to send email");
			e.printStackTrace();
		}
	}
}
