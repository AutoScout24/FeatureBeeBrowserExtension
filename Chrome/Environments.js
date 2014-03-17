FeatureBeeToggleActiveEnviroments = {
    allEnviroments : [
        { name : "Autoscout24", pattern : new RegExp("(autoscout24.)")},
        { name : "AS24", pattern : new RegExp("(as24.)")},
        { name : "local", pattern : new RegExp("(.local)($|n*\/)")}
    ],

    isToggleActiveEnvironment: function (url) {
        for (var i in this.allEnviroments) {
            if (this.allEnviroments[i].pattern.test(url)) {
                return true;
            }
        }

        return false;
    }
};
