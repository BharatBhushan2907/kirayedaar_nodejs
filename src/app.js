const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');

// Connect to MongoDB
connectDB();

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// Serve uploaded files statically (swap with S3 signed URLs in production)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/property', require('./routes/propertyRoutes'));
app.use('/api/landlord', require('./routes/landlordRoutes'));
app.use('/api/tenancy',  require('./routes/tenancyRoutes'));
app.use('/api/rent',     require('./routes/rentRoutes'));
app.use('/api/evidence', require('./routes/evidenceRoutes'));
app.use('/api/review',   require('./routes/reviewRoutes'));
app.use('/api/receipt',  require('./routes/receiptRoutes'));
app.use('/api/contact',  require('./routes/contactRoutes'));
app.use('/api/waitlist', require('./routes/waitlistRoutes'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Kirayedar API is running' }));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res, next) => next(new AppError(`Route ${req.originalUrl} not found`, 404)));

// ── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
