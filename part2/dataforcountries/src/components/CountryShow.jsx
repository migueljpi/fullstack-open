import weatherService from '../services/weather';
import { useState, useEffect } from 'react';

const CountryShow = ({ countries, selectedCountry, setSelectedCountry }) => {
  console.log('Rendering for debug. selectedCountry:', selectedCountry);

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />;
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => {
              console.log(`Selected country: ${country.name.common}`);
              setSelectedCountry(country);
            }}>
              Show
            </button>
          </li>
        ))}
      </ul>
    );
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  }

  return null;
};

const CountryDetails = ({ country }) => {
  return (
    <div>
      <h2><strong>{country.name.common}</strong></h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <p><strong>Languages:</strong></p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />
      <Weather capital={country.capital[0]} latlng={country.capitalInfo.latlng} />
    </div>
  );
};

const Weather = ({ capital, latlng }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      const [lat, lon] = latlng;
      const data = await weatherService.getWeatherByCoordinates(lat, lon, api_key);
      setWeather(data);
    };

    fetchWeather();
  }, [latlng, api_key]);

  if (!weather) {
    return <p>Loading weather data...</p>;
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp}°C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default CountryShow;
