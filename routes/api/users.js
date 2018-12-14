const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');


const User = require('../../models/Users');

//load model
//api/users/register

router.get('/test', (req, res) => {
  res.json({
    msg: "users works"
  });
});

router.post('/register', (req, res) => {

  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'email is already in use'
        });
      } else {

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

module.exports = router;
