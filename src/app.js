function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let feelsLikeElement = document.querySelector("#feels-like");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
function search(city) {
  let apiKey = "24be2a5d0560b29769b34e4136c9cb1f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function currentWeather(response) {
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `${Math.round(response.data.main.feels_like)}`;
  let humidity = document.querySelector(`#humidity`);
  humidity.innerHTML = `${response.data.main.humidity}`;
  let windSpeed = document.querySelector(`#wind`);
  windSpeed.innerHTML = Math.round(`${response.data.wind.speed}`);
}

function updateCurrentTemp(response) {
  let currentLocation = response.data.name;
  let locationTemp = Math.round(response.data.main.temp);

  let enterLocation = document.querySelector("#city");
  enterLocation.innerHTML = `${currentLocation}`;
  let enterTemp = document.querySelector("#temperature");
  enterTemp.innerHTML = `${locationTemp}`;
  currentWeather(response);

  axios.get(apiUrl).then(updateCurrentTemp);
}

let currentLocationButton = document.querySelector("#location-button");

function locateLocationTemp(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "57b463acac326f9d3b29b49c1092e284";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(updateCurrentTemp);
}

function locateCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(locateLocationTemp);
}

currentLocationButton.addEventListener("click", locateCity);

search("London");
