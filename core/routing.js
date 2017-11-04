"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fluency_injection_1 = require("fluency-injection");
var Routing = /** @class */ (function () {
    function Routing(routes, APP) {
        this.APP = APP;
        this.routes = routes;
        this.start();
    }
    Routing.prototype.start = function () {
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            var method = route.method.toLocaleLowerCase();
            var url = route.url;
            var page = fluency_injection_1.bootstrap(route.page);
            page.app = this.APP;
            this.APP.route(url)[method](page.callBack);
        }
    };
    return Routing;
}());
exports.Routing = Routing;
