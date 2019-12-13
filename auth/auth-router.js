const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const Users = require('../users/users-model.js');

router.post('/register', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  try {
    const saved = await Users.add(user);
    const token = genToken(saved);
    res.status(201).json({ created_user: saved, token: token });
  } catch {
    res.status(500).json({ message: 'Something went wrong.'})
  }
})

router.post('/login', async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await Users.findBy({ username })
    .first()
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = genToken(user);
      res.status(200).json({ username: user.username, token: token });
    } else {
      res.status(401).json({ message: 'Invalid Credentials.' });
    }
  } catch {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

function genToken(user) {
  const payload = {
    userid: user.id,
    username: user.username
  };
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, secrets.jwtSecret, options);
  return token;
}

module.exports = router;