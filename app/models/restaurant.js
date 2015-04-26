/**
 * Restaurant Model
 */

var Restaurant = Backbone.Model.extend({

    initialize: function () {
    },

    //localStorage: new Store("restaurant-cachirulo"),

    clear: function () {
        this.destroy();
    }

});