const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Connection error:', err));

// Example: Incidents schema
const incidentSchema = new mongoose.Schema({
    type: String,
    location: String,
    severity: String,
    status: { type: String, default: 'active' },
    reportedBy: String,
    createdAt: { type: Date, default: Date.now }
});

const Incident = mongoose.model('Incident', incidentSchema);

// Routes
app.get('/api/incidents', async (req, res) => {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
});

app.post('/api/incidents', async (req, res) => {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});