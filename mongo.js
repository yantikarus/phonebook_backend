const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url = `mongodb+srv://wsutr:${password}@cluster0.vu3tk4f.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name:String,
  number:Number,
})

const Person = mongoose.model('Person', phoneSchema)

const person = new Person({
  name:contactName,
  number:contactNumber,
})
if (process.argv.length === 3){
  console.log('only 3 argument')
  Person.find({}).then(result => {
    result.forEach (person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
else{
// eslint-disable-next-line no-unused-vars
  person.save().then(x => {
    console.log('person saved!')
    mongoose.connection.close()
  })}



