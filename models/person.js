const mongoose = require('mongoose')

const phoneSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    validate: {
      validator: function(v){
        return /^[a-zA-Z ]*$/.test(v)
      }
    },
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