const personsRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')

personsRouter.get('/', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
  // mongoose.connection.close()
})

// personsRouter.get('/api/persons', (req, res) => {
//   Person.find({}).then(people => {
//     res.json(people)
//   })
//   // mongoose.connection.close()
// })

personsRouter.get('/info', (req, res) => {
  Person.count({}).then(info => {
    const todayDate = new Date()
    res.send(`<pre><p>Phonebook has info for ${info} people</p><p>\n${todayDate}</p><pre>`)
  })

})

personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id).then(singlePerson => {
    if (singlePerson) {
      res.json(singlePerson)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))

})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      logger.info('the deleted result')
      res.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (req, res, next) => {
  const { name, number }= req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new:true, runValidators:true, context: 'query' })
    .then(updatedContact => {
      res.json(updatedContact)
    })
    .catch(error => next(error))
})


personsRouter.post('/', (req, res, next) => {
  const body = req.body
  logger.info('the body request is', body)
  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(1000)
  })
  person.save().then(savedPerson => {
    logger.info('person save')
    res.json(savedPerson)
  })
    .catch(error => {
      logger.error(error.message)
      next(error)
    })
})

module.exports = personsRouter