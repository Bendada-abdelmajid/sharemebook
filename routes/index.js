const express = require('express')
const router = express.Router()
router.get('/', async (req, res) => {
   res.render('index.ejs', {name:'hanae'})
  })

module.exports = router