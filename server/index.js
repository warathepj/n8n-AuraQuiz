const express = require('express');
const path = require('path');
const axios = require('axios'); // New import for axios

const app = express();
app.use(express.json()); // Enable parsing of JSON request bodies
const PORT = process.env.PORT || 3000;

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, '../src')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src', 'index.html'));
});

app.post('/submit-quiz', async (req, res) => { // Make the function async
    const { keyword, quizLevel } = req.body;
    console.log('Received quiz submission:');
    console.log('Keyword:', keyword);
    console.log('Quiz Level:', quizLevel);

    const webhookUrl = 'http://localhost:5678/webhook-test/43ff1db1-c591-4114-bdc8-8b9996dd4fed';

    try {
        // Forward data to the webhook
        await axios.post(webhookUrl, { keyword, quizLevel });
        console.log('Data successfully forwarded to webhook.');
    } catch (error) {
        console.error('Error forwarding data to webhook:', error.message);
        // Optionally, you might want to send a different status code or message to the client
        // if the webhook forwarding is critical. For now, we'll just log the error.
    }

    res.json({ message: 'Data received successfully and forwarded!', keyword, quizLevel });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
