var saveButton = document.getElementById("saveButton");
var allEnviromentsTextArea = document.getElementById("allEnviroments");


saveButton.addEventListener('click', function () {
    var environmentRegexes = allEnviromentsTextArea.value.split('\n');
    var environments = [];

    for (var i = 0; i < environmentRegexes.length; i++) {
        environments.push({ pattern : new RegExp(environmentRegexes[i])});
    }

    console.log(environments);
    chrome.storage.local.set({ environments: environments });

});