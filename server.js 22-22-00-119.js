const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve your HTML/CSS files

// Store subscriptions
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('New subscription:', email);
        
        if (!email || !validateEmail(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        
        // Save to file
        await saveSubscriber(email);
        
        console.log('Successfully subscribed:', email);
        res.json({ success: true, message: 'Subscrição realizada com sucesso' });
        
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Erro na subscrição. Tenta novamente.' });
    }
});

// Helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function saveSubscriber(email) {
    const filePath = path.join(__dirname, 'emails.txt');
    const timestamp = new Date().toLocaleString('pt-PT');
    const entry = `${email} | Subscribed: ${timestamp}\n`;
    
    await fs.appendFile(filePath, entry);
    console.log('Email saved to file:', email);
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Emails will be saved to emails.txt');
});