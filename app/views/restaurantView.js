/**
 * Restaurant List Item View
 * The DOM element for an single restaurant in a list of restaurants.
 */

var RestaurantView = Backbone.View.extend({

    initialize: function (options) {
        this.markerView = options.markerView; //retain instance of google marker
        this.model.on('remove', this.remove, this); //subscribe to remove events on model
        this.render();
    },

    //----------------------------------
    // Events and event handlers

    events: {
        'mouseover a': 'showRestaurantInfo',
        'mouseout a': 'hideRestaurantInfo',
        'click button': 'deleteRestaurantConfirm',
        'click a.delete': 'deleteRestaurant',
        'click a.detail': 'showRestaurantDetail'
    },

    showRestaurantDetail: function () {
        App.showDetail();
    },

    // show marker bubble
    showRestaurantInfo: function () {
        this.markerView.showRestaurantInfo.call(this.markerView.marker);
    },

    // hide marker bubble
    hideRestaurantInfo: function () {
        this.markerView.hideRestaurantInfo.call(this.markerView.marker);
    },

    // clicked on "delete". show confirm button.
    deleteRestaurantConfirm: function () {
        $('button', this.$el).hide();
        $('a.delete', this.$el).fadeIn();
    },

    deleteRestaurant: function () {
        this.model.clear();
    },

    // END Events and event handlers
    //----------------------------------

    render: function () {
        this.$el.html('<li><a class="detail" href="#" company_id="' + this.model.get('company_id') + '">' + this.model.get('name') + '</a> <button class="close">×</button> <a href="#" style="display:none" class="close delete">confirm</a></li>');
        return this;
    },

    remove: function () {
        this.$el.html('');
    }
});