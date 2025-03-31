/**
 * Weather App
 * 
 * A simple weather application that demonstrates how to use fetch API
 * to get weather data from a third-party API and display it to the user.
 */

// Constants
const API_KEY = ''; // Get your API key from OpenWeatherMap: https://openweathermap.org/api
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const weatherIcon = document.getElementById('weather-icon');
const searchHistoryList = document.getElementById('search-history');
const clearHistoryBtn = document.getElementById('clear-history');
const unitToggle = document.getElementById('unit-toggle');
const pressureElement = document.getElementById('pressure');
const visibilityElement = document.getElementById('visibility');

// State
let units = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Functions
function showLoader() {
    loader.classList.remove('d-none');
    weatherCard.classList.add('d-none');
    errorMessage.classList.add('d-none');
}

function hideLoader() {
    loader.classList.add('d-none');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
    weatherCard.classList.add('d-none');
}

function showWeatherData(data) {
    // Update weather card with data
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    
    const temp = Math.round(data.main.temp);
    const unitSymbol = units === 'metric' ? '°C' : '°F';
    temperatureElement.textContent = `${temp}${unitSymbol}`;
    
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    
    const windSpeed = data.wind.speed;
    const windUnit = units === 'metric' ? 'm/s' : 'mph';
    windElement.textContent = `${windSpeed} ${windUnit}`;
    
    pressureElement.textContent = `${data.main.pressure} hPa`;
    
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    visibilityElement.textContent = `${visibilityKm} km`;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Show the weather card
    weatherCard.classList.remove('d-none');
}

async function getWeatherData(city) {
    showLoader();
    
    try {
        // Check if API_KEY is set
        if (!API_KEY) {
            throw new Error('API key is not set. Please get an API key from OpenWeatherMap and set it in the app.js file.');
        }
        
        // Make API request
        const url = `${API_URL}?q=${city}&units=${units}&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            }
            throw new Error(`Weather data not available (${response.status})`);
        }
        
        const data = await response.json();
        
        // Add to search history
        addToSearchHistory(city);
        
        hideLoader();
        showWeatherData(data);
        return data;
    } catch (error) {
        hideLoader();
        showError(error.message);
        console.error('Error fetching weather data:', error);
    }
}

function addToSearchHistory(city) {
    // Capitalize first letter of each word
    const formattedCity = city
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    // Remove if already exists (to move it to the top)
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning of array
    searchHistory.unshift(formattedCity);
    
    // Limit to 10 items
    searchHistory = searchHistory.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    
    // Update UI
    updateSearchHistoryUI();
}

function updateSearchHistoryUI() {
    searchHistoryList.innerHTML = '';
    
    if (searchHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'list-group-item text-center text-muted';
        emptyItem.textContent = 'No search history yet';
        searchHistoryList.appendChild(emptyItem);
        return;
    }
    
    searchHistory.forEach(city => {
        const item = document.createElement('li');
        item.className = 'list-group-item search-history-item d-flex justify-content-between align-items-center';
        
        const cityText = document.createElement('span');
        cityText.textContent = city;
        
        const refreshIcon = document.createElement('i');
        refreshIcon.className = 'fas fa-sync-alt text-primary';
        refreshIcon.style.cursor = 'pointer';
        
        item.appendChild(cityText);
        item.appendChild(refreshIcon);
        
        item.addEventListener('click', () => {
            cityInput.value = city;
            getWeatherData(city);
        });
        
        searchHistoryList.appendChild(item);
    });
}

// Event Listeners
cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    
    if (city) {
        getWeatherData(city);
    }
});

clearHistoryBtn.addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem('weatherSearchHistory');
    updateSearchHistoryUI();
});

unitToggle.addEventListener('change', () => {
    units = unitToggle.checked ? 'imperial' : 'metric';
    
    // If there's a city in the input, refresh the weather
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    updateSearchHistoryUI();
    
    // If there's a search history, load the most recent city
    if (searchHistory.length > 0) {
        cityInput.value = searchHistory[0];
        getWeatherData(searchHistory[0]);
    }
});