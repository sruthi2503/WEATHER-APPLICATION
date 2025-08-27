// API Configuration
const API_KEY = '3a3f5b7cbb1dddb7ba88cc55eb5032c8'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-showers-heavy',
    '09n': 'fas fa-cloud-showers-heavy',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Get weather data
async function getWeather() {
    const location = document.getElementById('locationInput').value.trim();
    
    if (!location) {
        showError('Please enter a location');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        // Get current weather
        const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=metric`);
        
        if (!currentWeatherResponse.ok) {
            throw new Error('Location not found. Please try again.');
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Get 5-day forecast
        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();
        
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const weatherIcon = document.getElementById('weatherIcon');
    const location = document.getElementById('location');
    const temperature = document.getElementById('temperature');
    const windSpeed = document.getElementById('windSpeed');
    const humidity = document.getElementById('humidity');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('visibility');
    const currentWeather = document.getElementById('currentWeather');
    
    // Set weather icon
    const iconClass = weatherIcons[data.weather[0].icon] || 'fas fa-cloud';
    weatherIcon.className = `weather-icon ${iconClass}`;
    
    // Set other data
    location.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    currentWeather.style.display = 'block';
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastList = document.getElementById('forecastList');
    const forecastContainer = document.getElementById('forecast');
    
    forecastList.innerHTML = '';
    
    // Group forecast by day
    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });
    
    // Display next 5 days
    Object.values(dailyForecasts).slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const iconClass = weatherIcons[day.weather[0].icon] || 'fas fa-cloud';
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item text-center';
        forecastItem.innerHTML = `
            <div class="text-lg font-semibold mb-2">${dayName}</div>
            <i class="${iconClass} text-3xl mb-2"></i>
            <div class="text-2xl font-bold mb-1">${Math.round(day.main.temp)}°C</div>
            <div class="text-sm opacity-80">${day.weather[0].description}</div>
            <div class="text-sm mt-2">
                <i class="fas fa-wind mr-1"></i> ${day.wind.speed} m/s
            </div>
        `;
        
        forecastList.appendChild(forecastItem);
    });
    
    forecastContainer.style.display = 'block';
}

// Show/hide loading spinner
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorDiv.style.display = 'block';
}

// Hide error message
function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Enter key support for search
document.getElementById('locationInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Initialize with a default location
window.addEventListener('load', function() {
    document.getElementById('locationInput').value = 'London';
    getWeather();
});
