const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Mock runs data matching your RunModel
let runs = Array.from({ length: 5 }, (_, i) => ({
    id: 12345 + i,
    _id: `12345${i}`,
    unitType: `metres`,
    distanceAmount: i,
    message: `Run ${i}`,
    dateRan: new Date().toISOString()
}));

// GET all runs
app.get('/runs', (req, res) => {
    res.json(runs);
});

// GET a single run by ID
app.get('/runs/:_id', (req, res) => {
    const { _id } = req.params;
    const run = runs.find(run => run._id === _id);
    if (run) {
        res.json([run]); // Return the run as an array with a single element
    } else {
        res.status(404).send('Run not found');
    }
});

// POST a new run
app.post('/runs', (req, res) => {
    const newRun = {
        id: 12345 + runs.length,
        _id: `12345${runs.length}`, // Ensure unique _id
        ...req.body,
        dateRan: new Date().toISOString() // Ensure dateRan is set to current date
    };
    runs.push(newRun);
    res.status(201).json(newRun);
});

// UPDATE a run by ID
app.put('/runs/:_id', (req, res) => {
    const { _id } = req.params;
    const index = runs.findIndex(run => run._id === _id); // Match using _id
    if (index !== -1) {
        runs[index] = { ...runs[index], ...req.body }; // Merge existing and new data
        res.json(runs[index]); // Return updated run
    } else {
        res.status(404).send('Run not found');
    }
});

// DELETE a run by ID
app.delete('/runs/:_id', (req, res) => {
    const { _id } = req.params;
    const index = runs.findIndex(run => run._id === _id);
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