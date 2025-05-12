import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneService from './services/phones'
import Notification from './components/Notification'
import Error from './components/Error'
import './components/notification.css'

const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456', id: 1 },
    // { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    // { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    // { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('adding to the phonebook from db.json')
    phoneService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addEntry = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson && existingPerson.number !== newNumber) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };


        phoneService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {

            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            setMessage(
                `${existingPerson.name} number was updated to ${newNumber}`
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== existingPerson.id));
            setNewName('');
            setNewNumber('');
            setError(
                `Information of ${existingPerson.name} has already been removed from server`
              )
              setTimeout(() => {
                setError(null)
              }, 5000)
          })
      }
      return;
    }


    if (existingPerson && existingPerson.number === newNumber) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }

    const newObject = { name: newName, number: newNumber }
    phoneService
      .create(newObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    setMessage(
          `${newObject.name} was added to phonebook`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
  }

  const removeEntry = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      phoneService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
      setMessage(
          `Entry for ${persons.find(person => person.id === id).name} was deleted`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    } else {
      return
    }

  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Error message={error} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>add a new</h3>
      <NewEntry newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} addEntry={addEntry} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} removeEntry={removeEntry} />
    </div>
  )
}

const Persons = ({ persons, filter, removeEntry }) => {
  return (
    <div>
      {persons
        .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map(person =>
        <Person key={person.name} person={person} removeEntry={removeEntry} />
      )}
    </div>
  )
}

const Person = ({ person, removeEntry }) => {
  return (
    <p key={person.name}>
      {person.name} - {person.number} - <button onClick={() => removeEntry(person.id)}>delete</button>
    </p>
  )
}

const NewEntry = ({ newName, setNewName, newNumber, setNewNumber, addEntry }) => {
  return (
    <form onSubmit={addEntry}>
      <div>
        name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
      </div>
      <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
const Filter = ({ filter, setFilter }) => {
  return (
    <form>
      <div>
        filter shown with: <input value={filter} onChange={(event) => setFilter(event.target.value)}/>
      </div>
    </form>
  )
}

export default App
