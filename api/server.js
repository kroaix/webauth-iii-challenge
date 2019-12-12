const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const jwt = require('jsonwebtoken');

//routers info here

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

//routers info here

server.get('/', (req, res) => {
  res.send('Server is running.');
})

server.get('/token', (req, res) => {
  const payload = {
    subject: 'user',
    userid: 'kroaix'
  };
  const secret = 'supersecretstring';
  const options = {
    expiresIn: '1h'
  };
  const token = jwt.sign(payload, secret, options);
  res.json(token);
})

module.exports = server;