var cityForm = document.getElementById("cityForm");
var listOfCities= document.getElementById("listOfCities");

//Turns city name in lat and lon 
function geocodeCity (cityName) {
  fetch("http://api.openweathermap.org/geo/1.0/direct?q="+ cityName +"&limit=1&appid=d9777a4b12efda3924e55411783a1125")
  .then((response) => response.json())
  .then((data) => {

    var latitude = data[0].lat;
    var longitude = data[0].lon;

    getWeatherData(latitude, longitude, cityName);
  })
}

// Uses lat and lon and returns weather data
function getWeatherData(latitude, longitude, cityName) {
   fetch("https://api.openweathermap.org/data/3.0/onecall?lat="+ latitude +"&lon="+ longitude +"&exclude=minutely,hourly&appid=d9777a4b12efda3924e55411783a1125")
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    var listedName = document.createElement("input");
      listedName.type = "submit";
      listedName.value = cityName;
      listedName.className = "listedCities";
      listOfCities.appendChild(listedName);
      

  })
}

// submits city name into search
function formSubmit(event) {
  event.preventDefault();
  var cityName = document.getElementById("cityName").value;

  geocodeCity(cityName)
}

cityForm.addEventListener("submit", formSubmit);