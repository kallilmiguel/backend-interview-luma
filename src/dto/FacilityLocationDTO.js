const { validateSync } = require("class-validator");

class FacilityLocationDTO {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;
    }

    static validate(facilityLocation) {

        const facilityLocationInstance = Object.assign(new FacilityLocationDTO(), facilityLocation);

        const errors = validateSync(facilityLocationInstance);

        if (typeof facilityLocationInstance.lat !== "number"){
            errors.push({
                property: "lat",
                constraints: { isNumber: "lat must be a number" },
                value: facilityLocationInstance.lat,
            });
        } 
        if(typeof facilityLocationInstance.long !== "number") {
            errors.push({
                property: "long",
                constraints: { isNumber: "long must be a number" },
                value: facilityLocationInstance.long,
            });
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}

module.exports = FacilityLocationDTO;
