const express = require('express')
const app = express()
app.set('json spaces', 5);

let data = [
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

app.get('/', (req, res)=> {
    res.send('<h1>Beautiful day</h1>')
})

app.get('/api/persons', (req, res)=> {
    res.json(data)
})

app.get('/info', (req, res)=> {
    const info = data.length;
    const todayDate = new Date();
    res.send(`<pre><p>Phonebook has info for ${info} people</p><p>\n${todayDate}</p><pre>`)
})

app.get('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id)
    const singlePerson = data.find(x =>x.id === id)
    if(singlePerson){
        res.json(singlePerson)
    }else{
        res.status(404).end()
    }
    
})
app.delete('/api/persons/:id', (req, res) =>{
    const id = Number(req.params.id)
    data = data.filter(x=>x.id !==id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
