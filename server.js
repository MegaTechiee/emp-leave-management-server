const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // For parsing JSON body
console.log('process.env.MONGO_URI', process.env.MONGO_URI)
console.log('process.env.PORT', process.env.PORT)

//  Async function to connect MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(' MongoDB Connected');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${process.env.PORT}`)
        );
    } catch (err) {
        console.error(' MongoDB connection error:', err);
        process.exit(1); // Exit the process if DB connection fails
    }
};

// Simple route
app.get('/', (req, res) => {
    res.send('Hello MongoDB!');
});

// Start the app
startServer();
