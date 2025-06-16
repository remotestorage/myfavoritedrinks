const MyFavoriteDrinks = {
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
          const id = `${new Date().getTime()}`;

          return privateClient.storeObject('drink', id, {
            name: name
          });
        },

        updateDrink: function(id, name) {
          return privateClient.storeObject('drink', id, {
            name: name
          });
        },

        removeDrink: privateClient.remove.bind(privateClient),

        getAllDrinks: function() {
          return privateClient.getAll('', false).then(drinks => {
            return Object.fromEntries(Object.entries(drinks).sort());
          });
        }
      }
    }
  }
};
