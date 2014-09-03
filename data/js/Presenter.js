﻿var Presenter = function () {

    var _this = this;
    var $file = function (relPath) {

        relPath = "data/" + relPath;

        try {
            return chrome.extension.getURL(relPath);
        } catch (e) { }
        
        return document.querySelector("script[src*=Presenter]").src.replace("data/js/", "").replace("Presenter.js", "") +relPath;
    }

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

    var $a = function(text, href){
        var a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    }

    var $$box = function (title) {
        var box = $div('box');
        var boxtitle = $div('boxtitle');
        var boxcontent = $div('boxcontent');

        boxtitle.textContent = title;

        box.appendChild(boxtitle);
        box.appendChild(boxcontent);
        return box;
    };

    var $$text = function (text) {
        var textBox = $div('text');
        textBox.innerHTML = text;
        return textBox;
    };

    this.view = {

        toggleViewState: function(){
            var me = document.querySelector('featurebeeextension');
            if (me) {
                me.parentNode.removeChild(me);
                var css = document.querySelector("link[origin=featureBeeExtension]");
                css.parentNode.removeChild(css);
            } else {
                this.build();
            }
        },

        title: {
            build: function () {
                var obj = $div('title');
                obj.appendChild($img('img/logo.png', 'titleImage'));

                var message = $div('messageContainer');
                this.displayMessage = function (messageDiv) {
                    if (message.firstChild) {
                        message.removeChild(message.firstChild);
                    }
                    
                    message.appendChild(messageDiv);
                }

                obj.appendChild(message);

                var close = $div('close');
                close.textContent = "x";
                close.addEventListener('click', function () {
                    _this.view.toggleViewState();
                });

                obj.appendChild(close);

                return obj;
            },

            displayMessage : function(){}
        },

        toggles: {
            buildMyToggles: function () {
                var box = $$box('My toggles');
                var boxContent = box.lastChild;

                var toggles = repository.retrieveMyToggles();

                if (!toggles || toggles.length == 0) {
                    boxContent.appendChild($$text('There are no toggles in your list'));
                    return box;
                }

                for (var i = 0; i < toggles.length; i++) {
                    boxContent.appendChild(this.createToggle(toggles[i], true));
                }

                return box;
            },

            buildOtherAvailableToggles: function () {
                var box = $$box('Available toggles');
                var boxContent = box.lastChild;
                var toggles = repository.retrieveOtherAvailableToggles();

                if (!toggles || toggles.length == 0) {
                    boxContent.appendChild($$text('There are no available toggles'));
                    return box;
                }

                boxContent.appendChild(this.buildFilter(boxContent));

                for (var i = 0; i < toggles.length; i++) {
                    boxContent.appendChild(this.createToggle(toggles[i], false));
                }

                return box;
            },

            buildFilter: function (boxToFilter) {
                var container = $div('filterContainer');
                var input = document.createElement('input');

                input.type = 'text';
                input.placeholder = ' Enter your filter criteria';
                input.className = 'inputFilter';
                input.addEventListener('keyup', function () {
                    var filterValue = input.value;
                    for (var i = 0; i < boxToFilter.childNodes.length; i++) {
                        var child = boxToFilter.childNodes[i];
                        var childValue = child.getAttribute('data-filter');
                        if (childValue && childValue != '') {
                            var matches = childValue.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
                            child.style.display = matches ? "block" : "none";
                        }
                    }
                });

                container.appendChild($$text("Filter:"));
                container.appendChild(input);
                return container;
            },

            createToggle: function (toggle, isAddedToMyToggles) {
                var div = $div('toggleContainer');

                div.setAttribute('data-filter', toggle.Name);

                if (isAddedToMyToggles) {
                    var button = $div('toggleButton');
                    button.setAttribute('data-enabled', toggle.Enabled);
                    button.textContent = toggle.Enabled == "true" ? 'ON' : 'OFF';

                    var onChangeMessage = $div('message');
                    onChangeMessage.innerHTML = 'You changed your toggle configuration. Please&nbsp' +
                                                 $a('reload', 'javascript:location.reload()').outerHTML +
                                                '&nbspyour page to make sure the changes will be displayed&nbsp.'
                    button.addEventListener('click', function () {
                        repository.toggleToggleOnOff(toggle);
                        _this.view.refreshMainContentArea();
                        _this.view.title.displayMessage(onChangeMessage);
                    });
                    div.appendChild(button);
                } else {
                    var button = $div('toggleButton toggleButtonInactive');
                    button.setAttribute('data-inactive-enabled', toggle.Enabled);
                    button.textContent = toggle.Enabled ? 'ON' : 'OFF';
                    div.appendChild(button);
                }

                var name = $div('toggleName');
                name.textContent = toggle.Name;
                div.appendChild(name);

                var state = $div('toggleState');
                state.textContent = toggle.State;
                state.setAttribute('data-hide-on-low-resolution', true);
                div.appendChild(state);

                var action;                
                if (isAddedToMyToggles) {
                    var actionForget = $div('toggleButton toggleActionButton');
                    actionForget.setAttribute('data-name', toggle.Name);
                    actionForget.textContent = "FORGET"
                    actionForget.addEventListener('click', function () {
                        repository.forgetToggle(toggle);
                        _this.view.refreshMainContentArea();
                    });
                    div.appendChild(actionForget);
                } else {
                    var actionAdd = $div('toggleButton toggleActionButton');
                    actionAdd.setAttribute('data-name', toggle.Name);
                    actionAdd.textContent = "ADD"
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
                boxContent.appendChild($img('img/help.png', 'help'));
                return box;
            }
        },

        feedback: {
            build: function () {
                var box = $$box('Do you like it? Or not?');
                var boxContent = box.lastChild;
                var textBox = document.createElement('textarea');
                var send = $div('toggleButton toggleActionButton');
                var title = $div();

                title.textContent = "Questions? Suggestions?";
                send.textContent = "SEND"
                textBox.className = "feedbackBox";
                textBox.rows = 6;

                send.addEventListener('click', function () {
                    window.location.href = "mailto:gthuller@autoscout24.com?subject=Feedback about FeatureBeeExtension&body=" + textBox.value;
                    boxContent.textContent = "Thank you for your feedback!";
                });

                boxContent.appendChild(title);
                boxContent.appendChild(textBox);
                boxContent.appendChild(send);
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

            var extension = document.createElement('FeatureBeeExtension');
            extension.innerHTML = '<div class="uiblocker"></div><div class="content"></div>';
            document.body.insertBefore(extension, document.body.firstChild)
            document.body.innerHTML += '<link rel="stylesheet" type="text/css" origin="featureBeeExtension" href="' + $file('css/styles.css') + '">';

            var contentcontainer = document.querySelector('featurebeeextension .content');
            var maincontentarea = this.mainContentArea();
            var contentareaseparator = $div('contentareaseparator');
            var sidecontentarea = $div('sidecontentarea');

            contentcontainer.appendChild(this.title.build());

            contentcontainer.appendChild(maincontentarea);
            
            sidecontentarea.appendChild(this.help.build());
            sidecontentarea.appendChild(this.feedback.build());
            contentcontainer.appendChild(sidecontentarea);

            window.scrollTo(0, 0);
        }
    };
};

var presenter = new Presenter();
presenter.view.toggleViewState();