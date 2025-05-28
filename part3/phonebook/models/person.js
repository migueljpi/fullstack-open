const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// const url = `mongodb+srv://migueljpi:${password}@cluster0.7cysi8j.mongodb.net/phonebookApp?retryWrites=true&w=majority`;


const url = process.env.MONGODB_URI
mongoose.connect(url)
    .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function(v) {
        // Matches 2 or 3 digits, hyphen, then at least 5 digits (total min 8 chars)
        return /^\d{2,3}-\d+$/.test(v);
      },
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
