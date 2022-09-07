const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  book: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'Book'
}, createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

})



module.exports = mongoose.model('Review', reviewSchema)