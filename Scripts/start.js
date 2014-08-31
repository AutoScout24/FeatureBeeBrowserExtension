
(function () {
    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function (result) {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            CommunicationService.send(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", "/Scripts/Presenter.js", true);
    xmlHttp.send(null);
}());