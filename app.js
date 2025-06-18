(function() {
  let inputElement;
  let formElement;
  let ulElement;
  const itemPrefix = 'item-';

  const remoteStorage = new RemoteStorage({
    logging: true,
    changeEvents: { local: true, window: true, remote: true, conflict: true },
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

    remoteStorage.myfavoritedrinks.on('change', (event) => {
      if (typeof event.newValue === 'object' && typeof event.oldValue !== 'object') {
        console.log('Change from '+event.origin+' (add)', event);
        displayDrink(event.relativePath, event.newValue.name);
      }
      else if (typeof event.newValue !== 'object' && typeof event.oldValue === 'object') {
        console.log('Change from '+event.origin+' (remove)', event);
        undisplayDrink(event.relativePath);
      }
      else if (typeof event.newValue === 'object' && typeof event.oldValue === 'object') {
        console.log('Change from '+event.origin+' (change)', event);
        if (event.origin !== 'conflict' || (event.oldValue.name === event.newValue.name)) {
          renderDrinks();
        } else {
          const name = `${event.oldValue.name} / ${event.newValue.name} (was ${event.lastCommonValue.name})`;
          updateDrink(event.relativePath, name).then(renderDrinks);
        }
      } else {
        console.log('Change from '+event.origin+'', event);
      }
    });

    remoteStorage.on('ready', function() {
      ulElement.addEventListener('click', function(event) {
        if (
          event.target.tagName === 'BUTTON' &&
          event.target.classList.contains('delete')
        ) {
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

  function updateDrink(id, name) {
    return remoteStorage.myfavoritedrinks.updateDrink(id, name);
  }

  function removeDrink(id) {
    remoteStorage.myfavoritedrinks.removeDrink(id);
  }

  function renderDrinks() {
    remoteStorage.myfavoritedrinks.getAllDrinks().then(drinks => {
      displayDrinks(drinks);
    });
  }

  function displayDrinks(drinks) {
    ulElement.innerHTML = '';
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
    liElement.innerHTML += `
      <input type="text" value="${name}" placeholder="Drink name">
      <button class="save" title="Save">Save</button>
      <button class="delete" title="Delete">×</button>
    `;
    const saveButton = liElement.querySelector('button.save');
    const inputEl = liElement.querySelector('input');
    inputEl.addEventListener("focus", () => {
      saveButton.style.visibility = 'visible';
    });
    inputEl.addEventListener("blur", () => {
      setTimeout(() => {
        saveButton.style.visibility = 'hidden';
      }, 100)
    });
    inputEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        updateDrink(id, inputEl.value);
      }
    });
    saveButton.addEventListener("click", () => {
      updateDrink(unprefixId(domID), inputEl.value);
    });
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
