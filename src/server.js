const axios = require('axios');
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Jwt = require('@hapi/jwt');
const fs = require('fs');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.PGDBURL || undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false },
});

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    /*
    tls: {
      key: fs.readFileSync('/etc/letsencrypt/live/nekocare.duckdns.org/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/nekocare.duckdns.org/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/nekocare.duckdns.org/chain.pem'),
    },
    */
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with'],
        exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        additionalExposedHeaders: ['Authorization'],
        maxAge: 86400,
        preflightStatusCode: 204
      }
    }
  });

  /*
  server.ext('onRequest', (request, h) => {
    if (request.info.protocol === 'http') {
      return h.redirect(`https://${request.info.hostname}${request.url.path}`).permanent();
    }
    return h.continue;
  });
  */

  await server.register(Jwt);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || 'supersecretkey',
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 60 * 60 * 24,
      nbf: true,
      exp: true,
      timeSkewSec: 15,
    },
    validate: async (artifacts, request, h) => {
      // This function runs on every authenticated request.
      // The token is already verified at this point.
      // We are just extracting the payload to be used in request.auth.credentials
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
          email: artifacts.decoded.payload.email,
          username: artifacts.decoded.payload.username,
        },
      };
    },
  });

  // Register route
  server.route({
    method: 'POST',
    path: '/register',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          username: Joi.string().alphanum().min(3).max(30).required(),
          password: Joi.string().min(6).required(),
          consent: Joi.boolean().valid(true).required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { email, username, password, consent } = request.payload;
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();
      try {
        await pool.query(
          'INSERT INTO users(id, email, username, password, consent) VALUES($1, $2, $3, $4, $5)',
          [id, email, username, hashedPassword, consent]
        );
        return h.response({ message: 'User registered successfully' }).code(201);
      } catch (err) {
        console.error(err);
        // This is a generic error; a user could try to register with an existing email OR username

        return h.response({ error: 'Email or username may already exist' }).code(409); // 409 Conflict is more appropriate
      }
    },
  });

  // Login route
  server.route({
    method: 'POST',
    path: '/login',
    options: {
      validate: {
        payload: Joi.object({
          auth: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { auth, password } = request.payload;
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR username = $1',
        [auth]
      );
      if (result.rows.length === 0) {
        return h.response({ error: 'Invalid user or pass' }).code(401);
      }
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return h.response({ error: 'Invalid user or pass' }).code(401);
      }
      const token = Jwt.token.generate(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        {
          key: process.env.JWT_SECRET || 'stuff',
          algorithm: 'HS256',
        }
      );
      return h.response({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, username: user.username },
      });
     },

  });
  // *** NEW: Authenticated Prediction Route ***
  server.route({
    method: 'POST',
    path: '/predict/{model_key}',
    options: {
      auth: 'jwt', // This makes the route protected. A valid JWT must be provided.
      validate: {
        params: Joi.object({
          // Validate the model key from the URL to match Python API
          model_key: Joi.string().valid('rf', 'lr', 'knn', 'dt', 'nb').required(),
        }),
        // Validate the incoming payload to match the Python API's `StockData` model
        payload: Joi.object({
          Close: Joi.number().required(),
          rsi: Joi.number().required(),
          macd: Joi.number().required(),
          macd_signal: Joi.number().required(),
          sma_20: Joi.number().required(),
          ema_20: Joi.number().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { model_key } = request.params;
      const stockData = request.payload;
      // The URL for your Python FastAPI service. Use an environment variable for this.
      // Defaults to http://localhost:8000 if not set.
      const pythonApiUrl = `${process.env.PYTHON_API_BASE_URL || 'http://localhost:8000'}/predict/${model_key}`;
      console.log(`Forwarding prediction request for user '${request.auth.credentials.username}' to Python service.`);
      try {
        // Use axios to make a POST request to the Python API with the stock data
        const predictionResponse = await axios.post(pythonApiUrl, stockData, {
            headers: { 'Content-Type': 'application/json' }
        });
        // Forward the prediction result from Python back to the original client
        return h.response(predictionResponse.data).code(200);
      } catch (error) {
        console.error('Error calling Python prediction API:', error.message);
        // Gracefully handle errors if the Python service is down or returns an error
        if (error.response) {
          // The Python API responded with an error (e.g., 404 Model Not Found, 500 Internal Error)
          return h.response({ 
            error: 'Prediction service failed.',
            details: error.response.data 
          }).code(error.response.status);
        }
        // The request was made but no response was received (e.g., service is down)
        return h.response({ error: 'Prediction service is currently unavailable.' }).code(503); // 503 Service Unavailable
      }
    },
  });

  await server.start();
  console.log('Node.js server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.error('An unhandled rejection occurred:', err);
  process.exit(1);
});

init();
