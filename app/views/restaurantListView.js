/**
 * Restaurant List View
 * The DOM element for a list of restaurant items.
 */

var RestaurantListView = Backbone.View.extend({

    el: $('#restaurantListView'),

    initialize: function (options) {
        this.map = options.map;
        this.model.on('add', this.addRestaurant, this);

        // initialize position
        this.$el.css({display: 'none', right: '20px', top: '120px'}, 2000);
        this.$el.fadeIn('500');

        this.listContainer = $('#restaurantList ul', this.$el);

        this.render();
    },

    //----------------------------------
    // Events and event handlers

    events: {
        'click #btnReset': 'reset'
    },
    'reset' : function() {
        Restaurants.remove_all();
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