let timeInterval;

function updateWeatherInfo(data) {
  const temperatureElement = document.querySelector("#temperature");
  const cityElement = document.querySelector("#city");
  const descriptionElement = document.querySelector("#description");
  const humidityElement = document.querySelector("#humidity");
  const windSpeedElement = document.querySelector("#wind-speed");
  const iconElement = document.querySelector("#icon");

  const temperature = data.temperature.current;
  const date = new Date(data.time * 1000);

  cityElement.textContent = data.city;
  descriptionElement.textContent = data.condition.description;
  humidityElement.textContent = `${data.temperature.humidity}%`;
  windSpeedElement.textContent = `${data.wind.speed} km/h`;
  temperatureElement.textContent = Math.round(temperature);
  iconElement.innerHTML = `<img src="${data.condition.icon_url}" class="weather-app-icon" />`;

  
  clearInterval(timeInterval);

 
  updateTime(date);

  timeInterval = setInterval(() => {
    date.setSeconds(date.getSeconds() + 1);
    updateTime(date);
  }, 1000);

  fetchForecast(data.city);
}

function updateTime(date) {
  const timeElement = document.querySelector("#time");
  const formattedTime = formatDate(date);
  timeElement.textContent = formattedTime;
}

function formatDate(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  const apiKey = "5c5bc441t00fef7ob43bb1b47ef1faa0";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(response => updateWeatherInfo(response.data));
}

function handleFormSubmit(event) {
  event.preventDefault();
  const city = document.querySelector("#search-form-input").value;
  searchCity(city);
}

function fetchForecast(city) {
  const apiKey = "5c5bc441t00fef7ob43bb1b47ef1faa0";
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(response => displayForecast(response.data.daily));
}

function displayForecast(forecast) {
  const forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecast.slice(0, 5).map(day => {
    const date = new Date(day.time * 1000);
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];

    return `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature"><strong>${Math.round(day.temperature.maximum)}º</strong></div>
          <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}º</div>
        </div>
      </div>
    `;
  }).join("");
}

document.querySelector("#search-form").addEventListener("submit", handleFormSubmit);

searchCity("Paris");

