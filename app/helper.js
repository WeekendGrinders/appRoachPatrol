// Helper Functions

var geocoder;
var marker, i;
var zipLat;
var zipLng;
var zipLatLng;
var usersDB;

var zipLocation = {};
var gMarkers = [];

//Get user's location from browser via HTML5
function getLocation (){
    if (navigator.geolocation) {
        // Use method getCurrentPosition to get coordinates
        navigator.geolocation.getCurrentPosition(function (position) {
            // zipLat and zipLng assigned to global vars
            zipLat = position.coords.latitude;
            zipLng = position.coords.longitude;
            var LatLng = zipLng + ',' + zipLat;
            zipLatLng = zipLat + ',' + zipLng;
            console.log(LatLng);
            var center = new google.maps.LatLng(zipLat, zipLng);
            map.panTo(center);
            //logUserPos.send(LatLng);
            //return LatLng;
            Restaurants.fetch({
                success: function (collection, response, options) {
                    // you can pass additional options to the event you trigger here as well
                    console.log("fetch successful, checking for no results...");
                    if (Restaurants.models[0].attributes.hasOwnProperty('message')) {
                        console.log("no results found.");
                        noResults(Restaurants.models[0].attributes.message);
                    } else {
                        console.log("Putting markers on the map...");
                        plotMarkers();
                    }

                },
                data: LatLng}); //<< same as center point latlng above
        });
    } else {
        alert('Geolocation not supported, please select zipcode from drop down menu');
    }

    zipLatLng = '';
}



function clearOverlays() {
  for (var i = 0; i < gMarkers.length; i++ ) {
    gMarkers[i].setMap(null);
  }
  gMarkers.length = 0;
}

function noResults(message) {
    console.log("Need to show user that there was no results");
    if ($('.noResults').length == 0){
        $('#app').prepend('<div class="noResults">No restaurants were found nearby. Please select a zipcode.</div>');
    } else {
        //maybe highlight the div if it's already in the DOM????
    }
}

//Getting latLng of requested zipcode and storing them in zipLat and zipLng
function getLatLng(zip) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
            address: zip
        },
        function(results, status){
            if(status == google.maps.GeocoderStatus.OK) {
                var zipCodeLat = results[0].geometry.location.lat();
                console.log(zipCodeLat);
                var zipCodeLng = results[0].geometry.location.lng();
                console.log(zipCodeLng);
                var center = new google.maps.LatLng(zipCodeLat, zipCodeLng);
                map.panTo(center);
                var LatLng = zipCodeLng + ',' + zipCodeLat;
                console.log(LatLng);
                Restaurants.fetch({
                    success: function (collection, response, options) {
                        console.log("fetch successful, checking for no results...");
                        if (Restaurants.models[0].attributes.hasOwnProperty('message')) {
                            console.log("no results found.");
                            noResults(Restaurants.models[0].attributes.message);
                        } else {
                            console.log("Putting markers on the map...");
                            plotMarkers();
                            //var listView = new RestaurantListView({model: Restaurants, map: self.map});
                            //listView.render();
                            //console.log(listView.el);
                        }
                    },
                    data: LatLng
                }); //<< same as center point latlng above
            } else {
                //something went very wrong...
                alert('Geocode was not successful');
            }
        })
}

