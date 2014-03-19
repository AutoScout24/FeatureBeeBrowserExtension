FeatureBeeToggleBar = new function () {

    var barId = 'featurebeeToggleBarId';    

    this.reload = function() {
        this.removeBar();
        this.show();
    };

    this.show = function () {

        var toggles = FeatureBeeToggleRepository.retrieveCurrentActiveToggles();
        var bar = createBar();

        console.log("Actives:");
        console.log(toggles);

        if (toggles.length == 0) {
            addToggle("No toggles are on in your browser", bar, "none");
        } else {
            for (var i in toggles) {
                addToggle(toggles[i].Name, bar);
            }
        }

        document.body.style.marginTop = bar.style.height;
        document.body.appendChild(bar);
            

        FeatureBeeTogglesExtensionStorage.setToogleBarOn();
    };

    this.hide = function () {
        this.removeBar();
        document.body.style.marginTop = '0px';
        FeatureBeeTogglesExtensionStorage.setToogleBarOff();
    };

    this.removeBar = function() {
        var activeBar = document.getElementById(barId);
        while (activeBar) {
            activeBar.parentNode.removeChild(activeBar);
            activeBar = document.getElementById(barId);
        }
    };
    
    function createBar() {
        var container = document.createElement('ul');
        container.id = barId;
        container.className = "toggle-bar-container";
        container.style.height = '30px';

        container.appendChild(createHeader());
        return container;
    };

    function addToggle(name, bar, icon) {
        var toggleIcon;

        switch (icon) {
            case "none":
                toggleIcon = "";
                break;
            default:
                toggleIcon = "&#10003;";
        }
       
        var toggleContainer = document.createElement('li');
        toggleContainer.className = "toggle-bar-toggle-container";
        
        var toggleNameSpan = document.createElement('span');
        toggleNameSpan.className = "toggle-bar-toggle-name";
        toggleNameSpan.innerText = name;

        var toggleTickSpan = document.createElement('span');
        toggleTickSpan.className = "toggle-bar-tick";
        toggleTickSpan.innerHTML = toggleIcon;

        toggleTickSpan.appendChild(toggleNameSpan);
        toggleContainer.appendChild(toggleTickSpan);
        bar.appendChild(toggleContainer);
    }

    function createHeader() {
        var headerContainer = document.createElement('li');
        headerContainer.style.display = 'inline-block';
        headerContainer.style.width = "170px";

        var headerImage = document.createElement('span');
        headerImage.className = "toggle-bar-img-header";

        var headerTitle = document.createElement('span');
        headerTitle.className = "toggle-bar-header_title";
        headerTitle.innerText = "Feature Bee   | ";

        headerImage.appendChild(headerTitle);
        headerContainer.appendChild(headerImage);

        return headerContainer;
    }
};