import axios from 'axios';

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/"

const getAllCountries = () => {
  const request = axios.get(baseUrl + "all")
  return request.then(response => response.data)
}

const getCountriesByName = (name) => {
  return getAllCountries().then(allCountries =>
    allCountries.filter(country =>
      country.name.common.toLowerCase().includes(name.toLowerCase())
    )
  );
};

export default {getAllCountries, getCountriesByName}
