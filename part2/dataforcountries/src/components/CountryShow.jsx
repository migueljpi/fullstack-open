const CountryShow = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>{country.name.common}</li>
        ))}
      </ul>
    );
  }

  if (countries.length === 1) {
    const country = countries[0];
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
      </div>
    );
  }

  return null; // If no countries match, render nothing
};

export default CountryShow;
