const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Getting User Model from Users.js
const User = require('../../models/Users');

//Test route Will Remove
router.get('/test', (req, res) => {
  res.json({
    msg: "users works"
  });
});

// Creating user
router.post('/register', (req, res) => {

  // Checks to see if user already existis
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'email is already in use'
        });
      } else {

        // Creating the avatar image from gravatar api
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })

        // Creating user from form data
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        });

        //encrypts the password and then saves user to database

        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;

            newUser.save()
              .then(user => {
                user.speak();
                console.log('user created ============================');
                res.json(user);
              })
              .catch(err => console.log(err));
          });
        });

      }
    })

})

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //Find user with mongoose email
  User.findOne({email})
    .then(user => {
      if(!user) {
        res.status(404).json({email: 'user not founnd'})
      }
      // Check password of user
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            //  Will add login to return a jwt token for authentication
            res.json({msg: 'Success'})
          } else {
            res.status(400).json({password: 'Password incorrect'})
          }
        })
    })
});

module.exports = router;
