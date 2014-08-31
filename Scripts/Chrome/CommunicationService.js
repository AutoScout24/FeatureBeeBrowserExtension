CommunicationService = {

    send : function(){

        chrome.tabs.executeScript({
            file: 'Scripts/Repository.js'
        });

        chrome.tabs.executeScript({
            file: 'Scripts/Presenter.js'
        });

    }
}