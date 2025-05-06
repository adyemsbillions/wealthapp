const API_KEY ='ba7aef14ba544c27932101023250605';
const weatherInfo = document.getElementById('weather-info');
const error =document.getElementById('error')
const loading =document.getElementById('loading')

async function getWeatherByCity(cityName) {
    showLoading();

    try{
        const weathearUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&alerts=no`;
    
        const response = await fetch(weathearUrl);
        const data = await response.json();

        if(response.status !== 200 || data.error){
            throw new Error(data.error?.message || "City Not Found")
        }
        displayWeather(data);
        changeBackgroundColor(data.current.condition.text);
    }
    catch(err){
        showError(err.message)
    }
}

function getWeather(){
    const cityInput = document.getElementById('city-input').value.trim();
    if(!cityInput) return;
    getWeatherByCity(cityInput);
}

function displayWeather(data){
    weatherInfo.style.display = 'block';
    error.style.display = 'none';
    loading.style.display = 'none';

    document.getElementById('city-name').textContent = data.location.name;
    document.getElementById('date').textContent = data.location.localtime;
    document.getElementById('temperature').textContent = `${data.current.temp_c}℃`;
    document.getElementById('weather-description').textContent = data.current.condition.text;
    document.getElementById('weather-icon').src = `https:${data.current.condition.icon}`;
    document.getElementById('feels-like').textContent = `${data.current.feelslike_c}℃`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph}Km/h`;
    document.getElementById('uv-index').textContent = data.current.uv;

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    data.forecast.forecastday.forEach(day =>{
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
        <h3>${new Date(day.date).toLocaleString('en-US',{weekday:'long'})}</h3>
        <img class="forecast-icon" src="https:${day.day.condition.icon}" alt="Weather Icon">
        <p>${Math.round(day.day.maxtemp_c)}℃/${Math.round(day.day.mintemp_c)}℃</p>
        <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(forecastDay);
    })
}

function showError(message){
    error.style.display = 'block';
    error.textContent = message;
    weatherInfo.style.display = 'none';
    loading.style.display = 'none'
}

function showLoading(){
    error.style.display = 'none';
    weatherInfo.style.display = 'none';
}
document.getElementById("city-input").addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        getWeather();
    }
});
window.addEventListener('load',()=>{
    document.getElementById('city-input').value = 'London';
    getWeatherByCity("London");
})

function changeBackgroundColor(conditionText) {
    const body = document.body;
    const condition = conditionText.toLowerCase();
  
    switch (condition) {
      case 'sunny':
      case 'clear':
        body.style.background = 'linear-gradient(to right,rgb(167, 152, 115),rgba(235, 180, 28, 0.71))';
        break;
      case 'partly cloudy':
      case 'cloudy':
      case 'overcast':
        body.style.background = 'linear-gradient(to right,rgb(160, 192, 211), #2c3e50)';
        break;
      case 'rain':
      case 'patchy rain possible':
      case 'moderate rain':
      case 'heavy rain':
        body.style.background = 'linear-gradient(to right,rgb(58, 87, 117),rgb(48, 91, 135))';
        break;
      case 'snow':
      case 'patchy snow possible':
      case 'moderate snow':
      case 'heavy snow':
        body.style.background = 'linear-gradient(to right, #00c6ff, #0072ff)';
        break;
      case 'thunder':
      case 'thunderstorm':
      case 'patchy light rain with thunder':
        body.style.background = 'linear-gradient(to right,rgb(240, 107, 118), #ffc371)';
        break;
      default:
        body.style.background = 'linear-gradient(to right, #0f2027, #203a43)';
        break;
    }
  }
  