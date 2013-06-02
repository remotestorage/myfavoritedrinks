(function() {

  var moduleName = 'myfavoritedrinks';
  remoteStorage.defineModule(moduleName, function(privateClient, publicClient) {

    // Resolve a conflict where a drink is added that has also been added
    // in another instance of the app by always taking the local one.
    // Note: Usually it makes sense to have this behavior in the app code
    // but in this case the module can handle it itself as this automatic
    // resolution won't destroy any data.
    privateClient.on('conflict', function(event) {
      event.resolve('local');
    });

    function init() {
      privateClient.release('');
      publicClient.release('');
    }

    function getPrivateListing(listName) {
      privateClient.use(listName+'/');

      return {
        on: function on(eventType, cb) {
          privateClient.on(eventType, function (event) {
            if (event.path.substr(2+moduleName.length, listName.length) === listName) {
              cb(event);
            }
          });
        },

        addDrink: function(name) {
          var id = name.toLowerCase().replace(/\s|\//g, '-');
          return privateClient.storeObject('drink', listName+'/'+id, {
            name: name
          });
        },

        removeDrink: function (id) {
          privateClient.remove(listName+'/'+id);
        },

        listDrinks: function() {
          return privateClient.getAll(listName + '/');
        }
      };
    }
    return {
      moduleName: 'myfavoritedrinks',
      exports: {
        init: init,
        getPrivateListing: getPrivateListing
      }
    }

  });

})();
