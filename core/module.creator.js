"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routing_1 = require("./routing");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var appMain = express();
appMain.use(bodyParser.json());
var AllPages = [];
function useCorsOption(whitelist) {
    return {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    };
}
function AppModuleCreator(module) {
    // Error when Page imported twice or in two module
    for (var _i = 0, _a = module.pagesRoute; _i < _a.length; _i++) {
        var newPage = _a[_i];
        for (var _b = 0, AllPages_1 = AllPages; _b < AllPages_1.length; _b++) {
            var page = AllPages_1[_b];
            if (page.name == newPage.name) {
                throw new Error("Page imported twice or in two module");
            }
        }
        AllPages.push(newPage);
    }
    // ===========================================================================
    // error when Page in Routing is missing in "pagesRoute"
    for (var _c = 0, _d = module.routing; _c < _d.length; _c++) {
        var routing = _d[_c];
        var isGood = false;
        for (var _e = 0, _f = module.pagesRoute; _e < _f.length; _e++) {
            var page = _f[_e];
            if (routing.page.name == page.name) {
                isGood = true;
            }
        }
        if (!isGood)
            throw new Error('Page in Routing is missing in "pagesRoute"');
        // console.log(routing.page.name)
    }
    // ===================================================================================
    if (module.routing && module.routing.length) {
        if (!module.childUrl) {
            // start main module ===================================================================
            if (module.corsWhiteList && module.corsWhiteList.length > 0) {
                appMain.use(cors(useCorsOption(module.corsWhiteList)));
            }
            else {
                appMain.use(cors());
            }
            appMain.listen(process.env.PORT || 8080, function () {
                console.log(process.env.PORT || 'server start 8080');
            });
            new routing_1.Routing(module.routing, appMain);
        }
        else {
            // start children module ===================================================================
            // console.log(module, 'children');
            var appChild = express();
            if (module.corsWhiteList && module.corsWhiteList.length > 0) {
                appChild.use(cors(useCorsOption(module.corsWhiteList)));
            }
            else {
                appChild.use(cors());
            }
            appChild.use(bodyParser.json());
            appMain.use(module.childUrl, appChild);
            new routing_1.Routing(module.routing, appChild);
        }
    }
    else {
        throw new Error('Routing is empty');
    }
    return function (target) {
    };
}
exports.AppModuleCreator = AppModuleCreator;
