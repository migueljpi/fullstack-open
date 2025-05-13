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
        width="150"
      />
    </div>
  );
};

export default CountryShow;
