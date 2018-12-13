const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// bodyParser.urlencoded({extended: false});
// app.use(bodyParser.json());

const User = require('../../models/Users');

//load model
//api/users/register

router.get('/test', (req, res) => {
  res.json({
    msg: "users works"
  });
});

router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if(user) {
      return res.status(400).json({email: 'email is already in use'});
    } else {

      const avatar = gravatar.url(req.body.email, {
        s: 200,
        r: 'pg',
        d: 'mm'
      })

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) {
            console.log(err)
          }
          newUser.password = hash;
          newUser.save()
            .then(user => {
              console.log('user created');
              res.json(user)
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    }
  })

})

module.exports = router;
