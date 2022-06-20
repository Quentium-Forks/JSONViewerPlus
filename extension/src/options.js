require('./options-styles');
var CodeMirror = require('codemirror');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/css-hint');
require('codemirror/mode/css/css');
var sweetAlert = require('sweetalert2');

var Storage = require('./json-viewer/storage');
var renderThemeList = require('./json-viewer/options/render-theme-list');
var renderAddons = require('./json-viewer/options/render-addons');
var renderStructure = require('./json-viewer/options/render-structure');
var renderStyle = require('./json-viewer/options/render-style');
var bindSaveButton = require('./json-viewer/options/bind-save-button');
var bindResetButton = require('./json-viewer/options/bind-reset-button');

function isValidJSON(pseudoJSON) {
  try {
    JSON.parse(pseudoJSON);
    return true;

  } catch (e) {
    return false;
  }
}

function clearShowSize(json) {
  return json.replace(/(Array|Object)\[\d+\]/gi, '');
}

function renderVersion() {
  var version = process.env.VERSION;
  var versionLink = document.getElementsByClassName('version')[0];
  versionLink.innerHTML = version;
  versionLink.href = 'https://github.com/QuentiumYT/JSONViewerPlus/tree/' + version;
}

function onLoaded() {
  Storage.load()
    .then(function (currentOptions) {
      renderVersion();
      renderThemeList(CodeMirror, currentOptions.theme);
      var addonsEditor = renderAddons(CodeMirror, currentOptions.addons);
      var structureEditor = renderStructure(CodeMirror, currentOptions.structure);
      var styleEditor = renderStyle(CodeMirror, currentOptions.style);

      bindResetButton();
      bindSaveButton([addonsEditor, structureEditor, styleEditor], function (options) {
        options.addons = clearShowSize(options.addons);
        options.structure = clearShowSize(options.structure);

        if (!isValidJSON(options.addons)) {
          new sweetAlert({
            title: "Ops!",
            text: "\"Add-ons\" isn't a valid JSON",
            icon: "error",
            timer: 2000,
          });

        } else if (!isValidJSON(options.structure)) {
          new sweetAlert({
            title: "Ops!",
            text: "\"Structure\" isn't a valid JSON",
            icon: "error",
            timer: 2000,
          });

        } else {
          Storage.save(options);
          new sweetAlert({
            title: "Saved!",
            text: "Your options have been saved",
            icon: "success",
            timer: 1500,
          });
        }
      });
    });
}

document.addEventListener('DOMContentLoaded', onLoaded, false);
