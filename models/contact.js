const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGODB_URL;
mongoose.set('strictQuery',false)
mongoose.connect(url)
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    rewuired: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        const digitCount = v.replace(/[^0-9]/g, '').length; //to count digits by removing hyphen
        const pattern = /^\d{2,3}-\d{5,}$/;
        return digitCount >= 8 && pattern.test(v);
      },
    }, 
    required: true
  },
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Contact',contactSchema)  