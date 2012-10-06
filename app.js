(function() {
	var inputElement;
	var formElement;
	var ulElement;
	var drinkRowPrefix = 'drinkrow-';

	function prefixId(id) {
		return drinkRowPrefix + id;
	}
	function unprefixId(prefixedId) {
		return prefixedId.replace(drinkRowPrefix, '');
	}

	function init() {
		formElement = document.getElementById('add-drink');
		inputElement = formElement.getElementsByTagName('input')[0];
		ulElement = document.getElementById('drink-list');

		remoteStorage.claimAccess('myfavouritedrinks', 'rw');
		remoteStorage.displayWidget('remotestorage-connect');

		var drinks = remoteStorage.myfavouritedrinks.listDrinks();
		for(var drinkId in drinks) {
			displayDrink(drinkId, drinks[drinkId].name);
		}

		remoteStorage.onWidget('state', function(state) {
			if(state === 'disconnected') {
				emptyDrinks();
			}
		});

		ulElement.addEventListener('click', function(event) {
			if(event.target.tagName === 'SPAN') {
				removeDrink(unprefixId(event.target.parentNode.id));
			}
		});

		formElement.addEventListener('submit', function(event) {
			event.preventDefault();
			addDrink(inputElement.value);
			inputElement.value = '';
		});

		remoteStorage.myfavouritedrinks.on('add', function(event) {
			displayDrink(event.id, event.newValue.name);
		});
		remoteStorage.myfavouritedrinks.on('remove', function(event) {
			undisplayDrink(event.id);
		});
	}

	function addDrink(name) {
		remoteStorage.myfavouritedrinks.addDrink(name);
	}

	function removeDrink(id) {
		remoteStorage.myfavouritedrinks.removeDrink(id);
	}

	function displayDrink(id, name) {
		var liElement = document.createElement('li');
		liElement.id = prefixId(id);
		liElement.innerHTML = name + ' <span>×</span>';
		ulElement.appendChild(liElement);
	}

	function undisplayDrink(id) {
		var elem = document.getElementById(prefixId(id));
		ulElement.removeChild(elem);
	}

	function emptyDrinks() {
		ulElement.innerHTML = '';
		inputElement.value = '';
	}

	document.addEventListener('DOMContentLoaded', init);

})();
