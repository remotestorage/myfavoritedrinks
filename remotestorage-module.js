remoteStorage.defineModule('myfavoritedrinks', function(privateClient, publicClient) {

  // Resolve a conflict where a drink is added that has also been added
  // in another instance of the app by always taking the local one.
  // Note: Usually it makes sense to have this behavior in the app code
  // but in this case the module can handle it itself as this automatic
  // resolution won't destroy any data.
  privateClient.on('conflict', function(event) {
    event.resolve('local');
  });

  return {
    exports: {

      on: privateClient.on,

      addDrink: function(name) {
        var id = name.toLowerCase().replace(/\s|\//g, '-');
        return privateClient.storeObject('drink', id, {
          name: name
        });
      },

      removeDrink: privateClient.remove,

      listDrinks: function() {
        return privateClient.getAll('');
      },

      updateShared: function(id, value) {
        return privateClient.getObject(id).
          then(function(drink) {
            if(drink) {
              if(drink.shared === value) {
                throw 'Drink already shared: ' + id + ' -> ' + drink.shared;
              } else {
                return publicClient.getObject('list').
                  then(function(shared) {
                    if(! shared) {
                      shared = [];
                    }
                    if(value) {
                      shared.push(drink.name);
                    } else {
                      var oldShared = shared;
                      shared = [];
                      oldShared.forEach(function(item) {
                        if(item !== drink.name) {
                          shared.push(item);
                        }
                      });
                    }
                    return publicClient.storeObject('drink-list', 'list', shared);
                  }).
                  then(function() {
                    drink.shared = value;
                    return privateClient.storeObject('drink', id, drink);
                  });
              }
            } else {
              throw 'No such drink: ' + id;
            }
          }.bind(this));
      },

      shareDrink: function(id) {
        return this.updateShared(id, true);
      },

      unshareDrink: function(id) {
        return this.updateShared(id, false);
      },

      isFavorite: function(name) {
        return this.listDrinks().
          then(function(drinks) {
            for(var id in drinks) {
              if(drinks[id].name === name) {
                return true;
              }
            }
            return false;
          });
      }

    }
  };

});
