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
    caseId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    description: String,
    location: String,
    severity: { type: String, default: 'low' },
    status: { type: String, default: 'active' },
    reportedBy: String,
    contact: String,
    people: String,
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Incident = mongoose.model('Incident', incidentSchema);

// Routes
app.get('/api/incidents', async (req, res) => {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
});

app.post('/api/incidents', async (req, res) => {
    const incidentData = { ...req.body };

    // Ensure a caseId exists (frontend may provide one)
    if (!incidentData.caseId) {
        incidentData.caseId = `DS-${Date.now()}`;
    }

    const incident = new Incident(incidentData);
    await incident.save();
    res.status(201).json(incident);
});

app.delete('/api/incidents/:id', async (req, res) => {
    const { id } = req.params;
    await Incident.findByIdAndDelete(id);
    res.json({ success: true });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});