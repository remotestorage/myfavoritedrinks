(function() {

	remoteStorage.defineModule('myfavoritedrinks', function(privateClient) {
		
		privateClient.use('');
		
		return {
			exports: {
				
				on: privateClient.on,
				
				addDrink: function(name) {
					var id = name.toLowerCase().replace(/\s/g, '-');
					privateClient.storeObject('drink', id, {
						name: name
					});
				},
				
				removeDrink: privateClient.remove,
				
				listDrinks: function() {
					return privateClient.getAll('');
				}
				
			}
		};
	});

})();
