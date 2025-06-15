(function() {
  let inputElement;
  let formElement;
  let ulElement;
  const itemPrefix = 'item-';

  const remoteStorage = new RemoteStorage({
    // logging: true,
    changeEvents: { local: true, window: true, remote: true, conflicts: true },
    modules: [MyFavoriteDrinks]
  });

  // Claim read/write access for the /myfavoritedrinks category
  remoteStorage.access.claim('myfavoritedrinks', 'rw');

  // Add RemoteStorage and BaseClient instances to window for easy console
  // access
  window.remoteStorage = remoteStorage;
  window.baseClient    = remoteStorage.scope("/myfavoritedrinks/")

  function prefixId(id) {
    return itemPrefix + id;
  }
  function unprefixId(prefixedId) {
    return prefixedId.replace(itemPrefix, '');
  }

  function init() {
    formElement = document.getElementById('add-drink');
    inputElement = formElement.getElementsByTagName('input')[0];
    ulElement = document.getElementById('drink-list');

    // Display the RS connect widget
    const widget = new Widget(remoteStorage);
    widget.attach('widget-wrapper');

    // Enable caching
    remoteStorage.myfavoritedrinks.init();

    remoteStorage.myfavoritedrinks.on('change', function(event) {
      if (event.newValue !== undefined && event.oldValue === undefined) {
        console.log('Change from '+event.origin+' (add)', event);
        displayDrink(event.relativePath, event.newValue.name);
      }
      else if (event.newValue === undefined && event.oldValue !== undefined) {
        console.log('Change from '+event.origin+' (remove)', event);
        undisplayDrink(event.relativePath);
      }
      else if (event.newValue !== undefined && event.oldValue !== undefined) {
        console.log('Change from '+event.origin+' (change)', event);
        undisplayDrink(event.relativePath);
        displayDrink(event.relativePath, event.newValue.name);
      }
    });

    remoteStorage.on('ready', function() {
      ulElement.addEventListener('click', function(event) {
        if(event.target.tagName === 'SPAN') {
          removeDrink(unprefixId(event.target.parentNode.id));
        }
      });

      formElement.addEventListener('submit', function(event) {
        event.preventDefault();
        const trimmedText = inputElement.value.trim();
        if (trimmedText) {
          addDrink(trimmedText);
        }
        inputElement.value = '';
      });
    });

    remoteStorage.on('disconnected', function() {
      emptyDrinks();
    });
  }

  function addDrink(name) {
    remoteStorage.myfavoritedrinks.addDrink(name);
  }

  function removeDrink(id) {
    remoteStorage.myfavoritedrinks.removeDrink(id);
  }

  // Currently not used
  function displayDrinks(drinks) {
    for (const drinkId in drinks) {
      displayDrink(drinkId, drinks[drinkId].name);
    }
  }

  function displayDrink(id, name) {
    const domID = prefixId(id);
    let liElement = document.getElementById(domID);
    if (!liElement) {
      liElement = document.createElement('li');
      liElement.id = domID;
      ulElement.appendChild(liElement);
    }
    liElement.appendChild(document.createTextNode(name));//this will do some html escaping
    liElement.innerHTML += ' <span title="Delete">×</span>';
  }

  function undisplayDrink(id) {
    const elem = document.getElementById(prefixId(id));
    ulElement.removeChild(elem);
  }

  function emptyDrinks() {
    ulElement.innerHTML = '';
    inputElement.value = '';
  }

  document.addEventListener('DOMContentLoaded', init);

})();
