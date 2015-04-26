/**
 * Restaurant List View
 * The DOM element for a list of restaurant items.
 */

var RestaurantListView = Backbone.View.extend({

    el: $("#restaurantListViewContainer"),

    initialize: function (options) {
        this.map = options.map;
        this.model.on('add', this.addRestaurant, this);

        // initialize position
        this.$el.css({display: 'none', right: '20px', top: '120px'}, 2000);
        this.$el.fadeIn('500');

        this.listContainer = $('#restaurantListView ul', this.$el);

        this.render();
    },

    //----------------------------------
    // Events and event handlers

    events: {
        'click #btn_pop_new_company': 'newRestaurantPopup',
        'click #btn_delete_all_companies': 'deleteAllRestaurants',
    },

    // event handler for "new restaurant" action
    newRestaurantPopup: function () {
        if (Restaurants.length > 15) {
            alert('limited to 15!');
            return;
        }
        var restaurant = dummy_data_generator.get_dummy_company();
        this.model.addNew(restaurant);
    },

    // event handler for "delete all companies" action
    deleteAllRestaurants: function () {
        Restaurants.removeAll();
    },

    // END Events and event handlers
    //----------------------------------

    addRestaurant: function (restaurant) {
        var markerView = new RestaurantMarkerView({model: restaurant, map: this.map});
        var itemView = new RestaurantView({model: restaurant, markerView: markerView});
        $(this.listContainer).append(itemView.render().el);
    },

    render: function () {
        this.model.each(this.addRestaurant, this);
    }
});