// Simple Hapi.js backend for authentication with PostgreSQL
const axios = require('axios');
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Jwt = require('@hapi/jwt');
const fs = require('fs');
const { features } = require('process');
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
    validate: async (artifacts, request, h) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        email: artifacts.decoded.payload.email,
        username: artifacts.decoded.payload.username,
      }
    })
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
      }
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
        return h.response({ error: 'Email or username may already exist' }).code(400);
      }
    }
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
      }
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
    }
  });

//Predict route
  server.route({
    method: 'POST',
    path: '/predict',
    options: {
      auth: false, // Ubah jika perlu autentikasi
      validate: {
        payload: Joi.object({
          Close: Joi.number().required(),
          rsi: Joi.number().required(),
          macd: Joi.number().required(),
          macd_signal: Joi.number().required(),
          sma_20: Joi.number().required(),
          ema_20: Joi.number().required(),
          model: Joi.string().valid('rf', 'lr', 'knn', 'dt', 'nb').default('rf'),
        })
      }
    },
    handler: async (request, h) => {
      const { model, ...features } = request.payload;
      try {
        const response = await axios.post(`http://localhost:8000/predict?model=${model}`, features);
        return h.response(response.data);
      } catch (err) {
        console.error('Prediction error:', err.response?.data || err.message);
        return h.response({ error: 'Failed to get prediction from ML service' }).code(500);
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

init();