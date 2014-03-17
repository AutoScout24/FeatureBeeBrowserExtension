FeatureBeeToggleBar = new function () {

    var barId = 'featurebeeToggleBarId';    

    this.reload = function() {
        this.removeBar();
        this.show();
    };

    this.show = function () {
        
        FeatureBeeToggleRepository.retrieveCurrentToggles(function (toggles) {
            var bar = createBar();

            var filteredToggles = [];

            for (var a in toggles) {
                if (toggles[a].isActive) {
                    filteredToggles.push(toggles[a]);
                }
            }

            console.log("Actives:");
            console.log(filteredToggles);

            if (filteredToggles.length == 0) {
                var noToggle = document.createElement('div');
                noToggle.className = "toggle-bar-toggle-name";
                noToggle.innerText = "There's Toggle On for you right now";
                bar.appendChild(noToggle);
            } else {
                for (var i in filteredToggles) {
                    addActiveToggle(filteredToggles[i].name, bar);
                }
            }

            document.body.style.marginTop = bar.style.height;
            document.body.appendChild(bar);
            

            FeatureBeeTogglesExtensionStorage.setToogleBarOn();
        });        
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
        var container = document.createElement('div');
        container.id = barId;
        container.className = "toggle-bar-container";
        container.style.height = '30px';

        container.appendChild(createHeader());
        return container;
    };

    function addActiveToggle(name, bar) {
        var toggleContainer = document.createElement('div');
        toggleContainer.className = "toggle-bar-toggle-container";
        
        var toggleNameSpan = document.createElement('div');
        toggleNameSpan.className = "toggle-bar-toggle-name";
        toggleNameSpan.innerText = name;

        var toggleTickSpan = document.createElement('div');
        toggleTickSpan.className = "toggle-bar-tick";
        toggleTickSpan.innerHTML = "&#10003;";

        toggleTickSpan.appendChild(toggleNameSpan);
        toggleContainer.appendChild(toggleTickSpan);
        bar.appendChild(toggleContainer);
    }

    function createHeader() {
        var headerContainer = document.createElement('div');
        headerContainer.style.display = 'inline-block';
        headerContainer.style.width = "170px";

        var headerImage = document.createElement('div');
        headerImage.className = "toggle-bar-img-header";

        var headerTitle = document.createElement('div');
        headerTitle.className = "toggle-bar-header_title";
        headerTitle.innerText = "Feature Bee   | ";

        headerImage.appendChild(headerTitle);
        headerContainer.appendChild(headerImage);

        return headerContainer;
    }
};