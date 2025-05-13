const CountrySearch = ({ query, setQuery }) => {
  return(
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for a country"
      />
    </>)
}

export default CountrySearch;
