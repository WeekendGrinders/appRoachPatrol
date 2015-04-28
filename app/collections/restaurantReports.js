/**
 * Restaurant Reports Collection
 * 
 * 
 */

var RestaurantReports = Backbone.Collection.extend({

    // reference to this collection's model.
    model: RestaurantReport,
    url: '/report',

});