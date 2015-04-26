/**
 * Company Marker View
 * The DOM element for a company marker.
 */

var RestaurantMarkerView = Backbone.View.extend({

    tagName: "li",

    initialize: function (options) {

        var self = this;

        self.model = options.model;
        self.model.on('remove', self.remove, self);

        self.map = options.map;

        var pos = self.model.get('pos');

        self.marker = new google.maps.Marker({
            map: self.map,
            position: new google.maps.LatLng(pos.lat, pos.lon),
            animation: google.maps.Animation.DROP,
            icon: 'img/restaurantMarker.png',
            title: self.model.name,
            descr: self.model.get('descr'),
            id: self.model.get('company_id')
        });

        self.marker.infowindow = new google.maps.InfoWindow({
            content: self.marker.descr
        });

        google.maps.event.addListener(self.marker, 'mouseover', self.showRestaurantInfo);
        google.maps.event.addListener(self.marker, 'mouseout', self.hideRestaurantInfo);
        google.maps.event.addListener(self.marker, 'click', self.showRestaurantDetail);
    },

    //---------------------------------------
    // Event handlers for marker events

    showRestaurantDetail: function () {
        this.infowindow.close();
        App.showDetail();
    },

    hideRestaurantInfo: function () {
        this.setIcon('img/restaurantMarker.png');
        this.infowindow.close();
    },

    showRestaurantInfo: function () {
        this.setIcon('img/restaurantMarkerSelected.png');
        this.infowindow.open(this.map, this);
    },

    // END Events and event handlers
    //----------------------------------

    render: function () {
    },

    remove: function () {
        this.marker.setMap(null);
        this.marker = null;
    }
});
