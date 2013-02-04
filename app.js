(function() {
  var inputElement;
  var formElement;
  var ulElement;
  var drinkRowPrefix = 'drinkrow-';

  var lookupDrinksElement;
  var userFormElement;
  var userAddressElement;
  var userUlElement;
  var errorEl;

  // remoteStorage.util.setLogLevel('debug');

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

    userFormElement = document.getElementById('other-user');
    userAddressElement = userFormElement.getElementsByTagName('input')[0];
    userUlElement = document.getElementById('other-drink-list');

    lookupDrinksElement = document.getElementById('lookup-drinks');

    lookupDrinksElement.addEventListener('click', function() {
      var box = lookupDrinksElement.parentElement;
      if(box.getAttribute('class') === 'hidden') {
        box.removeAttribute('class');
      } else {
        box.setAttribute('class', 'hidden');
      }
    });

    userFormElement.addEventListener('submit', function(event) {
      event.preventDefault();
      var userAddress = userAddressElement.value;
      if(userAddress) {
        discoverOther(userAddress);
      } else {
        userUlElement.innerHTML = '';
      }
    });

    remoteStorage.claimAccess('myfavoritedrinks', 'rw').
      then(function() {
        remoteStorage.displayWidget('remotestorage-connect');

        remoteStorage.myfavoritedrinks.listDrinks().then(displayDrinks);

        remoteStorage.onWidget('disconnect', function() {
            emptyDrinks();
        });

        ulElement.addEventListener('click', function(event) {
          if(event.target.tagName === 'SPAN') {
            var drinkId = unprefixId(event.target.parentNode.id);
            var className = event.target.getAttribute('class').
              replace(/^\s+(.+)\s+$/, '$1');
            switch(className) {
            case 'share':
              shareDrink(drinkId);
              break;
            case 'shared':
              unshareDrink(drinkId);
              break;
            case 'delete':
              removeDrink(drinkId);
              break;
            }
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
            displayDrink(event.relativePath, event.newValue.name, event.newValue.shared);
          }
          // remove
          else if((! event.newValue) && event.oldValue) {
            undisplayDrink(event.relativePath);
          }
        });
      });

    var hashMatch = document.location.hash.match(/#!(.+@.+)$/)
    if(hashMatch) {
      var userAddress = hashMatch[1];
      userAddressElement.value = userAddress;
      lookupDrinksElement.parentElement.removeAttribute('class');
      discoverOther(userAddress);
    }
  }

  function shareDrink(drinkId) {
    remoteStorage.myfavoritedrinks.shareDrink(drinkId).
      then(function() {
        var elem = document.getElementById(prefixId(drinkId));
        var span = elem.getElementsByClassName('share')[0]
        if(span) {
          span.setAttribute('class', 'shared');
          span.innerHTML = 'shared';
        }
      });
  }

  function unshareDrink(drinkId) {
    remoteStorage.myfavoritedrinks.unshareDrink(drinkId).
      then(function() {
        var elem = document.getElementById(prefixId(drinkId));
        var span = elem.getElementsByClassName('shared')[0]
        if(span) {
          span.setAttribute('class', 'share');
          span.innerHTML = 'share';
        }
      });
  }
  
  function displayOtherDrink(drink) {
    var drinkLi = document.createElement('li');
    drinkLi.innerHTML = drink.replace(/</, '&lt').replace(/>/, '&gt');
    userUlElement.appendChild(drinkLi);
    remoteStorage.myfavoritedrinks.isFavorite(drink).
      then(function(value) {
        if(value) {
          drinkLi.setAttribute('class', 'own-favorite');
          drinkLi.setAttribute('title', 'You like this as well!');
        }
      });
  }

  function displayOtherDrinks(drinks) {
    if(drinks && drinks.length > 0) {
      userUlElement.innerHTML = '';
      drinks.forEach(displayOtherDrink);
    } else {
      userUlElement.innerHTML = "<em>No drinks published.</em>";
    }
  }

  function discoverOther(userAddress) {
    remoteStorage.getForeignClient(userAddress).
      then(function(client) {
        return client.getObject('myfavoritedrinks/list');
      }).
      then(displayOtherDrinks);
  }

  function addDrink(name) {
    remoteStorage.myfavoritedrinks.addDrink(name);
  }

  function removeDrink(id) {
    remoteStorage.myfavoritedrinks.removeDrink(id);
  }

  function displayDrinks(drinks) {
    var drink;
    for(var drinkId in drinks) {
      drink = drinks[drinkId];
      displayDrink(drinkId, drink.name, drink.shared);
    }    
  }

  function displayDrink(id, name, shared) {
    console.log("DISPLAY", id, name, shared);
    var domID = prefixId(id);
    var liElement = document.getElementById(domID);
    if(! liElement) {
      liElement = document.createElement('li');
      liElement.id = domID;
      ulElement.appendChild(liElement);
    }
    liElement.appendChild(document.createTextNode(name));//this will do some html escaping
    var shareState = (shared ? 'shared' : 'share');
    liElement.innerHTML += ' <span class=" ' + shareState + ' ">' + shareState  + '</span>';
    liElement.innerHTML += ' <span class="delete" title="Delete">×</span>';
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
