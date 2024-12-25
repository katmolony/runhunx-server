const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Mock runs data matching your updated RunModel
let runs = Array.from({ length: 5 }, (_, i) => ({
    id: 12345 + i,
    _id: `12345${i}`,
    unitType: `metres`,
    distanceAmount: i,
    message: `Run ${i}`,
    dateRan: new Date().toISOString(),
    email: `runner${i}@example.com` // Add email field
}));

// GET all runs, regardless of email
app.get('/runs', (req, res) => {
    res.json(runs);
});

// GET all runs by email
app.get('/runs/:email', (req, res) => {
    const { email } = req.params;
    const userRuns = runs.filter(run => run.email === email);
    if (userRuns.length > 0) {
        res.json(userRuns);
    } else {
        res.status(404).send('No runs found for this email');
    }
});

// GET a single run by email and id
app.get('/runs/:email/:id', (req, res) => {
    const { email, id } = req.params;
    const run = runs.find(run => run.email === email && run._id === id);
    if (run) {
        res.json([run]); // Return the run as an array with a single element
    } else {
        res.status(404).send('Run not found');
    }
});

// POST a new run for a specific email
app.post('/runs/:email', (req, res) => {
    const { email } = req.params;
    const newRun = {
        id: 12345 + runs.length,
        _id: `12345${runs.length}`, // Ensure unique _id
        email, // Set email from URL parameter
        ...req.body,
        dateRan: new Date().toISOString() // Ensure dateRan is set to current date
    };
    runs.push(newRun);
    res.status(201).json(newRun);
});

// UPDATE a run by email and id
app.put('/runs/:email/:id', (req, res) => {
    const { email, id } = req.params;
    const index = runs.findIndex(run => run.email === email && run._id === id);
    if (index !== -1) {
        runs[index] = { ...runs[index], ...req.body }; // Merge existing and new data
        res.json(runs[index]); // Return updated run
    } else {
        res.status(404).send('Run not found');
    }
});

// DELETE a run by email and id
app.delete('/runs/:email/:id', (req, res) => {
    const { email, id } = req.params;
    const index = runs.findIndex(run => run.email === email && run._id === id);
    if (index !== -1) {
        const [deletedRun] = runs.splice(index, 1); // Destructure to get the object
        res.json(deletedRun); // Return the object directly
    } else {
        res.status(404).send('Run not found');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
