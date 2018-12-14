const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now()
  }

});

// Adding methods the instance of user object 
UserSchema.methods.speak = function () {
  var greeting = `Hello My name is ${this.name}`;
  console.log(greeting);
}

module.exports = User = mongoose.model('users', UserSchema);
