import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addEntry = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }
    else if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }
    const newObject = { name: newName, number: newNumber }
    setPersons(persons.concat(newObject))
    setNewName('')
    setNewNumber('')
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h3>add a new</h3>
      <NewEntry newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} addEntry={addEntry} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

const Persons = ({ persons, filter }) => {
  return (
    <div>
      {persons
        .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map(person =>
        <Person key={person.name} person={person} />
      )}
    </div>
  )
}

const Person = ({ person }) => {
  return (
    <p key={person.name}>
      {person.name} - {person.number}
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
