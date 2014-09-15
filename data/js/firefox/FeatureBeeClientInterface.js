FeatureBeeClientInterface = {

    getExtensionPath: function (subpath) {
        return document.querySelector("script[src*=Presenter]").src.replace("data/js/", "").replace("Presenter.js", "") + subpath;
    },
    
    sendCommand : function(command) {
        alert('Sorry.' + command + ' is not implemented yet');
    }
}