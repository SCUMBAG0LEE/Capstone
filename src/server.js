// Simple Hapi.js backend for authentication with PostgreSQL

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
  user:     process.env.PGUSER,         
  password: process.env.PGPASSWORD,    
  database: process.env.PGDATABASE,       
  host:     process.env.PGHOST,           
  port:     process.env.PGPORT,     
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
      cors: true,
    },
  });

  /*
  server.ext('onRequest', (request, h) => {
  if (request.connection.info.protocol === 'http') {
    return h.redirect(`https://${request.info.hostname}${request.url.path}`).permanent();
  }
  return h.continue;
  });
  */
  
  await server.register(Jwt);

  // JWT strategy
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || 'supersecretkey',
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 60 * 60 * 24, // 24 hours
      nbf: true,
      exp: true,
      timeSkewSec: 15
    },
    validate: async (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
          email: artifacts.decoded.payload.email,
          username: artifacts.decoded.payload.username
        }
      };
    }
  });

  // Register user route
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
        return h.response({ error: 'Email or username may already exist' }).code(400);
      }
    },
  });

  // Login route (with JWT token generation inside)
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
      const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [auth]);

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
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
