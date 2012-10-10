(function() {

	remoteStorage.defineModule('myfavoritedrinks', function(privateClient) {
		
		privateClient.use('');

    function idFromPath(path) {
      return path.split('/').slice(-1)[0];
    }
		
		return {
			exports: {
				
				on: privateClient.on,
				
				addDrink: function(name) {
					var id = encodeURIComponent(name);
					privateClient.storeObject('drink', id, {
						name: name
					});
				},
				
				removeDrink: privateClient.remove,
				
				listDrinks: function() {
          var _drinks = privateClient.getAll('');
          var drinks = {}
          for(var path in _drinks) {
            drinks[idFromPath(path)] = _drinks[path];
          }
          return drinks;
				},

        c: privateClient
				
			}
		};
	});

})();
