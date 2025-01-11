require('dotenv').config();
console.log(process.env.API_KEY);
// Importer les modules nécessaires
const express = require('express');
const app = express();
const fetch = require('node-fetch'); // Pour les versions de Node.js avant 18, sinon, vous pouvez utiliser le fetch natif
require('dotenv').config(); // Charger les variables d'environnement
console.log(process.env);
const myURL = new URL('https://example.org');

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Servir les fichiers statiques du dossier 'public'
app.use(express.static('public'));

// Endpoint pour les requêtes à l'IA
app.post('/ai-response', async (req, res) => {
  const { message } = req.body; // Extraire le message de la requête

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  try {
    // Appel à une API externe d'IA
    const response = await fetch('API_KEY', { // Remplacez ceci par l'URL réelle de l'API IA
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }

    const data = await response.json();
    // Assumer une structure de réponse particulière de l'API. Adaptez cela selon votre API
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      res.json({ answer: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Format de réponse inattendu de l\'API IA' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la réponse de l\'IA:', error);
    res.status(500).json({ error: 'Échec de la récupération de la réponse de l\'IA' });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en marche sur le port ${PORT}`);
});