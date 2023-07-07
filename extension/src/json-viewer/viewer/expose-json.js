function exposeJson(jsonObj) {
  console.info("[JSONViewer] Your json was stored into 'window.json', enjoy!");

  var actualCode = 'window.json = ' + JSON.stringify(jsonObj) + ';';

  document.documentElement.setAttribute('onreset', actualCode);
  document.documentElement.dispatchEvent(new CustomEvent('reset'));
  document.documentElement.removeAttribute('onreset');
}

module.exports = exposeJson;
