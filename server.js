const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employee');
const adminRoutes    = require('./routes/admin');
const frontendHost = process.env.FRONTEND_HOST;

const app = express();
app.use(cors({
  origin: 
    [ 
      'http://localhost:3001', 
      'http://localhost:3000',
      'http://localhost:8080',
      frontendHost
    ], // frontend origin
  credentials: true,  // if you send cookies
}));

app.use(express.json()); // For parsing JSON body
app.use(cookieParser()); // enables reading cookies later
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
    res.send('Welcome buddy!');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminRoutes);

// Example protected routes
// app.get('/api/employee/dashboard', authMiddleware('employee'), (req, res) => {
//     // console.log('req', req);
//     res.json({ message: `Welcome Employee ${req.user.name}` });
// });

// app.get('/api/admin/dashboard', authMiddleware('admin'), (req, res) => {
//     // console.log('req', req);
//     res.json({ message: `Welcome Admin ${req.user.name}` });
// });

// Start the app
startServer();
