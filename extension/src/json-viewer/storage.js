var defaults = require('./options/defaults');
var merge = require('./merge');

module.exports = {
  save: async function (obj) {
    await chrome.storage.sync.set({ currentOptions: obj });
  },

  load: async function () {
    var p = new Promise(function (resolve, reject) {
      chrome.storage.sync.get('currentOptions', function (obj) {
        options = obj.currentOptions || {};
        options.theme = options.theme || defaults.theme;
        options.addons = options.addons ? JSON.parse(options.addons) : {};
        options.addons = merge({}, defaults.addons, options.addons);
        options.structure = options.structure ? JSON.parse(options.structure) : defaults.structure;
        options.style = options.style && options.style.length > 0 ? options.style : defaults.style;
        resolve(options);
      });
    });
    return p;
  }
};
