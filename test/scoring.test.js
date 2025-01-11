const { processPatients } = require("../src/scoring");

describe("Scoring Logic", () => {
    test("Valid patients and location", () => {
        const patients = [
            {
                id: "1",
                name: "Yoda Skywalker",
                location: { latitude: "45.0", longitude: "-75.0" },
                age: 30,
                acceptedOffers: 15,
                canceledOffers: 3,
                averageReplyTime: 200
            },
            {
                id: "2",
                name: "Gandalf the Grey",
                location: { latitude: "44.5", longitude: "-75.5" },
                age: 50,
                acceptedOffers: 20,
                canceledOffers: 5,
                averageReplyTime: 300
            }
        ];
        const facilityLocation = { lat: 45.0, long: -75.0 };

        const result = processPatients(patients, facilityLocation);
        expect(+result[0].score).toBeGreaterThan(1);
        expect(+result[0].score).toBeLessThanOrEqual(10);
    });

    test("Patients sorted by score", () => {
        const patients = [
            {
                id: "1",
                name: "LeBron James",
                location: { latitude: "45.0", longitude: "-75.0" },
                age: 35,
                acceptedOffers: 10,
                canceledOffers: 2,
                averageReplyTime: 100
            },
            {
                id: "2",
                name: "Cristiano Ronaldo",
                location: { latitude: "50.0", longitude: "-80.0" },
                age: 28,
                acceptedOffers: 8,
                canceledOffers: 4,
                averageReplyTime: 250
            }
        ];
        const facilityLocation = { lat: 45.0, long: -75.0 };

        const result = processPatients(patients, facilityLocation);
        expect(result[0].name).toBe("LeBron James");
        expect(result[1].name).toBe("Cristiano Ronaldo");
    });

    test("Invalid patient data should throw", () => {
        const invalidPatients = [
            {
                id: "1",
                name: "Sheldon Cooper",
                location: { latitude: "45.0", longitude: "-75.0" },
                age: 150, // Invalid age
                acceptedOffers: 10,
                canceledOffers: 5,
                averageReplyTime: 300
            }
        ];
        const facilityLocation = { lat: 45.0, long: -75.0 }; // Ensure schema is correct
    
        expect(() => processPatients(invalidPatients, facilityLocation)).toThrow();
    });

    test("Invalid facility location should throw", () => {
        const patients = [
            {
                id: "1",
                name: "Bilbo Baggins",
                location: { latitude: "45.0", longitude: "-75.0" },
                age: 40,
                acceptedOffers: 10,
                canceledOffers: 5,
                averageReplyTime: 300
            }
        ];
        const invalidLocation = { lat: "invalid", long: -75.0 };

        expect(() => processPatients(patients, invalidLocation)).toThrow();
    });
});
