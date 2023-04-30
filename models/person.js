const mongoose = require('mongoose')

// mongoose.set('strictQuery', false)

// const url = process.env.MONGODB_URI
// console.log('connecting to ', url)

// mongoose.connect(url)
//   .then(console.log('connected to phonebook database'))
//   .catch((error) => {
//     console.log('error connecting to MongoDB', error.message)
//   })

const phoneSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    required:true
  },
  number:{
    type:String,
    minLength:8,
    validate: {
      validator: function(v){
        return /^[0-9]{2,3}-[0-9]*$/.test(v)
      }
    },
    required:true
  }
})
phoneSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Person', phoneSchema)