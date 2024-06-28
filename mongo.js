/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://Phonebook:${password}@phonebookdb.9hj0p2f.mongodb.net/?retryWrites=true&w=majority&appName=PhonebookDB`
mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => {
    console.log('connection success')
  })
  .catch(error => console.log(error.message))

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact',contactSchema)

const contact = new Contact({
  name: name,
  number: number,
})

if(password && name && number){
  contact.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}else {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}