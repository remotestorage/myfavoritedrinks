var inputElement;
var formElement;
var ulElement;

function init() {
	formElement = document.getElementById('add-drink');
	inputElement = formElement.getElementsByTagName('input')[0];
	ulElement = document.getElementById('drink-list');
	
	ulElement.addEventListener('click', function(event) {
		if(event.target.tagName === 'SPAN') {
			ulElement.removeChild(event.target.parentNode);
		}
	});
	
	formElement.addEventListener('submit', function(event) {
		event.preventDefault();
		addDrink(inputElement.value);
	});
}

function addDrink(drinkName) {
	var liElement = document.createElement('li');
	liElement.innerHTML = drinkName + ' <span>×</span>';
	ulElement.appendChild(liElement);
}

document.addEventListener('DOMContentLoaded', init);
