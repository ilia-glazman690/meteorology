// Global variables
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistorySection = document.getElementById('search-history');
let searchHistory = [];

// Function to fetch weather data for a city
async function fetchWeatherData(cityName) {
  try {
    const response = await fetch(`${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error('City not found or API request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to display current weather details
function displayCurrentWeather(data) {
  const { name, main, wind, weather } = data;
  const weatherIconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;

  const currentWeatherHTML = `
    <h2>${name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Weather: <img src="${weatherIconUrl}" alt="${weather[0].description}"> ${weather[0].description}</p>
    <p>Temperature: ${main.temp} °C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;

  currentWeatherSection.innerHTML = currentWeatherHTML;
}

// Function to display 5-day forecast details
function displayForecast(data) {
  // Extract the 5-day forecast data from the API response and format it
  // Display the forecast data in the forecastSection
}

// Function to update the search history display
function updateSearchHistory() {
  const historyItems = searchHistory.map(city => `<li>${city}</li>`).join('');
  searchHistorySection.innerHTML = `<ul>${historyItems}</ul>`;
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city === '') return;

  const weatherData = await fetchWeatherData(city);
  if (weatherData) {
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
    searchHistory.push(city);
    updateSearchHistory();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}

// Function to handle clicks on search history items
async function handleSearchHistoryClick(event) {
  const city = event.target.textContent;
  const weatherData = await fetchWeatherData(city);
  if (weatherData) {
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
  }
}

// Add event listeners
searchForm.addEventListener('submit', handleFormSubmit);
searchHistorySection.addEventListener('click', handleSearchHistoryClick);

// Load search history from localStorage, if available
const storedSearchHistory = localStorage.getItem('searchHistory');
if (storedSearchHistory) {
  searchHistory = JSON.parse(storedSearchHistory);
  updateSearchHistory();
}