function plotMarkers() {
    //Clear current data from restaurant list
    $('#restaurantList').html('');
    for(var i = 0; i < Restaurants.models.length; i++) {
        console.log(
            'Name: ' + Restaurants.models[i].attributes.name + '\n' +
            'InspectionID: ' + Restaurants.models[i].attributes.inspection_number + '\n' +
            'Lat: ' + Restaurants.models[i].attributes.location.Latitude + '\n' +
            'Long: ' + Restaurants.models[i].attributes.location.Longitude + '\n'
        );
        
        //repopulate with fresh data
        $('#restaurantList').append('<div id="'+i+'" class="resultItem" onmouseover="listItemHover('+i+')" onmouseout="stopAnimation('+i+')" onClick="getThis('+i+')"><span class="restName">' + Restaurants.models[i].attributes.name + '</span><br><span class="restAddress">' + Restaurants.models[i].attributes.address.street + '</span><span class="restScore"> Score:' + Restaurants.models[i].attributes.score + '</span></div>');
        if ((i%2) != 0) {
            $('#'+i).css({background: "#CCC"});
        }
        
        //Initialize infoWindows for the markers
        var infowindow = new google.maps.InfoWindow();

        //Close any open infoWindow if the map is clicked (don't want more than one open at a time)
        google.maps.event.addListener(map, 'click', function() {
            infowindow.close();
        });
        
        //create markers
        var iconMarker = '';

        if (Restaurants.models[i].attributes.score >= 90) {
            iconMarker = 'img/restaurantMarker.png';
        } else if (Restaurants.models[i].attributes.score >= 80){
            iconMarker = 'img/restaurantCold.png';
        } else {
            iconMarker = 'img/restaurantMarkerSelected.png';
        }

        //Initialize infoWindows for the markers
        var infowindow = new google.maps.InfoWindow();

        marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: iconMarker,
            position: new google.maps.LatLng(Restaurants.models[i].attributes.location.Latitude, Restaurants.models[i].attributes.location.Longitude),
            title: Restaurants.models[i].attributes.name //hover pop-up name
        });

        //open the infoWindow for the restaurant when a marker is clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            console.log("Hey! You clicked a marker! This marker: " + marker);
            return function() {
                var restaurantID = Restaurants.models[i].attributes.id;
                var inspectionNums = Restaurants.models[i].attributes.inspection_number.join('_');
                infowindow.setContent('<div class="restInfoWindow"><h4>' + Restaurants.models[i].attributes.name + '</h4> Score: ' +Restaurants.models[i].attributes.score+ '<br><div class="inspectionNums" onClick="openReports(\''+inspectionNums+'\')"> Inspections reports: ' + Restaurants.models[i].attributes.inspection_number+'</div><button onclick="App.showDetail(\''+inspectionNums+'\')" class="showMore btn btn-default">More Info</button><div>');
                infowindow.open(map, marker);
                App.showDetail();
            }
        })(marker, i));
        gMarkers.push(marker);
    }
    $('#restaurantListView').css({display: "block"});
}
/*
function plotUsers(){
    for (var i =0; i < usersDB.length; i++) {
        var infowindow = new google.maps.InfoWindow();

        marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'img/user.png',
            position: new google.maps.LatLng(usersDB[i].lat, usersDB[i].lng),
            title: 'User location' //hover pop-up name
        });

        //open the infoWindow for the restaurant when a marker is clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent('<div class="restInfoWindow"><h4>A user made a request at this location.</h4><div>');
                infowindow.open(map, marker);
            }
        })(marker, i));
        gMarkers.push(marker);
    }
}
*/
function initialize() {
    console.log("Rendering the map...");

    //setting center point and zoom level
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(zipLat, zipLng)
    };

    //creating map
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker;
    //Initialize infoWindows for the markers
    var infowindow = new google.maps.InfoWindow();

    //Close any open infoWindow if the map is clicked (don't want more than one open at a time)
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });


    //console.log(restaurants.results);

    //loop through ajax results and place markers on the map for each restaurant
    for(var i = 0; i < restaurants.results.length; i++) {
        console.log(
            'Name: ' + restaurants.results[i].name + '\n' +
            'InspectionID: ' + restaurants.results[i].inspection_number + '\n' +
            'Lat: ' + restaurants.results[i].location.Latitude + '\n' +
            'Long: ' + restaurants.results[i].location.Longitude + '\n'
        );
        //show info in sidebar
        $('.results').append('<div id="'+i+'" class="resultItem" onClick="getThis('+i+')"><span class="restName">' + restaurants.results[i].name + '</span><br><span class="restAddress">' + restaurants.results[i].address.street + '</span><span class="restScore"> Score:' + restaurants.results[i].score + '</span></div>');
        if ((i%2) != 0) {
            $('#'+i).css({background: "#CCC"});
        }
        //create markers
        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(restaurants.results[i].location.Latitude, restaurants.results[i].location.Longitude),
            title: restaurants.results[i].name //hover pop-up name
        });

        //open the infoWindow for the restaurant when a marker is clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                var inspectionNums = restaurants.results[i].inspection_number.join('_');
                infowindow.setContent('<h4>' + restaurants.results[i].name + '</h4> Score: ' +restaurants.results[i].score+ '<br><div class="inspectionNums" onClick="openReports(\''+inspectionNums+'\')"> Inspections reports: ' + restaurants.results[i].inspection_number+'</div>');
                infowindow.open(map, marker);
            }
        })(marker, i));
        gMarkers.push(marker);
    }
}

function openReports(arrString) {
    var inspection_numbers = arrString.split('_');
    console.log(inspection_numbers);
    console.log(arrString);
}

function getThis(marker) {
    console.log("Clicked a result..." + marker);
    google.maps.event.trigger(gMarkers[marker], "click");
}

function listItemHover(marker) { 
    //google.maps.event.trigger(gMarkers[marker], "click");
    //google.maps.event.trigger(gMarkers[marker], "click", function(){gMarkers[marker].setAnimation(google.maps.Animation.BOUNCE);});
    //console.log("animate this marker:" + gMarkers[marker]);
    gMarkers[marker].setAnimation(google.maps.Animation.BOUNCE);
}

function stopAnimation(marker) {
    //console.log("Stop animating this marker:" + gMarkers[marker]);
    gMarkers[marker].setAnimation(google.maps.Animation.drop);
}

var restaurants = {};
var opt = {lat:45.584332000, lng:-122.728474000};
//Hard coding inspection number for now
var inspectionNum = "6203471";
var report = {};

//Calling for inspection record around a certain latlong
var roachPatrol = {
    url: '/go',
    go: function() {
        $.ajax({
            url: this.url,
            data: opt,
            method: 'GET',
            dataType: 'json',
            error : function(httpReq,status,exception){
                alert(status+" "+exception);
            }
        }).done(acceptResponse)
    }
}

//Calling for a specific inspection record
var roachPatrol = {
    url: '/restaurants',
    go: function() {
        $.ajax({
            url: this.url,
            data: opt,
            method: 'GET',
            dataType: 'json',
            error : function(httpReq,status,exception){
                alert(status+" "+exception);
            }
        }).done(acceptResponse)
    }
}

//Calling for a specific inspection record
var restaurantInspection = {
    url: '/report',
    report: function() {
        $.ajax({
            url: this.url,
            data: inspectionNum,
            method: 'GET',
            dataType: 'json',
            error : function(httpReq,status,exception){
                alert(status+" "+exception);
            }
        }).done(inspectionReport)
    }
}

//Display and store data from API (for inspection records)
function acceptResponse(data, status, jqXHR) {
    console.log('Response data: ');
    console.log(data);
    console.log('Data type: '+ typeof data);
    console.log('Response status: '+status);
    console.log(jqXHR);
    restaurants = data;
    //renderMap();
    initialize();
}

function mongoResponse(data, status, jqXHR) {
    console.log("From node/mongo: " + data);
    usersDB = data;
}

//Display and store data from API (for inspection report)
function inspectionReport(data, status, jqXHR) {
    console.log('Response data: ');
    console.log(data);
    console.log('Data type: '+ typeof data);
    console.log('Response status: '+status);
    console.log(jqXHR);
    report = data;
}