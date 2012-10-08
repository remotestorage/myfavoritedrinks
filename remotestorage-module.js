(function() {

	remoteStorage.defineModule('myfavoritedrinks', function(privateClient) {
		
		privateClient.use('');
		
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
					var idList = privateClient.getListing('');
					var result = {};
					idList.forEach(function(id) {
						result[id] = privateClient.getObject(id);
					});
					return result;
				}
				
			}
		};
	});

})();
