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
Each measure is normalized to scale its values between 0 and 1:
- **Age**: Directly proportional to the score.
  \[
  \text{normalizedAge} = \frac{\text{patient.age}}{\text{maxValues.age}}
  \]
- **Distance**: Inversely proportional to the score.
  \[
  \text{normalizedDistance} = 1 - \frac{\text{distance}}{\text{maxValues.distance}}
  \]
- **Accepted Offers**: Directly proportional to the score.
  \[
  \text{normalizedAcceptedOffers} = \frac{\text{patient.acceptedOffers}}{\text{maxValues.acceptedOffers}}
  \]
- **Canceled Offers**: Inversely proportional to the score.
  \[
  \text{normalizedCanceledOffers} = 1 - \frac{\text{patient.canceledOffers}}{\text{maxValues.canceledOffers}}
  \]
- **Reply Time**: Inversely proportional to the score.
  \[
  \text{normalizedReplyTime} = 1 - \frac{\text{patient.averageReplyTime}}{\text{maxValues.replyTime}}
  \]

### **3. Weighted Scoring**
Each normalized value is multiplied by its weight to contribute to the final score:
- **Weights**:
  - Age: 10%
  - Distance: 10%
  - Accepted Offers: 30%
  - Canceled Offers: 30%
  - Reply Time: 20%

The final raw score is calculated as:
\[
\text{rawScore} = (\text{normalizedAge} \cdot \text{ageWeight}) + (\text{normalizedDistance} \cdot \text{distanceWeight}) + (\text{normalizedAcceptedOffers} \cdot \text{acceptedOffersWeight}) + (\text{normalizedCanceledOffers} \cdot \text{canceledOffersWeight}) + (\text{normalizedReplyTime} \cdot \text{replyTimeWeight})
\]

### **4. Scaling**
The raw score is scaled to the range \([1, 10]\) using the rule of three:
\[
\text{scaledScore} = 1 + (\text{rawScore} \cdot 9)
\]

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

#### Request
```json
{
    "location": {
        "lat": 46.0,
        "long": -65.0
    }
}
```

#### Response
```json
[
    {
        "id": "123",
        "name": "John Doe",
        "score": "9.34"
    },
    {
        "id": "124",
        "name": "Jane Smith",
        "score": "8.75"
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
        "lat": 46.0,
        "long": -65.0
    }
}'
```

---

## **Future Enhancements**
- Add more detailed unit tests for edge cases.
- Include logging for better debugging.
- Optimize performance for large datasets.

---

This `README.md` provides a detailed explanation of the scoring function and a high-level overview of the remaining components.

