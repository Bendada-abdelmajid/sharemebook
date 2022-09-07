const mongoose = require('mongoose')
const Book = require('./book')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true, 
    loadClass:true,
    unique:true,
  },
  password: {
    type: String,
    required: true, 
    minlength:8,
  },
  userImage: {
    type: String,
  },
  cloud_id: {
    type: String,
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],

  saved: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Book'
}]
 
})
userSchema.methods.countBooks = function() {
  
  return this.books.length
}

module.exports = mongoose.model('User', userSchema)