var jsonFormatter = require('../jsl-format');
var JSONPath = require('jsonpath-plus');

function applyJsonPath(path, originalValue, highlighter, excludeHeader) {
  try {
    var text = originalValue;
    var header = "";
    if (excludeHeader) {
      var lines = text.split("\n");
      header = lines.splice(0, 3).join("\n");

      text = lines.join("\n");
    }

    var json = JSONPath.JSONPath({ path: path, json: JSON.parse(text) });
    var result = "";

    if (excludeHeader) {
      result = header + "\n";
    }
    result += jsonFormatter(JSON.stringify(json));

    highlighter.editor.setValue(result);
  } catch (e) { }
}

module.exports = applyJsonPath;
