# Robotiface
Weather App homework (wk6)
1) User Inputs City name in the search field.
2) Using the input City Name, "Current Weather Data" API is called. This is mainly used
    to get the Latitude and Longitude for the input City. Tnis is needed as the next API we are going to call
     accepts only Latitude and Longitude in the input. 
   Other data returned from API is not used as all the required informaiton is anyways returned from the next
    API. 
3) Using the Latitude and Longitude from previous API, "One Call API" is called to get Current weather data. 
    This includes the UV Index which is missing in the response from "Current Weather Data" API.
4) "One Call API" also returns forecast for next 7 days. From this, we use 5 days of Data to display. 
5) When user searches for a City name, a new button is displayed on the page for that City name. This 
    application is desiged to display last 10 cities searched by user. If more than 10 cities are searched, the oldest city button is removed from the page. 
    
