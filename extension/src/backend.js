var chrome = require('chrome-framework');
var Storage = require('./json-viewer/storage');

async function loadStorage(request) {
  var options = await Storage.load();
  return options;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.action === 'GET_OPTIONS') {
      loadStorage(request).then(function (options) {
        sendResponse({ err: null, value: options });
      });
      // return true to indicate you want to send a response asynchronously
      return true;
    }
  } catch (e) {
    console.error('[JSONViewer] error: ' + e.message, e);
    sendResponse({ err: e });
  }
});
