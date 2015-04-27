// global for the sake of this example
var Restaurants = new RestaurantList();
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
        'click #btnDetail': 'showDetail',
        'click #btnMap': 'showMap',
        'click #myPosition' : 'getLoc',
        'click .zipOpt': 'getThisZip'
    },

    getLoc: function() {
        console.log("You clicked that button!!!");
        getLocation();
    },

    getThisZip: function() {
        test = '';
        test = event.target.id;
        console.log("Base :" + test);
        $('.noResults').remove();
        getLatLng(test);
    },

    showDetail: function () { //triggers "detail" mode
        var self = this;
        var top = 200;
        var speed = 600;

        // set content position and fade in
        self.main.animate({top: (top) + 'px'}, speed, function () {
            self.main.fadeIn();
        });

        self.restaurantView.fadeOut();

        // controls to switch back to map
        self.controls.hide().css({top: (top - 100) + 'px'});
        setTimeout(function () {
            self.contentControls.fadeIn();
        }, 2 * speed);

        // resize map canvas
        self.mapCanvas.animate({height: (top) + 'px'}, speed);
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

        //Initialize infoWindows for the markers
        var infowindow = new google.maps.InfoWindow();

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