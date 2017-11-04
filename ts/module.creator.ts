import { AppModuleConstructor } from "./interface/app.module";
import { Routing } from "./routing";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

let appMain = express();
appMain.use(bodyParser.json())
let AllPages: any[] = [];

function useCorsOption(whitelist: string[]) {
    return {
        origin: function (origin: any, callback: any) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
}


export function AppModuleCreator(module: AppModuleConstructor) {


    // Error when Page imported twice or in two module
    for (let newPage of module.pagesRoute) {
        for (let page of AllPages) {
            if (page.name == newPage.name) {
                throw new Error("Page imported twice or in two module");
            }
        }
        AllPages.push(newPage);
    }
    // ===========================================================================

    // error when Page in Routing is missing in "pagesRoute"
    for (let routing of module.routing) {
        let isGood = false;
        for (let page of module.pagesRoute) {
            if (routing.page.name == page.name) {
                isGood = true;
            }
        }
        if (!isGood) throw new Error('Page in Routing is missing in "pagesRoute"');
        // console.log(routing.page.name)
    }
    // ===================================================================================

    if (module.routing && module.routing.length) {
        if (!module.childUrl) {

            // start main module ===================================================================

            if (module.corsWhiteList && module.corsWhiteList.length > 0) {
                appMain.use(cors(useCorsOption(module.corsWhiteList)))
            } else {
                appMain.use(cors())
            }
            appMain.listen(process.env.PORT || 8080, () => {
                console.log(process.env.PORT || 'server start 8080')
            });


            new Routing(module.routing, appMain);
        } else {

            // start children module ===================================================================

            // console.log(module, 'children');
            let appChild = express();

            if (module.corsWhiteList && module.corsWhiteList.length > 0) {
                appChild.use(cors(useCorsOption(module.corsWhiteList)))
            } else {
                appChild.use(cors())
            }

            appChild.use(bodyParser.json())
            appMain.use(module.childUrl, appChild);
            new Routing(module.routing, appChild);
        }
    } else {
        throw new Error('Routing is empty')
    }
    return function (target: Function) {

    }
}



