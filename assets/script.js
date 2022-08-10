var cityForm = document.getElementById("cityForm");
var listOfCities = document.getElementById("listOfCities");
var weatherBox = document.getElementById("weatherBox");
var forcastBox = document.getElementById("forcastBox");
var clearBtn = document.getElementById("clearBtn");
var storedData = JSON.parse(localStorage.getItem("pastCities")) || [];


//Turns city name into lat and lon 
function geocodeCity(cityName) {
  fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=d9777a4b12efda3924e55411783a1125")
    .then((response) => response.json())
    .then((data) => {

      var latitude = data[0].lat;
      var longitude = data[0].lon;
      var dataName = data[0].name;

      getWeatherData(latitude, longitude, dataName);
    })
}

// Uses lat and lon and returns weather data
function getWeatherData(latitude, longitude, dataName) {
  fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&units=imperial&appid=d9777a4b12efda3924e55411783a1125")
    .then((response) => response.json())
    .then((data) => {
      console.log(data)


      presentCurrentData(data, dataName);
    })
}

// Presents Current Weather Data on screen
function presentCurrentData(data, dataName) {
  weatherBox.innerHTML = "";

  var currentHeader = document.createElement("h1");
  currentHeader.style.color = "black";
  currentHeader.style.textDecoration = "underline"
  currentHeader.style.fontSize = "25px"
  currentHeader.innerHTML = dataName + ":  " + moment().format('LL');

  var iconId = data.current.weather[0].icon;
  var weatherIcon = ("https://openweathermap.org/img/wn/" + iconId + "@2x.png");
  var iconImg = document.createElement("img");
  iconImg.src = weatherIcon;
  iconImg.classList = "center";

  var iconDescription = data.current.weather[0].description;
  var iconDes = document.createElement("p");
  iconDes.style.textAlign = "center";
  iconDes.style.fontSize = "18px";
  iconDes.style.marginBottom = "2px"
  iconDes.innerHTML = iconDescription;

  var currentTemp = data.current.temp;
  var currWeather = document.createElement("p");
  currWeather.style.textAlign = "center"
  currWeather.style.marginBottom = "5px"
  currWeather.style.fontSize = "20px";
  currWeather.innerHTML = "Temperature:  " + currentTemp + "°F";

  var windSpeed = data.current.wind_speed;
  var windSp = document.createElement("p");
  windSp.style.textAlign = "center"
  windSp.style.marginBottom = "5px";
  windSp.style.fontSize = "20px";
  windSp.innerHTML = "Wind Speed:  " + windSpeed + " MPH";

  var humidity = data.current.humidity;
  var humidP = document.createElement("p");
  humidP.style.textAlign = "center"
  humidP.style.marginBottom = "5px";
  humidP.style.fontSize = "20px";
  humidP.innerHTML = "Humidity:  " + humidity + " %";

  var uvindex = data.current.uvi;
  var uviP = document.createElement("p");
  uviP.style.textAlign = "center"
  uviP.style.marginBottom = "5px";
  uviP.style.fontSize = "20px";
  uviP.style.marginLeft ="43%";
  uviP.style.marginRight ="43%";
  uviP.style.borderRadius = "5px";


  if (uvindex < 3) {
    uviP.style.backgroundColor = "green"
    uviP.style.color = "white";

  }
  if (uvindex >= 3) {
    uviP.style.backgroundColor = "yellow"
  }
  if (uvindex >= 6) {
    uviP.style.backgroundColor = "red"
  }
  uviP.innerHTML = "UV Index:  " + uvindex;

  weatherBox.appendChild(currentHeader);
  weatherBox.appendChild(iconImg);
  weatherBox.appendChild(iconDes);
  weatherBox.appendChild(currWeather);
  weatherBox.appendChild(windSp);
  weatherBox.appendChild(humidP);
  weatherBox.appendChild(uviP);

  var dailyArray = data.daily;
  for (let i = 1; i < dailyArray.length; i++) {
    const forcast = dailyArray[i];

    var date = new Date(forcast.dt * 1000).toDateString();
    var weatherId = data.daily[i].weather[0].icon;
    var descrip = data.daily[i].weather[0].description;
    var dailyTempMin = data.daily[i].temp.min;
    var dailyTempMax = data.daily[i].temp.max;
    var dailyWind = data.daily[i].wind_speed;
    var dailyHumidity = data.daily[i].humidity;
    var forIcon = ("https://openweathermap.org/img/wn/" + weatherId + "@2x.png");

    var forcastCard = document.createElement("div");
    var futureDate = document.createElement("p");
    var dailyIcon = document.createElement("img");
    var iconDescrip = document.createElement("p");
    var tempMin = document.createElement("p");
    var tempMax = document.createElement("p");
    var dWind = document.createElement("p");
    var dHumid = document.createElement("p");

    forcastBox.style.display = "flex";
    forcastBox.style.justifyContent = "center";

    forcastCard.style.backgroundColor ="white";
    forcastCard.style.maxHeight = "350px";
    forcastCard.style.maxWidth = "fit-content";
    forcastCard.style.marginLeft = "10px";
    forcastCard.style.marginRight = "10px";
    forcastCard.style.paddingLeft = "10px";
    forcastCard.style.paddingRight = "10px";
    forcastCard.style.textAlign = "center";
    forcastCard.style.borderRadius = "10px";
    forcastCard.style.borderColor = "black";
    forcastCard.style.borderStyle = "solid";


    futureDate.innerHTML = date;

    dailyIcon.src = forIcon;

    iconDescrip.innerHTML = descrip;

    tempMin.innerHTML = "Low of: " + dailyTempMin + "°F";

    tempMax.innerHTML = "High of: " + dailyTempMax + "°F";

    dWind.innerHTML = "Wind Speed:  " + dailyWind + " MPH";

    dHumid.innerHTML = "Humidity:  " + dailyHumidity + " %";

    forcastCard.appendChild(futureDate);
    forcastCard.appendChild(dailyIcon);
    forcastCard.appendChild(iconDescrip);
    forcastCard.appendChild(tempMin);
    forcastCard.appendChild(tempMax);
    forcastCard.appendChild(dWind);
    forcastCard.appendChild(dHumid);
    forcastBox.appendChild(forcastCard);

    if (i >= 5) {
      break;
    }
  }
  
  storedData.push(dataName);
  localStorage.setItem("pastCities", JSON.stringify(storedData));
}

//saves search history to local storage 
function localData() {
  listOfCities.innerHTML = "";
  for (let i = 0; i < storedData.length; i++) {
    const city = storedData[i];
    var listedName = document.createElement("input");
    listedName.type = "button";
    listedName.id = "cityBtn";
    listedName.value = city;
    listedName.className = "listedCities";
    listOfCities.appendChild(listedName);
  }
}

// submits city name into search
function formSubmit(event) {
  event.preventDefault();
  var cityEl = document.getElementById("cityName");
  if (event.type === "submit") {
    var cityName = cityEl.value;
    var listedName = document.createElement("input");
    listedName.type = "button";
    listedName.id = "cityBtn";
    listedName.value = cityName;
    listedName.className = "listedCities";
    listOfCities.appendChild(listedName);

  } else {
    var cityName = event.target.value;
  }

  geocodeCity(cityName);
  cityEl.value = "";
  forcastBox.innerHTML = "";
}

//clear listed cities and local storage 
function clearList() {
  localStorage.clear();
  listOfCities.innerHTML = "";
  storedData = [];
}


cityForm.addEventListener("submit", formSubmit);
listOfCities.addEventListener("click", formSubmit);
clearBtn.addEventListener("click", clearList)
localData();