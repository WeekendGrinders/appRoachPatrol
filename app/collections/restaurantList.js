/**
 * Restaurant Collection
 * The collection of companies is backed by *localStorage* instead of a remote
 * server.
 */

var RestaurantList = Backbone.Collection.extend({

    // reference to this collection's model.
    model: Restaurant,
    url: '/restaurants',

    //localStorage: new Store("restaurant-cachirulo"),

    //addNew: function (restaurant) {
    //    this.create(restaurant);
    //},
    //
    //// companies are sorted by their name
    //comparator: function (restaurant) {
    //    return restaurant.get('name');
    //},
    //
    //removeAll: function () {
    //    var model;
    //    while (model = this.pop()) {
    //        model.destroy();
    //    }
    //}
});