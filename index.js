const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-data', function(req){ return req.method=== 'POST' ? JSON.stringify(req.body): ''})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const Contact = require('./models/contact')

//helper functions for exercises
const getID =() =>{
  return Math.floor(Math.random()*100000)
}

function getCurrentDateTime() {
  const now = new Date();

  // Get parts of the date
  const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = now.toLocaleDateString('en-US', { month: 'short' });
  const day = now.getDate().toString().padStart(2, '0');
  const year = now.getFullYear();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const timeZone = now.toString().match(/\(([^)]+)\)$/)[1];
  const offset = now.toString().match(/GMT([+-]\d{4})/)[1];

  return `${dayName} ${monthName} ${day} ${year} ${time} GMT${offset} (${timeZone})`;
}

const infoData = `<p>Phonebook has info for ${contacts.length} people</p>
<p>${getCurrentDateTime()}<p>`


//Route handlers:

app.get('/api/persons',(req,res,next) => {
  Contact.find({}).then(contact => {
    res.json(contact)
  })
  .catch(error => next(error))
})

app.get('/info',(req,res,next)=> {
  Contact.countDocuments({})
  .then(count => {
      const infoData = `<p>Phonebook has info for ${count} people</p>
      <p>${getCurrentDateTime()}</p>`;
      res.send(infoData);
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req,res,next)=> {
    // const id = Number(req.params.id)
    // const contact = contacts.find(con => con.id === id)
    // if(contact){
    //     res.json(contact)
    // }else{
    //     res.status(400).send("Contact does not exist")
    // } 
    Contact.findById(req.params.id)
      .then(contact => {
        if(contact){
          res.json(contact)
        } else {
          res.status(404).end()
        }
      })
      .catch(error => next(error))
})


app.delete('/api/persons/:id',(req,res,next)=>{
    // const id = Number(req.params.id)
    // contacts = contacts.filter(con => con.id !== id)
    // res.status(204).end()
    Contact.findByIdAndDelete(req.params.id)
      .then(contact => {
        if(contact){
          res.status(200).send({ message: 'Deleted contact successfully', contact: contact });
        } else {
          res.status(404).send('contact not found')
        }
      })
      .catch(error => next(error))
})

app.post('/api/persons',(req,res,next) => {
 const id = getID()
 const contactBody = req.body

//  if (!contactBody.number) {
//     return response.status(400).json({ 
//       error: 'number missing' 
//     })
//   }
//  if (!contactBody.name) {
//   return response.status(400).json({ 
//     error: 'name missing' 
//   })
//  } else {
//   const exists = contacts.find(contact => contact.name === contactBody.name)
//   if (exists)
//     return response.status(400).json({ 
//       error: 'name must be unique' 
//     })
//  }

 const contact = new Contact({
  name: contactBody.name,
  number: contactBody.number
 })
 
 contact.save().then(savedContact=> {
  res.json(savedContact)
 })
 .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const contactBody = req.body

  const contact = {
    name: contactBody.name,
    number: contactBody.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true,runValidators: true })
    .then(updatedContact => {
      res.json(updatedContact)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: 'Validation error-(name shorter than 3 characters or invalid number format)' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})