var sweetAlert = require('sweetalert2');
var defaults = require('./defaults');
var Storage = require('../storage');

function bindResetButton() {
  var button = document.getElementById("reset");
  button.onclick = function(e) {
    e.preventDefault();

    new sweetAlert({
      title: "Are you sure?",
      text: "You will not be able to recover your custom settings",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, reset!",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        var options = {};
        options.theme = defaults.theme;
        options.addons = JSON.stringify(defaults.addons);
        options.structure = JSON.stringify(defaults.structure);
        options.style = defaults.style;

        Storage.save(options);
        document.location.reload();
      }
    });
  };
}

module.exports = bindResetButton;
