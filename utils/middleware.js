const logger = require('./logger')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if(error.name ==='CastError'){
    return res.status(400).send({ error : 'malformatted id' })
  }else if(error.name ==='ValidationError'){
    logger.error('validation error', error.message)
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}