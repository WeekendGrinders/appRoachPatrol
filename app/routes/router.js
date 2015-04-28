var router = new(Backbone.Router.extend({
    routes: {
        "": "index",
        "restaurants/:id": "showRestaurant",
        "restaurants/near/:latlng": "showRestaurantsNear",
        "restaurants/zipcode/:zipcode": "showRestaurantsZipcode"
    },
    initialize: function() {
        this.restaurantList = new RestaurantList();
        this.restaurantListView = new RestaurantListView({collection: this.restaurantList});
        $('#app').append(this.restaurantListView.el);
    },
    start: function() {
        Backbone.History.start({pushState: true});
    },
    index: function() {
        this.restaurantList.fetch();
    },
    showRestaurant: function(id) {
        this.restaurantList.getDetails(id);
    },
    showRestaurantNear: function(latlng) {
        this.restaurantList.getNear(latlng);
    },
    showRestaurantZipcode: function(zipcode) {
        this.restaurantList.getZipcode(zipcode);
    }
}));