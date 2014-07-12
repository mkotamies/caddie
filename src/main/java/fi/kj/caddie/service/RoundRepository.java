package fi.kj.caddie.service;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import fi.kj.caddie.rest.RoundData;

public interface RoundRepository extends MongoRepository<RoundData, String> {

	List<RoundData> findByDeviceId(String deviceId);

}
