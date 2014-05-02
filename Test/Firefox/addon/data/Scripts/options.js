var saveButton = document.getElementById("saveButton");
var resetButton = document.getElementById("resetCache");
var allEnvironmentsTextArea = document.getElementById("allEnvironments");


saveButton.addEventListener('click', function () {
    var environmentRegexes = allEnvironmentsTextArea.value.split('\n');
    var environments = [];
    debugger;
    for (var i = 0; i < environmentRegexes.length; i++) {
        if (environmentRegexes[i] != "") {
            environments.push({ pattern: environmentRegexes[i] });
        }        
    }

    console.log(environments);
    FeatureBeeCommunicationEngine.tellChromeToUpdateEnvironments(environments);

    alert("Options successfully saved.");
});

resetButton.addEventListener('click', function() {
    if (confirm("Are you sure you want to reset featurebee extension configurations to default value?")) {
        FeatureBeeCommunicationEngine.tellChromeToClearMeTheCurrentConfiguration();
        alert("All settings were reset to default values.\nPlease RESTART your browser now.");
    }
});


FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function (response) {
    var environments = response.config.environments;

    for (var i = 0; i < environments.length; i++) {
        allEnvironmentsTextArea.value += environments[i].pattern + "\n";
    }
});