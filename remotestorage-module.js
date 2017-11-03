var MyFavoriteDrinks = {
  name: 'myfavoritedrinks',
  builder: function(privateClient) {
    privateClient.declareType('drink', {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    });

    return {
      exports: {

        init: function() {
          privateClient.cache('');
        },

        on: privateClient.on,

        addDrink: function(name) {
          var id = name.toLowerCase().replace(/\s|\//g, '-');
          return privateClient.storeObject('drink', id, {
            name: name
          });
        },

        removeDrink: privateClient.remove.bind(privateClient),

        listDrinks: function() {
          return privateClient.getAll('');
        }
      }
    }
  }
};
