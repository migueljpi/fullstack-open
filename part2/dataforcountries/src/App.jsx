import { useState, useEffect } from 'react'
// import './App.css'
import countryService from './services/countries';
import CountryShow from './components/CountryShow';
import CountrySearch from './components/CountrySearch';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);


  useEffect(() => {
    console.log('effect is called')

    if (query === '') {
      setCountries([]);
      return;
    }

    countryService
      .getCountriesByName(query)
      .then(response => {
        console.log('promise fulfilled');
        console.log(response);
        setCountries(response);
      })
      .catch(error => {
        console.log('error fetching countries:', error);
      })
  }, [query])


  return (
  <div>
    {/* <h1>Country Search</h1>
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search for a country"
    /> */}
  <CountrySearch query={query} setQuery={setQuery} />
  <CountryShow countries={countries} />
  </div>
);
}

export default App
