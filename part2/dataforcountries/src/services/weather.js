const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const getWeatherByCoordinates = (lat, lon, apiKey) => {
  return fetch(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then((response) => {
      return response.json();
    });
};

export default { getWeatherByCoordinates };
