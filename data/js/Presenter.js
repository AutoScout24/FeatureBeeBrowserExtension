var Presenter = function () {

    var _this = this;
    _this.lastFilterValue = '';
    
    var $file = function (relPath) {
        relPath = "data/" + relPath;
        return FeatureBeeClientInterface.getExtensionPath(relPath);
    };

    var repository = new FeatureBeeToggleRepository();

    var $div = function(css) {
        var div = document.createElement("div");
        div.className = css || "";
        return div;
    };

    var $img = function(src, css) {
        var img = document.createElement("img");
        img.src = $file(src);
        img.className = css;
        return img;
    };

    var $a = function(text, href) {
        var a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    };

    var $$box = function (title) {
        var box = $div('box');
        var boxtitle = $div('boxtitle');
        var boxcontent = $div('boxcontent');

        boxtitle.textContent = title;

        box.appendChild(boxtitle);
        box.appendChild(boxcontent);
        return box;
    };

    var $$writeText = function (node, text) {
        var textNode = document.createTextNode(text);
        node.appendChild(textNode);
    };

    var $$text = function (text) {
        var textBox = $div('text');
        textBox.textContent = text;
        return textBox;
    };

    function filterValues(boxToFilter, filterValue) {
        for (var i = 0; i < boxToFilter.childNodes.length; i++) {
            var child = boxToFilter.childNodes[i];
            var childValue = child.getAttribute('data-filter');
            if (childValue && childValue != '') {
                var matches = childValue.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
                child.style.display = matches ? "block" : "none";
            }
        }
    }

    this.init = function() {
// ReSharper disable UnusedLocals
        repository.init(function afterInit() {
// ReSharper restore UnusedLocals
            _this.view.toggleViewState();
        });
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
                this.displayMessage = function(messageDiv) {
                    if (message.firstChild) {
                        message.removeChild(message.firstChild);
                    }

                    message.appendChild(messageDiv);
                };

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

                filterValues(boxContent, _this.lastFilterValue);
                
                return box;
            },

            buildFilter: function (boxToFilter) {
                var container = $div('filterContainer');
                var input = document.createElement('input');

                input.type = 'text';
                input.placeholder = ' Enter your filter criteria';
                input.className = 'inputFilter';
                input.value = _this.lastFilterValue || '';
                input.addEventListener('keyup', function () {
                    var filterValue = input.value;
                    _this.lastFilterValue = filterValue;
                    filterValues(boxToFilter, filterValue);
                });

                container.appendChild($$text("Filter:"));
                container.appendChild(input);

                return container;
            },

            createToggle: function (toggle, isAddedToMyToggles) {
                var div = $div('toggleContainer');

                div.setAttribute('data-filter', toggle.Name);

                var button;
                if (isAddedToMyToggles) {
                    button = $div('toggleButton');
                    button.setAttribute('data-enabled', toggle.Enabled);
                    button.textContent = toggle.Enabled == "true" ? 'ON' : 'OFF';

                    var onChangeMessage = $div('message');
                    $$writeText(onChangeMessage, 'You changed your toggle configuration. Please ');
                    onChangeMessage.appendChild($a('reload', 'javascript:location.reload()'));
                    $$writeText(onChangeMessage, ' your page to make sure the changes will be displayed.');

                    button.addEventListener('click', function () {
                        repository.toggleToggleOnOff(toggle);
                        _this.view.refreshMainContentArea();
                        _this.view.title.displayMessage(onChangeMessage);
                    });
                    div.appendChild(button);
                } else {
                    button = $div('toggleButton toggleButtonInactive');
                    button.setAttribute('data-inactive-enabled', toggle.Enabled);
                    button.textContent = toggle.Enabled ? 'ON' : 'OFF';
                    div.appendChild(button);
                }

                var name = $div('toggleName');
                name.textContent = toggle.Name;
                name.addEventListener('contextmenu', function (e) {
                    _this.view.toggles.displayToggleContextMenu(toggle, e.pageX, e.pageY);
                    e.preventDefault();
                }, false);

                div.appendChild(name);

                var state = $div('toggleState');
                state.textContent = toggle.State;
                state.setAttribute('data-hide-on-low-resolution', true);
                div.appendChild(state);

                if (isAddedToMyToggles) {
                    var actionForget = $div('toggleButton toggleActionButton');
                    actionForget.setAttribute('data-name', toggle.Name);
                    actionForget.textContent = "FORGET";
                    actionForget.addEventListener('click', function () {
                        repository.forgetToggle(toggle);
                        _this.view.refreshMainContentArea();
                    });
                    div.appendChild(actionForget);
                } else {
                    var actionAdd = $div('toggleButton toggleActionButton');
                    actionAdd.setAttribute('data-name', toggle.Name);
                    actionAdd.textContent = "ADD";
                    actionAdd.addEventListener('click', function () {
                        repository.addToggle(toggle);
                        _this.view.refreshMainContentArea();
                    });
                    div.appendChild(actionAdd);
                }
                
                return div;
            },

            displayToggleContextMenu: function (toggle, left, top) {
                var actionContainer = $div("toggleActionContainer");
                var copyTextAction = $div("toggleActionItem");
                var copyCodeAction = $div("toggleActionItem");
                var featureBeeContainer = document.querySelector('featurebeeextension');

                var close = function() {
                    featureBeeContainer.removeChild(actionContainer);
                };

                actionContainer.style.left = (left - 20) + "px";
                actionContainer.style.top = (top - 20) + "px";

                $$writeText(copyTextAction, 'Copy toggle name');
                copyTextAction.addEventListener('click', function () {
                    FeatureBeeClientInterface.sendCommand('copy', toggle.Name);
                    close();
                });

                $$writeText(copyCodeAction, 'Copy toggle C# code');
                copyCodeAction.addEventListener('click', function () {
                    FeatureBeeClientInterface.sendCommand('copy', "if (Feature.IsEnabled(\"" + toggle.Name + "\")) {}");
                    close();
                });

                actionContainer.addEventListener('mouseleave', function () {
                    close();
                });

                actionContainer.addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                }, false);

                actionContainer.appendChild(copyTextAction);
                actionContainer.appendChild(copyCodeAction);
                featureBeeContainer.appendChild(actionContainer);
            }
        },

        actions: {

            create:function(label, imgPath, actionDelegate){
                var actionButton = $div("toggleButton actionButton");
                actionButton.appendChild($img(imgPath, 'actionButtonImage'));
                actionButton.appendChild($$text(label));

                actionButton.addEventListener('click', function () {
                    actionDelegate();
                });

                return actionButton;
            },

            contentDisplayArea: function () {
                var cont = $div('box boxcontent actionContentDisplayArea');
                cont.setAttribute('data-action-content', '');
                return cont;
            },

            build: function(){
                var actionContainer = $div('actionContainer');
                var exportButton = this.create("Export Current Configuration", 'img/bt_export.png', _this.view.actions.export);
                var openSmartphoneButton = this.create("Open in Smartphone", 'img/bt_smartphone.png', _this.view.actions.openSmartphone);

                actionContainer.appendChild(exportButton);
                actionContainer.appendChild(openSmartphoneButton);

                return actionContainer;
            },

            setContent: function (title, explanation, divContent) {
                var cont = document.querySelector('featurebeeextension [data-action-content]');                
                
                while (cont.firstChild) {
                    cont.removeChild(cont.firstChild);
                }

                var titleObj = $div('actionContentTitle');
                titleObj.textContent = title;

                var explanationObj = $div('actionContentText');
                explanationObj.textContent = explanation;

                var ps = $div('actionPs');
                ps.textContent = 'PS: This feature requires at least FeatureBeeClient version 0.2.0-CI2086';

                cont.appendChild(titleObj);
                cont.appendChild(explanationObj);
                cont.appendChild(divContent);
                cont.appendChild(ps);
            },

            getLink: function () {
                return window.location.href + (window.location.href.indexOf('?') < 0 ? '?' : '&') + 'FeatureBee=' + repository.getFeatureBeeCookieValue() + '&FB_persist=true';
            },

            'export': function () {
                var link = _this.view.actions.getLink();
                var linkObj = $a(link, link);
                linkObj.className = 'actionContentLink';

                _this.view.actions.setContent('▶ Export Current Configuration', 'Copy and paste this url into the destination browser:', linkObj);
            },

            openSmartphone: function () {
                var link = _this.view.actions.getLink();
                var img = document.createElement("img");
                img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(link);
                var div = $div();
                div.appendChild(img);

                _this.view.actions.setContent('▶ Open Current URL in Smartphone', 'Scan the following QR-Code to access the current URL using the current toggle configuration:', div);
            },
        },

        help: {
            build: function () {
                var box = $$box('How does it work?');
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
                send.textContent = "SEND";
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
            maincontentarea.appendChild(this.actions.build());
            maincontentarea.appendChild(this.actions.contentDisplayArea());
            maincontentarea.appendChild(this.toggles.buildMyToggles());            
            maincontentarea.appendChild(this.toggles.buildOtherAvailableToggles());
            return maincontentarea;
        },

        build: function () {

            var cssLink = document.createElement('link');
            cssLink.rel = "stylesheet";
            cssLink.type = "text/css";
            cssLink.setAttribute('origin', "featureBeeExtension");
            cssLink.href = $file('css/styles.css');
            document.getElementsByTagName('head')[0].appendChild(cssLink);

            var extension = document.createElement('FeatureBeeExtension');
            extension.appendChild($div("uiblocker"));
            extension.appendChild($div("content"));
            document.body.insertBefore(extension, document.body.firstChild);

            var contentcontainer = document.querySelector('featurebeeextension .content');
            var maincontentarea = this.mainContentArea();
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
presenter.init();