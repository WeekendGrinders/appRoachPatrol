// global for the sake of this example
var Restaurants = new RestaurantList();
var Reports = new RestaurantReports();
var App = null;
var test;
var map;

/**
 * The App
 * Our overall **AppView** is the top-level piece of UI.
 */
var AppView = Backbone.View.extend({

    el: $("#app"),

    //--------------------------------------
    // Event wiring (events and event handlers)

    events: {
        'click #btnMap': 'showMap',
        'click #myPosition' : 'getLoc',
        'click .zipOpt': 'getThisZip',
        'click .showMore' : 'showDetail'
    },

    getLoc: function() {
        console.log("You clicked that button!!!");
        getLocation();
    },

    getThisZip: function() {
        clearOverlays();
        test = '';
        test = event.target.id;
        console.log("Base :" + test);
        $('.noResults').remove();
        getLatLng(test);
    },

    showDetail: function (reportString) { //triggers "detail" mode
        var self = this;
        var top = 66;
        var speed = 600;

        
        var inspection_numbers = reportString.split('_');
        Reports.fetch({
            data: reportString, 
            success: function(collection, response, options) {
                var inspectorComments = '';
                $('#restaurantDetails').empty();
                $('#restaurantDetails').append('<span class="restName"><h1>'+Reports.models[0].attributes.restaurant_name+'</h1></span>');
                for (var i = 0; i < Reports.length; i++) {
                    var scoreObj = {};
                    if (Reports.models[i].attributes.score >= 90) {
                        scoreObj = {
                            letter : "A",
                            color : "green"
                        }
                    } else if (Reports.models[i].attributes.score >= 80) {
                        scoreObj = {
                            letter : "B",
                            color : "orange"
                        }                        
                    } else if (Reports.models[i].attributes.score >= 70) {
                        scoreObj = {
                            letter : "C",
                            color : "red"
                        }    
                    } else if (Reports.models[i].attributes.score >= 60) {
                        scoreObj = {
                            letter : "D",
                            color : "red"
                        }    
                    } else {
                        scoreObj = {
                            letter : "F",
                            color : "red"
                        }    
                    }
                    $('#restaurantDetails').append('<hr><div class="report'+i+'"><div class="score"><h2>Score: '+Reports.models[i].attributes.score+'               <span style="color:'+scoreObj.color+'"><b>'+scoreObj.letter+'</b></span></h2></div><div class="date">Date: '+Reports.models[i].attributes.date+'</div><div id="violation'+i+'"></div></div>');
                    for (var j = 0; j < Reports.models[i].attributes.violations.length; j++) {
                        if (!Reports.models[i].attributes.violations[j].law) {
                            $('#violation'+i).append('<div class="noViolations"><h4>No violations to report from this inspection.</h4></div>');
                        } else {
                            inspectorComments += (Reports.models[i].attributes.violations[j].violation_comments + '\n');

                        }
                    }
                if (inspectorComments !='') {
                    $('#violation'+i).append('<div class="comments"><h4>Comments from inspector:</h4>'+inspectorComments+'</div></div>');
                }
                inspectorComments = '';
                }
            }
        });

        // set content position and fade in        
        self.main.animate({top: (top) + 'px'}, speed, function () {
            self.main.fadeIn();
        });

        self.restaurantView.fadeOut();

        // controls to switch back to map
        self.controls.hide().css({top: (top + 3) + 'px'});
        setTimeout(function () {
            self.contentControls.fadeIn();
        }, 2 * speed);

        // resize map canvas
        self.mapCanvas.animate({height: (top) + 'px'}, speed);
        $('#restaurantListView').css({height : '20px'});
    },

    showMap: function () { // triggers "map" mode
        var self = this;
        var speed = 800;

        // hide content
        self.main.fadeOut();

        // hide controls
        self.controls.hide();

        self.restaurantView.fadeIn();

        // resize map canvas. make map 100%
        self.mapCanvas.animate({height: '100%'}, speed);

        setTimeout(function () {
            // show map controls
            self.mapControls.css({top: '80%'});
            self.mapControls.fadeIn();
        }, speed);
        $('#restaurantListView').css({height : '87%'});
    },

    // END Events and event handlers
    //----------------------------------


    //--------------------------------------
    // Initialize map
    //--------------------------------------
    _initialize_map: function () {
        var test = this;
        var center = new google.maps.LatLng(45.522234, -122.676309); //<< pass in center latlng from either zip or myPos
        var styles = [
            {
                elementType: "geometry",
                stylers: [
                    {lightness: 33},
                    {saturation: -90}
                ]
            }
        ];


        var mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: center,
            styles: styles
        };
        console.log("This in the _initialize_map function: " + test);

        map = new google.maps.Map(document.getElementById('mapCanvas'),
            mapOptions);

        google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center); 
        });
        //console.log("This.map :" test.map);
    },


    //--------------------------------------
    // Initialize app
    //--------------------------------------

    initialize: function () {
        var self = this;

        // cache DOM elements for faster access
        self.main = $('#main');
        self.controls = $('.nav_controls');
        self.contentControls = $('#contentControls');
        self.mapControls = $('#mapControls');
        self.mapCanvas = $('#mapCanvas');
        self.header = $('header');
        self.restaurantView = $('#restaurantView');

        // initialize map
        self._initialize_map();

        // Initial control positions
        // Move header up (out of window)
        self.header.css({top: '-1000px'});
        self.header.animate({top: '0px'}, 1500);

        // hide all controls
        self.controls.hide();
        self.controls.css({top: '80%'});

        // self.mapControls.fadeIn();
        setTimeout(function () {
            self.mapControls.fadeIn();
        }, 1000);

        setTimeout(function () { // fetch data with some delay
            //Restaurants.fetch(function() {
            getLocation();
            //getAllUsers.go();
            //}); //<< same as center point latlng above
            // create views
            //var listView = new RestaurantListView({model: Restaurants, map: self.map});
            //listView.render();
            //console.log(listView.el);
        }, 0);
    }
});

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {
    App = new AppView();
});