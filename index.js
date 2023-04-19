require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const PORT = process.env.PORT
const mongoose = require('mongoose')


app.set('json spaces', 5);
app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('info', function getInfo(req) {
    const info = {
        name: req.body.name,
        number: req.body.number
    }
    return JSON.stringify(info)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))


app.get('/', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
    // mongoose.connection.close()
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
    // mongoose.connection.close()
})

app.get('/info', (req, res) => {
    Person.count({}).then(info => {
        const todayDate = new Date();
        res.send(`<pre><p>Phonebook has info for ${info} people</p><p>\n${todayDate}</p><pre>`)
    });

})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(singlePerson => {
        if (singlePerson) {
            res.json(singlePerson)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
      
})
app.delete('/api/persons/:id', (req, res, next) =>{
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        console.log("the deleted result", result)
        res.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = maxNum => {
    return Math.floor(Math.random() * maxNum)
}

app.put('/api/persons/:id', (req, res, next)=>{
    const body = req.body

    const person = {
        name:body.name,
        number:body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new:true})
    .then(updatedContact =>{
        res.json(updatedContact)
    })
    .catch(error =>next(error))
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log('the body request is', body)

    //Todo needs to update front end to show notification if no body.name/ number supplied
    if(!body.name || !body.number){
        return res.status(400).json({
            error: "missing name or number"
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateId(1000)
    })
    person.save().then(savedPerson => {
        console.log("person save")
        res.json(savedPerson)
    })
})
const unknownEndpoint = (req, res)=>{
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next)=>{
    console.log(error.message)
    if(error.name ==='CastError'){
        return res.status(400).send({error : 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
