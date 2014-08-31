﻿var Presenter = function () {

    var _this = this;
    var $file = function (relPath) {
        return chrome.extension.getURL(relPath);
    }

    var extension = document.createElement('FeatureBeeExtension');
    extension.innerHTML = '<div class="uiblocker"></div><div class="content"></div>';
    document.body.insertBefore(extension, document.body.firstChild)
    document.body.innerHTML += '<link rel="stylesheet" type="text/css" href="' + $file('Styles/styles.css') + '">';

    var repository = new FeatureBeeToggleRepository();

    var $div = function (css) {
        var div = document.createElement("div");
        div.className = css || "";
        return div;
    }

    var $img = function (src, css) {
        var img = document.createElement("img");
        img.src = $file(src);
        img.className = css;
        return img;

    }

    var $$box = function (title) {
        var box = $div('box');
        var boxtitle = $div('boxtitle');
        var boxcontent = $div('boxcontent');

        boxtitle.innerText = title;

        box.appendChild(boxtitle);
        box.appendChild(boxcontent);
        return box;
    };

    this.view = {

        title: {
            build: function () {
                var obj = $div();
                obj.appendChild($img('Images/logo.png', 'title'));
                return obj;
            }
        },

        toggles: {
            buildMyToggles: function () {
                var box = $$box('My toggles');
                var boxContent = box.lastChild;

                var toggles = repository.retrieveMyToggles();

                for (var i = 0; i < toggles.length; i++) {
                    boxContent.appendChild(this.createToggle(toggles[i], true));
                }

                return box;
            },

            buildOtherAvailableToggles: function () {
                var box = $$box('Add an available toggle');
                var boxContent = box.lastChild;

                var toggles = repository.retrieveOtherAvailableToggles();

                for (var i = 0; i < toggles.length; i++) {
                    boxContent.appendChild(this.createToggle(toggles[i], false));
                }

                return box;
            },

            createToggle: function (toggle, isAddedToMyToggles) {
                var div = $div('toggleContainer');

                if (isAddedToMyToggles) {
                    var button = $div('toggleButton');
                    button.setAttribute('data-enabled', toggle.Enabled);
                    button.innerText = toggle.Enabled == "true" ? 'ON' : 'OFF';
                    button.addEventListener('click', function () {
                        repository.toggleToggleOnOff(toggle);
                        _this.view.refreshMainContentArea();
                    });
                    div.appendChild(button);
                } else {
                    var button = $div('toggleButton toggleButtonInactive');
                    button.innerText = toggle.Enabled ? 'ON' : 'OFF';
                    div.appendChild(button);
                }

                var name = $div('toggleName');
                name.innerText = toggle.Name;
                div.appendChild(name);

                var state = $div('toggleState');
                state.innerText = toggle.State;
                div.appendChild(state);

                var action;                
                if (isAddedToMyToggles) {
                    var actionForget = $div('toggleButton toggleActionButton');
                    actionForget.setAttribute('data-name', toggle.Name);
                    actionForget.innerText = "FORGET"
                    actionForget.addEventListener('click', function () {
                        repository.forgetToggle(toggle);
                        _this.view.refreshMainContentArea();
                    });
                    div.appendChild(actionForget);
                } else {
                    var actionAdd = $div('toggleButton toggleActionButton');
                    actionAdd.setAttribute('data-name', toggle.Name);
                    actionAdd.innerText = "ADD"
                    actionAdd.addEventListener('click', function () {
                        repository.addToggle(toggle);
                        _this.view.refreshMainContentArea();
                    });
                    div.appendChild(actionAdd);                    
                }
                
                return div;
            }
        },

        help: {
            build: function () {
                var box = $$box('How does it work?')
                var boxContent = box.lastChild;
                boxContent.innerHTML = "hilfe"
                return box;
            }
        },

        feedback: {
            build: function () {
                var box = $$box('Do you like it? Or not?');
                var boxContent = box.lastChild;
                boxContent.innerHTML = "feed"
                return box;
            }
        },

        refreshMainContentArea : function () {
            var refreshedMainContentArea = this.mainContentArea();
            var currentMainContentArea = document.querySelector("featurebeeextension .maincontentarea");
            currentMainContentArea.parentNode.replaceChild(refreshedMainContentArea, currentMainContentArea);
        },

        mainContentArea : function () {
            var maincontentarea = $div('maincontentarea');
            maincontentarea.appendChild(this.toggles.buildMyToggles());
            maincontentarea.appendChild(this.toggles.buildOtherAvailableToggles());
            return maincontentarea;
        },

        build: function () {
            var contentcontainer = document.querySelector('featurebeeextension .content');
            var maincontentarea = this.mainContentArea();
            var contentareaseparator = $div('contentareaseparator');
            var sidecontentarea = $div('sidecontentarea');

            contentcontainer.appendChild(this.title.build());

            contentcontainer.appendChild(maincontentarea);
            
            sidecontentarea.appendChild(this.help.build());
            sidecontentarea.appendChild(this.feedback.build());
            contentcontainer.appendChild(sidecontentarea);
        }
    };
};

var presenter = new Presenter();
presenter.view.build();