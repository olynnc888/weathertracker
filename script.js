$(document).ready(function () {
    //search button
    const searchBtn = document.querySelector("#searchbtn");
    const searchVal = document.querySelector("#searchval");

    searchBtn.addEventListener("click", () => {
        const inputSearch = searchVal.value;
        searchVal.value = "";
        wFunction(inputSearch);
        wForecast(inputSearch);
    });

    //enter key function for searchbtn
    searchVal.addEventListener("keypress", (event) => {
        const kc = event.keyCode ? event.keyCode : event.which;
        if (kc === 13) {
          const inputSearch = searchVal.value;
          searchVal.value = "";
          wFunction(inputSearch);
          wForecast(inputSearch);
        }
      });
    // store and show previous seraches
      let localhistory = [];

      if (localStorage.getItem("localhistory")) {
        localhistory = JSON.parse(localStorage.getItem("localhistory"));
      }
      
      if (localhistory.length > 0) {
        wFunction(localhistory[localhistory.length - 1]);
      }
      
      function createRow(text) {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
        listItem.textContent = text;
        document.querySelector(".history").prepend(listItem);
      }
      
      localhistory.forEach((search) => {
        createRow(search);
      });
      
      document.querySelector(".history").addEventListener("click", (event) => {
        if (event.target.matches("li")) {
          const inputSearch = event.target.textContent;
          wFunction(inputSearch);
          wForecast(inputSearch);
        }
      });

    function wFunction(inputSearch) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputSearch}&appid=9f112416334ce37769e5c8683b218a0d`)
          .then(response => response.json())
          .then(data => {
            if (localhistory.indexOf(inputSearch) === -1) {
              localhistory.push(inputSearch);
              localStorage.setItem("localhistory", JSON.stringify(localhistory));
              createRow(inputSearch);
            }
            // rest of your code here
          })
          .catch(error => console.log(error));
    }

    const { name, weather, wind, main, coord } = data;
    const title = `<h3 class="title-card">${name} (${new Date().toLocaleDateString()})</h3>`;
    const image = `<img src="https://openweathermap.org/img/w/${weather[0].icon}.png" />`;
    
    const card = $('<div>').addClass('card');
    const cbody = $('<div>').addClass('card-body');
    
    const celsiusTemp = main.temp - 273.15;
    const fahrenheitTemp = (celsiusTemp * 1.8) + 32;
    const temp = `<p class="card-txt">Temperature: ${fahrenheitTemp.toFixed(1)} °F</p>`;
    const windSpeed = `<p class="card-txt">Wind Speed: ${wind.speed} MPH</p>`;
    const humidity = `<p class="card-txt">Humidity: ${main.humidity} %</p>`;
    
    cbody.append(temp, windSpeed, humidity);
    
    $.ajax({
        type: 'GET',
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=9f112416334ce37769e5c8683b218a0d&lat=${coord.lat}&lon=${coord.lon}`
    }).then(response => {
        const uvrep = response.value;
        const uvindx = `<p class="card-txt">UV Index: <span class="btn btn-sm">${uvrep}</span></p>`;
    
        if (uvrep < 3) {
            $(uvindx).find('span').addClass('successbtn');
        } else if (uvrep < 7) {
            $(uvindx).find('span').addClass('warningbtn');
        } else {
            $(uvindx).find('span').addClass('dangerbtn');
        }
    
        cbody.append(uvindx);
    });
    
    card.append(title, image, cbody);
    $('#today').append(card);

                // function to fetch and display weather data for a given city
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9f112416334ce37769e5c8683b218a0d&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(data) {
      console.log(data);
  
      // create elements to display the weather information
      var title = $("<h2>").text(data.name + " " + new Date().toLocaleDateString());
      var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
      var temp = $("<p>").text("Temperature: " + data.main.temp + " °F");
      var humidity = $("<p>").text("Humidity: " + data.main.humidity + "%");
      var wind = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");
  
      // create elements for card display
      var card = $("<div>").addClass("card bg-light mb-3");
      var cbody = $("<div>").addClass("card-body");
  
      // append elements to card and add to page
      title.append(image);
      cbody.append(title, temp, humidity, wind);
      card.append(cbody);
      $("#today").empty().append(card);
    });
  
    // function to fetch and display weather forecast for a given city
    function getForecast(city) {
      var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=9f112416334ce37769e5c8683b218a0d&units=imperial";
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(data) {
        console.log(data);
  
        // clear previous forecast information and create new elements for display
        $("#forecast").empty().append("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
        
        // loop through forecast data and create a card for each day
        for (var i = 0; i < data.list.length; i += 8) {
          var dayData = data.list[i];
    
          var date = new Date(dayData.dt_txt).toLocaleDateString();
          var iconUrl = "http://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
          var temp = dayData.main.temp;
          var humidity = dayData.main.humidity;
    
          var cardCol = $("<div>").addClass("col-md-2.5");
          var card = $("<div>").addClass("card bg-dark text-white");
          var cardBody = $("<div>").addClass("card-body p-2");
    
          cardBody.append(
            $("<h5>").addClass("card-title").text(date),
            $("<img>").attr("src", iconUrl),
            $("<p>").addClass("card-text").text("Temp: " + temp + "°F"),
            $("<p>").addClass("card-text").text("Humidity: " + humidity + "%")
          );
    
          card.append(cardBody);
          cardCol.append(card);
          $("#forecast .row").append(cardCol);
        }
      });
    }
  
    // call getForecast function to display forecast information for given city
    getForecast(city);
    }
    }
);




