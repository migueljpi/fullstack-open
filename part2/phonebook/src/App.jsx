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
      <form>
        <div>
          filter shown with: <input value={filter} onChange={(event) => setFilter(event.target.value)}/>
        </div>
      </form>
      <h2>add a new</h2>
      <form onSubmit={addEntry}>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
        </div>
        <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons
        .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map(person =>
        <p key={person.name}>
          {person.name} - {person.number}
        </p>
      )}
      {/* <div>debug name: {newName}</div>
      <div>debug number: {newNumber}</div>
      <div>debug filter: {filter}</div> */}
    </div>
  )
}

export default App
