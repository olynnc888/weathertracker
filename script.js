$(document).ready(function () {
    //search button
    $("#searchbtn").on("click", function () {
        //value after search value in inputted
        var inputsearch = $("#searchval").val();
        //if searchval is empty
        $("#searchval").val("");
        wFunction(inputsearch);
        wForcast(inputsearch);
    });

    //enter key function for searchbtn
    $("#searchbtn").keypress(function (event) {
        var kc = (event.keyCode ? event.keyCode : event.which);
        if (kc === 13) {
            var inputsearch = $("#searchval").val();
            wFunction(inputsearch);
            wForcast(inputsearch);  
        }
    });

    //store and show previous searches
    var localhistory = JSON.parse(localStorage.getItem("localhistory")) || [];

    //sets localhistory array to needed length
    if (localhistory.length > 0) {
        wFunction(localhistory[localhistory.length - 1]);
    }

    //shows history items in rows
    for (var i = 0; i < localhistory.length; i++) {
        createRow(localhistory[i]);
    }

    //orders searched cities from most recent to least 
    function createRow(text) {
        var listitem = $("<li>").addClass("list-item").text(text);
        $(".history").prepend(listitem);
    }

    //lists items once click funtion is initiated
    $(".history").on("click", "li", function () {
        var inputsearch = $(this).text();
        wFunction(inputsearch);
        wForecast(inputsearch);
    });

    function wFunction(inputsearch) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + inputsearch + "&appid=9f112416334ce37769e5c8683b218a0d",

        }).then(function (data) {
            if (localhistory.indexOf(inputsearch) === -1) {
                localhistory.push(inputsearch);
                localStorage.setItem("localhistory", JSON.stringify(localhistory));
                createRow(inputsearch);
            }
            //clearing content
            $("#today").empty();

            var title = $("<h3>").addClass("title-card").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            var card = $("<div>").addClass("card");
            var cbody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-txt").text("Wind Speed: " + data.wind.speed + " MPH");
            var humidity = $("<p>").addClass("card-txt").text("Humidity: " + data.main.humidity + " %");
            var temp = $("<p>").addClass("card-txt").text("Temperature: " + data.main.temp + " K");
            var longitude = data.coord.lon;
            var latitude = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=9f112416334ce37769e5c8683b218a0d&lat=" + latitude + "&lon=" + longitude,

            }).then(function (response) {

                var uvrep = response.value;
                var uvindx = $("<p>").addClass("card-txt").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvrep);
                    
                if (uvrep < 3)
                    btn.addClass("successbtn");
                } else if (uvrep < 7) {
                    btn.addClass("warningbtn");
                } else {
                    btn.addClass("dangerbtn");
                }

                cbody.append(uvindx);
                $("#today .cbody").append(uvindx.append(btn));
                    
            });

                //add to page after merge
                title.append(image);
                cbody.append(title, temp, humidity, wind);
                card.append(cbody);
                $("#today").append(card);
                console.log(data);
            });
        }
        // Forcast function using the search function
        function wforcast(inputsearch) {
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + inputsearch + "&ppid=9f112416334ce37769e5c8683b218a0d&units=imperial",

            }).then(function (data) {
                console.log(data);
                $("#forecast").html("<h4 class=\"mt-3\">5-Day Forcast:</h3>").append("<div class=\"row\">");

                //new card creation function

                for (var i = 0; i < data.list.length; i++) {

                    var titleall = $("<h3>").addClass("title-card").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgall = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var columnall = $("<div>").addClass("col-md-2.5");
                    var cardall = $("<div>").addClass("card bg-dark text-white");
                    var bodyall = $("<div>").addClass("card-body p-2");
                    var humidall = $("<p>").addClass("card-text").text("Humidity: "data.list[i]main.humidity + "%");
                    var tempall = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                    //show on page
                    columnall.append(cardall.append(bodyall.append(titleall, imgall, tempall, humidall)));
                    $("#forcast .row").append(columnall);
                }
            }
        });
    }

});




