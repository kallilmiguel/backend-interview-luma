# Patient Prioritization API

This API provides a scoring and ranking system to prioritize patients based on their likelihood of accepting a medical appointment. The scoring function utilizes patient demographics, location, and behavioral data to compute a weighted score for each patient. The API exposes an endpoint to process patients and return the top 10 prioritized candidates.

---

## **Features**
- **Patient Scoring**: Calculates a score (on a scale of 1 to 10) for each patient based on various factors such as age, location, acceptance/cancellation history, and response time.
- **Haversine Distance Calculation**: Determines the distance between the patient’s location and the facility using latitude and longitude.
- **Data Validation**: Uses DTOs to ensure that patient and location data are valid before processing.
- **REST API**: Accepts a facility location and processes a list of patients to return the top 10 candidates.

---

## **Scoring Function: Detailed Explanation**

The scoring logic is the heart of the application and determines the rank of patients based on the following factors:

### **1. Inputs**
- **Patient Data**:
  - Age
  - Location (latitude, longitude)
  - Accepted Offers
  - Canceled Offers
  - Average Reply Time
- **Facility Location**:
  - Latitude and longitude of the facility where the appointment will take place.

### **2. Normalization**
Each measure is normalized to scale its values between 0 and 1. All max values were calculated using the maximum value of the dataset, except the distance measure, which was used the [Antipodal Distance](https://knowledge-enrichment.quora.com/https-www-quora-com-What-is-the-longest-distance-between-any-two-places-on-earth-answer-Rachna-Sharma-623#:~:text=The%20longest%20distance%20between%20any%20two%20places%20on%20Earth%20is%2C%20and%20it%20occurs%20betw%E2%80%A6):

- **Age**: Directly proportional to the score.
  - $$normalizedAge = \frac{patientAge}{maxAge}$$
  
- **Distance**: Inversely proportional to the score.
  - $$normalizedDistance = \frac{patientDistance}{antipodalDistance}$$
  
- **Accepted Offers**: Directly proportional to the score.
  - $$normalizedAcceptedOffers = \frac{acceptedOffers}{maxAcceptedOffers}$$
  
- **Canceled Offers**: Inversely proportional to the score.
  - $$normalizedCancelledOffers = \frac{patientCancelledOffers}{maxCancelledOffers}$$
  
- **Reply Time**: Inversely proportional to the score.
  - $$normalizedReplyTime = \frac{patientReplyTime}{maxReplyTime}$$

### **3. Weighted Scoring**
Each normalized value is multiplied by its weight to contribute to the final score:
- **Weights**:
  - Age: 10%
  - Distance: 10%
  - Accepted Offers: 30%
  - Canceled Offers: 30%
  - Reply Time: 20%

The final raw score is calculated as:
  $$\text{rawScore} = (\text{normalizedAge} \cdot \text{ageWeight}) + (\text{normalizedDistance} \cdot \text{distanceWeight}) + (\text{normalizedAcceptedOffers} \cdot \text{acceptedOffersWeight}) + (\text{normalizedCanceledOffers} \cdot \text{canceledOffersWeight}) +     (\text{normalizedReplyTime} \cdot \text{replyTimeWeight})$$

### **4. Scaling**
The raw score is scaled to the range \([1, 10]\) using the rule of three:
  $$\text{scaledScore} = 1 + (\text{rawScore} \cdot 9)$$

---

## **Project Structure**

### **File Breakdown**
- **`index.js`**:
  - Exposes a REST API endpoint `/patients`.
  - Accepts a JSON object with the facility location and processes the patient list.
  - Returns the top 10 patients based on their scores.

- **`maxValues.js`**:
  - Stores the maximum values for each measure (e.g., age, distance, accepted offers) derived from the dataset.
  - Used for normalization in the scoring function.

- **`scoring.js`**:
  - Core logic for scoring patients and processing the dataset.
  - Validates input data using DTOs (`PatientDTO` and `FacilityLocationDTO`).
  - Calculates scores and returns a sorted list of patients.

- **`utils.js`**:
  - Implements the Haversine formula to calculate the distance between two geographical points (latitude and longitude).

### **Data Transfer Objects (DTOs)**
DTOs are used to validate the structure and constraints of incoming data:
- **`PatientDTO`**:
  - Ensures that patient data (age, accepted offers, etc.) is within valid ranges.
- **`FacilityLocationDTO`**:
  - Validates the facility location coordinates.

---

## **API Documentation**

### **POST /patients**
Processes the patient list and returns the top 10 candidates based on their scores.

#### Request Body
```json
{
    "location": {
        "lat": 15.0,
        "long": -20.0
    }
}
```

#### Response Body
```json
[
    {
        "id": "f7f4b340-7944-4f4f-bcba-30b9d7bf4c2a",
        "name": "Adeline Corwin",
        "score": "9.14"
    },
    {
        "id": "213097a3-cae1-48cf-b266-a361a972ff27",
        "name": "Tamara Roberts",
        "score": "9.13"
    },
    ...
]
```

#### Error Response
- **400 Bad Request**:
  - Missing or invalid location in the request body.
  - Validation errors for patient data.

---

## **How to Run**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start the Server**
```bash
node src/index.js
```

### **3. Test the API**
Use tools like `Postman` or `curl` to test the `/patients` endpoint.

Example:
```bash
curl -X POST http://localhost:3000/patients \
-H "Content-Type: application/json" \
-d '{
    "location": {
        "lat": 15.0,
        "long": -20.0
    }
}'
```

---

