(function() {
  var inputElement;
  var formElement;
  var ulElement;
  var drinkRowPrefix = 'drinkrow-';

  //remoteStorage.util.setLogLevel('debug');

  // remoteStorage.util.silenceAllLoggers();

  // remoteStorage.util.unsilenceLogger('sync', 'store');

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

    remoteStorage.claimAccess('myfavoritedrinks', 'rw');
    remoteStorage.displayWidget();
    remoteStorage.on('features-loaded', function(){  

      //remoteStorage.myfavoritedrinks.listDrinks().then(displayDrinks);
      
      remoteStorage.on('disconnect', function() {
        emptyDrinks();
      });

      ulElement.addEventListener('click', function(event) {
        if(event.target.tagName === 'SPAN') {
          removeDrink(unprefixId(event.target.parentNode.id));
        }
      });
      
      formElement.addEventListener('submit', function(event) {
        event.preventDefault();
        var trimmedText = inputElement.value.trim();
        if(trimmedText) {
          addDrink(trimmedText);
        }
        inputElement.value = '';
      });
      
      remoteStorage.myfavoritedrinks.on('change', function(event) {
        // add
        if(event.newValue && (! event.oldValue)) {
          displayDrink(event.relativePath, event.newValue.name);
        }
        // remove
        else if((! event.newValue) && event.oldValue) {
          undisplayDrink(event.relativePath);
        }
      });
    });
  }

  function addDrink(name) {
    remoteStorage.myfavoritedrinks.addDrink(name);
  }

  function removeDrink(id) {
    console.log(id,typeof(id),JSON.stringify(id));
    remoteStorage.myfavoritedrinks.removeDrink(id);
  }

  function displayDrinks(drinks) {
    for(var drinkId in drinks) {
      displayDrink(drinkId, drinks[drinkId].name);
    }    
  }

  function displayDrink(id, name) {
    var domID = prefixId(id);
    var liElement = document.getElementById(domID);
    if(! liElement) {
      liElement = document.createElement('li');
      liElement.id = domID;
      ulElement.appendChild(liElement);
    }
    liElement.appendChild(document.createTextNode(name));//this will do some html escaping
    liElement.innerHTML += ' <span title="Delete">×</span>';
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
