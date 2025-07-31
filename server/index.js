const express = require('express');
const path = require('path');

const app = express();
app.use(express.json()); // Enable parsing of JSON request bodies
const PORT = process.env.PORT || 3000;

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, '../src')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src', 'index.html'));
});

app.post('/submit-quiz', (req, res) => {
    const { keyword, quizLevel } = req.body;
    console.log('Received quiz submission:');
    console.log('Keyword:', keyword);
    console.log('Quiz Level:', quizLevel);
    res.json({ message: 'Data received successfully!', keyword, quizLevel });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
