const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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

const getID =() =>{
  return Math.floor(Math.random()*100000)
}

app.get('/api/persons',(req,res) => {
    return res.json(contacts)
})

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
<p>${getCurrentDateTime()}<p>
`

app.get('/info',(req,res)=> {
    return res.send(infoData)
})

app.get('/api/persons/:id', (req,res)=> {
    const id = Number(req.params.id)
    const contact = contacts.find(con => con.id === id)
    if(contact){
        res.json(contact)
    }else{
        res.status(400).send("Contact does not exist")
    }    
})


app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    contacts = contacts.filter(con => con.id !== id)
    res.status(204).end()
})

app.post('/api/persons',(req,res) => {
 const id = getID()
 const contactBody = req.body
 if (!contactBody.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
 if (!contactBody.name) {
  return response.status(400).json({ 
    error: 'name missing' 
  })
 } else {
  const exists = contacts.find(contact => contact.name === contactBody.name)
  if (exists)
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
 }
 contactBody.id = id
 contacts = contacts.concat(contactBody)
 res.json(contactBody).status(200)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})