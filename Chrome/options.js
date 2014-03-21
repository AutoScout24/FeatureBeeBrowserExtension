var saveButton = document.getElementById("saveButton");
var allEnviromentsTextArea = document.getElementById("allEnviroments");


saveButton.addEventListener('click', function () {
    var environmentRegexes = allEnviromentsTextArea.value.split('\n');
    var environments = [];

    for (var i = 0; i < environmentRegexes.length; i++) {
        if (environmentRegexes[i] != "") {
            environments.push({ pattern: environmentRegexes[i] });
        }        
    }

    console.log(environments);    
    chrome.runtime.sendMessage({ msg : "updateCurrentEnvironments", updatedEnvironments: environments });

    alert("Options successfully saved.");
});

chrome.storage.local.get(null, function (value) {
    console.log(value.environments);
    for (var i = 0; i < value.environments.length; i++) {
        allEnviromentsTextArea.value += value.environments[i].pattern + "\n";
    }
});