/**
 * Proxies the Storage API to allow str-to-JSON API
 * @param  {Storage} storage An valid implementation of storage (storage.localStorage)
 * @return {Proxy}           The resultant proxy object
 */
function JsonStorage(storage) {
  return new Proxy({}, {
    get(target, key) {
        try {
          return JSON.parse(storage[key]);
        } catch (e) { }
    },
    set(target, key, value) {
      try {
        storage[key] = JSON.stringify(value);
        return true;
      } catch (e) {
        return false;
      }
    },
    has(target, key) {
      return key in storage;
    },
    deleteProperty(target, key) {
      return delete storage[key];
    },
    ownKeys(target) {
      return Object.keys(storage);
    }
  });
}

/**
 * The App module acts a singlton that manages the application 'screen' and storage 
 */
export const app = {
  set screen(value) { document.body.child = value; },
  storage: JsonStorage(window.localStorage)
}