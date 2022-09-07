const cloudinary = require('cloudinary')
require("dotenv").config();
cloudinary.config({
    cloud_name : 'bencod',
    api_key : process.env.api_key,
    api_secret: process.env.api_secret
})

exports.uploads = (file) =>{
    return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) =>{
    resolve({url: result.url, id: result.public_id})
    }, {resource_type: "auto"})
    })
}