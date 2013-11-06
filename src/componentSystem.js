(function() {

    game.component = {};

    game.createEntity = function(properties, components) {

        var prop;
        var entity = {};

        for (prop in properties) {
            entity[prop] = properties[prop];
        }

        components.forEach(function(component) {
            for (prop in component) {
                if (entity.hasOwnProperty(prop)) {
                    throw "Entity property conflict! " + prop;
                }
                entity[prop] = component[prop];
            }
        });

        return entity;

    },

    game.removeEntityById = function(id) {
        for (var e in game.entities) {
            if (game.entities[e].id === id) {
                delete game.entities[e];
            }
        }
    }

}());

