package fi.kj.caddie.service;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import fi.kj.caddie.domain.Round;

public interface RoundRepository extends MongoRepository<Round, String> {

	List<Round> findByDeviceId(String deviceId);

	Round findById(String id);

}
