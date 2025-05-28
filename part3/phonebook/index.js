require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json())
const morgan = require('morgan');
// const cors = require('cors')
// app.use(cors())
app.use(express.static('dist'))
const Person = require('./models/person')

const password = process.argv[2];

// const Entry = mongoose.model('Entry', entrySchema);


morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// let persons = [
//   { id: "1", name: "Arto Hellas", number: "040-123456" },
//   { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
//   { id: "3", name: "Dan Abramov", number: "12-43-234345" },
//   { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
// ];


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get ('/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `);
});


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: 'Name must be unique' });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then(savedPerson => {
      response.json(savedPerson);
    });
  }).catch(error => {
    response.status(500).json({ error: 'Database error' });
  });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
