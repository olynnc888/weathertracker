$(document).ready(function() {
    //search button
    $("#searchbtn").on("click", function () {
        //value after search value in inputted
        var inputsearch = $("#searchval").val();
        //if searchval is empty
        $("#searchval").val("");
        wFunction(inputsearch); // corrected function name
        wForecast(inputsearch); // corrected function name
    });

    //enter key function for searchbtn
    $("#searchbtn").keypress(function(event) {
        var kc = (event.keyCode ? event.keyCode : event.which);
        if (kc === 13) {
            var inputsearch = $("#searchval").val(); // added variable initialization
            wFunction(inputsearch); // corrected function name
            wForecast(inputsearch); // corrected function name
        }
    });

    //store and show previous searches
    var localHistory = JSON.parse(localStorage.getItem("localHistory")) || [];

    //sets localhistory array to needed length
    if (localHistory.length > 0) {
        wFunction(localHistory[localHistory.length - 1]); // corrected function name
    }
    //shows history items in rows
    for (var i = 0; i < localHistory.length; i++) {
        createRow(localHistory[i]);
    }

    //orders searched cities from most recent to least
    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").prepend(listItem);
    }

    //lists items once click function is initiated
    $(".history").on("click", "li", function() {
        var inputsearch = $(this).text(); // added variable initialization
        wFunction(inputsearch); // corrected function name
        wForecast(inputsearch); // corrected function name
    });

    function wFunction(inputsearch) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + inputsearch + "&appid=9f112416334ce37769e5c8683b218a0d",
            success: function(data) { // added success callback
                if (localHistory.indexOf(inputsearch) === -1) {
                    localHistory.push(inputsearch);
                    localStorage.setItem("localHistory", JSON.stringify(localHistory));
                    createRow(inputsearch);
                }
                //clearing content
                $("#today").empty(); // corrected selector

                var title = $("<h3>").addClass("title-card").text(data.name + " (" + new Date().toLocaleDateString() + ")");
                var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                var card = $("<div>").addClass("card");
                var cbody = $("<div>").addClass("card-body"); // corrected class name
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH"); // corrected property name
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K"); // corrected temperature unit
                console.log(data)
                var longitude = data.coord.lon; // corrected property name
                var latitude = data.coord.lat; // corrected property name

                $.ajax({
                    type: "GET",
                    url: "https://api.openweathermap.org/data/2.5/uvi?appid=
