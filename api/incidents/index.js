const { connect, Incident } = require('../db');

module.exports = async function handler(req, res) {
    await connect();

    if (req.method === 'GET') {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        return res.status(200).json(incidents);
    }

    if (req.method === 'POST') {
        const incidentData = { ...req.body };

        if (!incidentData.caseId) {
            incidentData.caseId = `DS-${Date.now()}`;
        }

        const incident = new Incident(incidentData);
        await incident.save();
        return res.status(201).json(incident);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
};
