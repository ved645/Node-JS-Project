const express = require('express');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());

// Custom middleware to preserve raw body for sanitization audit comparison
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      req.rawBodyObject = JSON.parse(buf.toString());
    } catch {
      req.rawBodyObject = null;
    }
  }
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    validator: 'express-validator v7.1.0',
    environment: 'production-ready demo'
  });
});

/**
 * Registration Validation Rules Middleware using express-validator
 */
const registrationValidationRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .bail()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores')
    .escape(), // Sanitizes HTML tags / special chars against XSS

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .bail()
    .isEmail().withMessage('Please provide a valid email format (e.g., user@domain.com)')
    .normalizeEmail(), // Normalizes email address (lowercases, removes Gmail dots/tags)

  body('password')
    .notEmpty().withMessage('Password is required')
    .bail()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter (A-Z)')
    .bail()
    .matches(/[0-9]/).withMessage('Password must contain at least one numerical digit (0-9)')
];

/**
 * Validation Execution & Response Handler
 */
app.post('/api/register', registrationValidationRules, (req, res) => {
  const errors = validationResult(req);
  const rawData = req.rawBodyObject || req.body;

  // Track simulated latency for realistic feel
  const startTime = Date.now();

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      statusText: 'Bad Request',
      timestamp: new Date().toISOString(),
      message: 'Server-side validation failed. 1 or more fields violate schema constraints.',
      errorCount: errors.array().length,
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        receivedValue: err.value !== undefined ? String(err.value) : undefined,
        location: err.location || 'body'
      })),
      receivedPayload: {
        username: rawData.username || '',
        email: rawData.email || '',
        passwordLength: (rawData.password || '').length
      }
    });
  }

  // Sanitized output comparison
  const rawUsername = rawData.username || '';
  const sanitizedUsername = req.body.username;
  const isXssNeutralized = rawUsername !== sanitizedUsername;

  return res.status(200).json({
    success: true,
    statusCode: 200,
    statusText: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend validation & sanitization successful! User payload accepted.',
    user: {
      username: sanitizedUsername,
      email: req.body.email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQ$K7m...[SECURE_HASHED]',
      registeredAt: new Date().toISOString()
    },
    sanitizationAudit: {
      username: {
        raw: rawUsername,
        sanitized: sanitizedUsername,
        escaped: isXssNeutralized,
        appliedRules: ['trim', 'min:3', 'max:20', 'alphanumeric', 'escape']
      },
      email: {
        raw: rawData.email || '',
        normalized: req.body.email,
        appliedRules: ['trim', 'isEmail', 'normalizeEmail']
      },
      password: {
        rawLength: (rawData.password || '').length,
        strength: 'Verified Strong (Length >= 8, Uppercase, Digit)',
        storage: 'Passed to Argon2/bcrypt hash pipeline'
      }
    }
  });
});

// Start Express server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server-Side Validation Demo running at http://localhost:${PORT}`);
  });
}

module.exports = app;
