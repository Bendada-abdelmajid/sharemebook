const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  auther: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  genre: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'Genre'
},
cloud_id: {
  type: String,
},

  reviews: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Review'
}]


})



module.exports = mongoose.model('Book', bookSchema)


