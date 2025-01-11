const express = require('express');
const bodyParser = require('body-parser');
const { processPatients } = require('./scoring');
const patients = require('../sample-data/patients.json');

const app = express();
app.use(bodyParser.json());

app.post('/patients', (req, res) => {
    const { location } = req.body;
    if (!location || !location.lat || !location.long) {
        return res.status(400).send('Invalid location');
    } 
    try{
        const topPatients = processPatients(patients, location).slice(0, 10);
        res.json(topPatients);
    } catch(e){
        res.status(400).send(e.message);
    }
    
    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})