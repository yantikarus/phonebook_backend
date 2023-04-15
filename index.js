const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.set('json spaces', 5);
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


morgan.token('info', function getInfo(req) {
    const info = {
        name: req.body.name,
        number:req.body.number
    }
    return JSON.stringify(info)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

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

const generateId = maxNum =>{
    return Math.floor(Math.random()* maxNum)
}

app.post('/api/persons', (req, res)=>{
    const body = req.body
    const nameDuplicate = data.find(x=> x.name=== req.body.name)
    if(!body.name || !body.number){
        return res.status(400).json({
            error: "missing name or number"
        })
    }else if(nameDuplicate){
        return res.status(400).json({
            error: "name must be unique"
        })

    }
    const person = {
        name: body.name,
        number:body.number,
        id: generateId(1000)
    }
    data = data.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
