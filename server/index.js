const express = require('express');
const path = require('path');
const axios = require('axios'); // New import for axios
const fs = require('fs'); // Import the fs module

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
    const { keyword, quizLevel, sessionId } = req.body;
    console.log('Received quiz submission:');
    console.log('Keyword:', keyword);
    console.log('Quiz Level:', quizLevel);
    console.log('Session ID:', sessionId);

    const webhookUrl = 'http://localhost:5678/webhook/43ff1db1-c591-4114-bdc8-8b9996dd4fed';

    try {
        // Forward data to the webhook and capture the response
        const webhookResponse = await axios.post(webhookUrl, { keyword, quizLevel, sessionId });
        console.log('Data successfully forwarded to webhook.');
        console.log('Webhook response:', webhookResponse.data); // Log the webhook's response data
    } catch (error) {
        console.error('Error forwarding data to webhook:', error.message);
        if (error.response) {
            console.error('Webhook response error data:', error.response.data);
        }
        // Optionally, you might want to send a different status code or message to the client
        // if the webhook forwarding is critical. For now, we'll just log the error.
    }

    res.json({ message: 'Data received successfully and forwarded!', keyword, quizLevel, sessionId });
});

// New endpoint to receive webhook responses and save to quiz.json
app.post('/webhook-response', (req, res) => {
    const webhookData = req.body;
    console.log('Received data from webhook:', webhookData);

    fs.writeFile(path.join(__dirname, 'quiz.json'), JSON.stringify(webhookData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to quiz.json:', err);
            return res.status(500).json({ message: 'Error saving webhook data.' });
        }
        console.log('Webhook data successfully saved to quiz.json');
        res.json({ message: 'Webhook data received and saved successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
