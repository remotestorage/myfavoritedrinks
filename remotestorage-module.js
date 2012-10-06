(function() {

	remoteStorage.defineModule('myfavouritedrinks', function(privateClient) {
		
		privateClient.sync('');
		
		return {
			exports: {
				
				on: function(eventName, callback) {
					var changeHandler;
					if(eventName === 'add') {
						changeHandler = function(event) {
							if(event.newValue && (! event.oldValue)) {
								callback(event);
							}
						};
					} else if(eventName === 'remove') {
						changeHandler = function(event) {
							if((! event.newValue) && event.oldValue) {
								callback(event);
							}
						};
					} else { throw "No!@!!!!!"; }
					privateClient.on('change', function(_event) {
						var event = {};
						for(var key in _event) {
							event[key] = _event[key];
						}
						event.id = event.path.match(/([^\/]+)$/)[1];
						changeHandler(event);
					});
				},
				
				addDrink: function(name) {
					var id = encodeURIComponent(name);
					privateClient.storeObject('drink', id, {
						name: name
					});
				},
				
				removeDrink: function(id) {
					privateClient.remove(id);
				},
				
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
