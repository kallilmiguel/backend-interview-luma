const { validateSync } = require("class-validator");

class PatientDTO {
    constructor(id, name, location, age, acceptedOffers, canceledOffers, averageReplyTime) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.age = age;
        this.acceptedOffers = acceptedOffers;
        this.canceledOffers = canceledOffers;
        this.averageReplyTime = averageReplyTime;
    }

    static validate(patient) {

        const patientInstance = Object.assign(new PatientDTO(), patient);

        const errors = validateSync(patientInstance);

        // Add manual validation for age, acceptedOffers, etc.
        if (typeof patientInstance.age !== "number" || patientInstance.age < 0 || patientInstance.age > 110) {
            errors.push({
                property: "age",
                constraints: { max: "age must not be greater than 110", min: "age must not be less than 0" },
                value: patientInstance.age,
            });
        }

        if (typeof patientInstance.acceptedOffers !== "number" || patientInstance.acceptedOffers < 0) {
            errors.push({
                property: "acceptedOffers",
                constraints: { min: "acceptedOffers must not be less than 0" },
                value: patientInstance.acceptedOffers,
            });
        }

        if (typeof patientInstance.canceledOffers !== "number" || patientInstance.canceledOffers < 0) {
            errors.push({
                property: "canceledOffers",
                constraints: { min: "canceledOffers must not be less than 0" },
                value: patientInstance.canceledOffers,
            });
        }

        if (typeof patientInstance.averageReplyTime !== "number" || patientInstance.averageReplyTime < 0) {
            errors.push({
                property: "averageReplyTime",
                constraints: { min: "averageReplyTime must not be less than 0" },
                value: patientInstance.acceptedOffers,
            });
        }

        if (errors.length > 0) {
            console.error(errors);
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}

module.exports = PatientDTO;
