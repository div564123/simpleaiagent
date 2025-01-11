const express = require('express');
const app = express();
require('dotenv').config();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Remove or comment out the previous route as it's not needed for this setup
// app.get('/some-route', (req, res) => {
//   if (process.env.DEBUG) {
//     console.log('Debug mode is on');
//   }
//   res.json({ apiKey: process.env.API_KEY });
// });

app.post('/ai-response', async (req, res) => {
  if (process.env.DEBUG) {
    console.log('Debug mode is on');
  }

  const { message } = req.body; // Extract the message from the request body

  // Here you would handle the interaction with your AI service
  // This is a placeholder for where you would integrate with an AI API or local AI model
  try {
    // Example: Using an external AI API (replace with your actual AI service integration)
    const response = await fetch('EXTERNAL_AI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Assuming the AI response structure has a 'choices' array with at least one object containing a 'message' with 'content'.
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      res.json({ answer: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Unexpected response format from AI service' });
    }
  } catch (error) {
    console.error('Error fetching AI response:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));