var firstIteration = true;
var errorInAPI = false;
var lastGoodCity;
var removedCity;

// This function displays the weather for city which button is clicked
function displayCityWeather(cityName) {
  $(".weatherResult").removeClass("invisible");
  $(".text-danger").detach();
  // URL for "Current Weather API". this is mainly needed to get lat and long for the input city
  var weatherApiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=07f0e0a67e0b50a9e658e6cfe5b0368a";

  // Creates AJAX call for the specific city button being clicked
  $.ajax({
    url: weatherApiURL,
    method: "GET"
  }).then(
    function(response) {
    var lat = response.coord.lat;
    var long = response.coord.lon;
    var cityCountry = response.name + "," + response.sys.country;
    callOneCallAPI(cityCountry, lat, long);
    },
    function(errResponse) {
      errorInAPI = true;
      var msg = cityName + " " + errResponse.responseJSON.message;
      weatherAPIFail(msg);
    }
  )
};

// This function calls the 'One Call API' to get current and 5 day forecast weather information 
function callOneCallAPI (Name, cityLat, cityLong) {
  OneCallApiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&units=imperial&appid=07f0e0a67e0b50a9e658e6cfe5b0368a";

  $.ajax({
    url: OneCallApiURL,
    method: "GET"
  }).then(function(response) {

    var weatherDate = new Date(response.current.dt * 1000).toLocaleDateString();
    var tempFarh = response.current.temp + "°F";
    var humidity = response.current.humidity + "%";
    var windSpeed = response.current.wind_speed + " MPH";
    var UVIndex = parseFloat(response.current.uvi);

    var icon = response.current.weather[0].icon;
    var urlIcon = "http://openweathermap.org/img/wn/" + icon + ".png";
    // var iconImg = $("<img>").attr({src: urlIcon, style: "box-shadow: 2px 2px;"});
    var iconImg = $("<img>").attr("src", urlIcon);

    // Display Current weather information
    $("#cityNameDate").text(Name + "(" + weatherDate + ")");
    $("#cityNameDate").append(iconImg);
    $("#currentTemp").text("Temperature: " + tempFarh);
    $("#currentHmdty").text("Humidity: " + humidity);
    $("#currentWind").text("Wind Speed: " + windSpeed);
    $("#currentUVI").text("UV Index: ");
    var spanUVI = $("<span class='badge'>").text(UVIndex);
    if (UVIndex < 8) {
      spanUVI.attr("style", "background-color: Orange");
    }
    else if (UVIndex < 10) {
      spanUVI.attr("style", "background-color: Red");
    } 
    else {
      spanUVI.attr("style", "background-color: Purple; color: White;");
    }
    
    $("#currentUVI").append(spanUVI);

    // Display Next 5 Day Forecast weather information
    $(".weatherResult").children("h3").text("5 Day Forecast: ");
    var cardGrpDiv = $(".futureWeather");
    cardGrpDiv.empty();
    for (j = 1; j < 6; j++) {
      var dtForecast = new Date(response.daily[j].dt * 1000).toLocaleDateString();
      var tempForecast = response.daily[j].temp.day + "°F";
      var humidityForecast = response.daily[j].humidity + "%";
      var iconForecast =  response.daily[j].weather[0].icon;
      var urlIconForecast = "http://openweathermap.org/img/wn/" + iconForecast + ".png";

      var newDiv = $("<div>").attr({
        class: "card text-white bg-info m-2 p-2",
        style: "max-width: 10rem;"
      });

      newDiv.append($("<p>").text(dtForecast));
      newDiv.append($("<img>").attr({src: urlIconForecast, width: "50%"}));
      newDiv.append($("<p>").text("Temp: " + tempForecast));
      newDiv.append($("<p>").text("Humidity: " + humidityForecast));

      cardGrpDiv.append(newDiv);
    }

  });
  lastGoodCity = Name;
};

function weatherAPIFail(errMessage) {
  var citiesStorage = JSON.parse(localStorage.getItem("cities"));
  citiesStorage.splice(0,1);
  if (removedCity) {
    citiesStorage.push(removedCity[0]);
  }
  
  localStorage.setItem("cities", JSON.stringify(citiesStorage));
  renderButtons();
  displayCityWeather(lastGoodCity);
  $(".weatherResult").removeClass("invisible");
  var errorDiv = $(".weatherToday");
  errorDiv.prepend($("<h4 class='text-danger'>").text(errMessage));
}

// Function to display buttons for the City name presnt in the cities array
function renderButtons() {
  
  var citiesStorage = JSON.parse(localStorage.getItem("cities"));
  if (!citiesStorage) {
    citiesStorage =[];
  }

  $(".cityButtons").empty();
  $(".weatherResult").addClass("invisible");

  for (var i = 0; i < citiesStorage.length; i++) {
    var newButton = $("<button>");
    newButton.addClass("btn btn-outline-secondary btn-md btn-block cityButton");
    newButton.attr("data-name", citiesStorage[i]);
    newButton.text(citiesStorage[i]);
    $(".cityButtons").append(newButton);
  }

  if (!errorInAPI) {
    if (citiesStorage.length > 0) {
      if (firstIteration) {
        displayCityWeather(citiesStorage[0]);
      }
    }
  }
};

// This function adds new City name in the array and calls function to add new button on screen
$("#searchCity").on("click", function(event) {
  event.preventDefault();

  //Get list of previously searched City names from local storage 
  var citiesStorage = JSON.parse(localStorage.getItem("cities"));

  //Get the input value entered by the user and convert it's first character to uppercase
  var cityInput = $("#inputCity").val().trim();
  var cityUCase = cityInput.substr(0,1).toUpperCase() + cityInput.substr(1).toLowerCase();
  
  $("#inputCity").val(""); // Clear the input text field

  //If no data found in local storage, push first eleement to cities array
  if (!citiesStorage) {
    citiesStorage = [cityUCase];
  } 
  else {
    var indexOfCity = $.inArray(cityUCase, citiesStorage);//check if input city name is already in the array
    if (indexOfCity == -1) { //if not found, add city name to the start of the array
      citiesStorage.unshift(cityUCase);
      if (citiesStorage.length > 10) { //if there are more than 10 elements in the array, remove last element
        removedCity = citiesStorage.splice(citiesStorage.length-1, 1);
      }
    }
  }
  
  //Save the cities array in the local storage
  localStorage.setItem("cities", JSON.stringify(citiesStorage));
  renderButtons();
  displayCityWeather(cityUCase);
});

//Event Listner for City Name buttons. This fuctions check which CIty button was clicked and calls fuctions 
//to display weather for that City. 
$(document).on("click", ".cityButton", function() {
  var cityClicked =  $(this).attr("data-name");
  displayCityWeather(cityClicked);
});

renderButtons();
firstIteration = false;