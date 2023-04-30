const config = require('./utils/config')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message)
  })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.set('json spaces', 5)

morgan.token('info', function getInfo(req) {
  const info = {
    name: req.body.name,
    number: req.body.number
  }
  return JSON.stringify(info)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
