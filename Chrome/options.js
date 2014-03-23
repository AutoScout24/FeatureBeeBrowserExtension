var saveButton = document.getElementById("saveButton");
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

FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function (response) {
    var environments = response.config.environments;

    for (var i = 0; i < environments.length; i++) {
        allEnvironmentsTextArea.value += environments[i].pattern + "\n";
    }
});