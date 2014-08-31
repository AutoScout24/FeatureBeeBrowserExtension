$ = function(selector) {
    return document.querySelector(selector);
};

$each = function (selector, delegate) {
    var list = document.querySelectorAll(selector);

    for (var i = 0; i < list.length; i++) {
        delegate(list[i]);
    }
};

$setData = function (selector, prop, value) {    
    var target = typeof selector == "string"
                    ? $(selector)
                    : selector;

    target.setAttribute('data-' + prop, value);
};

$activate = function(selector) {
    $setData(selector, "active", true);
};

$deactivate = function(selector) {
    $setData(selector, "active", false);
};

$showContent = function(selector) {
    $each(".content", function(obj) {
        console.log(obj);
        obj.setAttribute('data-active', false);
    });
    $setData(selector, 'active', true);
};

$writeIn = function(selector, text) {
    $(selector).innerText = text;
}