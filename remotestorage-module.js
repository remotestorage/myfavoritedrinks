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
          // privateClient.cache('');
        },

        on: privateClient.on,

        addDrink: function(name) {
          var id = name.toLowerCase().replace(/\s|\//g, '-');
          console.log('addDrink calls privateClient.storeObject', 'drink', id, name);
          return privateClient.storeObject('drink', id, {
            name: name
          });
        },

        removeDrink: privateClient.remove.bind(privateClient),

        listDrinks: function() {
          console.log('listDrinks calls privateClient.getAll');
          return privateClient.getAll('');
        }
      }
    }
  }
};
