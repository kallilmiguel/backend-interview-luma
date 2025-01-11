const { plainToInstance } = require("class-transformer");
const { validateSync } = require("class-validator");
const maxValues = require("./maxValues");
const PatientDTO = require("./dto/PatientDTO");
const FacilityLocationDTO = require("./dto/FacilityLocationDTO");
const calculateDistance = require('./utils').calculateDistance;

function scorePatient(patient, facilityLocation) {

    const ageWeight = 0.1;
    const distanceWeight = 0.1;
    const acceptedOffersWeight = 0.3;
    const canceledOffersWeight = 0.3;
    const replyTimeWeight = 0.2;

    // Calculate distance
    const distance = calculateDistance(
        { 
            lat: parseFloat(patient.location.latitude), 
            long: parseFloat(patient.location.longitude) 
        },
        facilityLocation
    );

    // Normalize each measure
    const normalizedAge = patient.age / maxValues.age; // Directly proportional
    const normalizedDistance = 1 - (distance / maxValues.distance); // Inversely proportional
    const normalizedAcceptedOffers = patient.acceptedOffers / maxValues.acceptedOffers; // Directly proportional
    const normalizedCanceledOffers = 1 - (patient.canceledOffers / maxValues.canceledOffers); // Inversely proportional
    const normalizedReplyTime = 1 - (patient.averageReplyTime / maxValues.replyTime); // Inversely proportional

    // Calculate weighted score
    let score = 0;
    score += normalizedAge * ageWeight;
    score += normalizedDistance * distanceWeight;
    score += normalizedAcceptedOffers * acceptedOffersWeight;
    score += normalizedCanceledOffers * canceledOffersWeight;
    score += normalizedReplyTime * replyTimeWeight;

    // Scale score to [1, 10]
    const scaledScore = 1 + (score - 0) * (10 - 1) / (1 - 0);

    return scaledScore.toFixed(2);
}
function processPatients(patients, facilityLocation) {

    // Validate facility location
    try{
        FacilityLocationDTO.validate(facilityLocation);
    }
    catch(e){
        throw e;
    }

    return patients.map(patient => {
        // Validate patient
        try{
            PatientDTO.validate(patient);
        }
        catch(e){
            throw e;
        }
        return{
            id: patient.id,
            name: patient.name,
            score: scorePatient(patient, facilityLocation)
        }
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = { scorePatient, processPatients };