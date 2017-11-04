import {Route} from './interface/route';
import {Express} from "express-serve-static-core";
import {bootstrap} from 'fluency-injection';


export class Routing {

    private APP: Express | any;
    private routes: Route[];

    constructor(routes: Route[], APP: Express) {
        this.APP = APP;
        this.routes = routes;
        this.start()
    }

    private start(): void {
        for (const route of this.routes) {
            const method: string = route.method.toLocaleLowerCase();
            const url: string = route.url;
            const page: any = bootstrap(route.page);
            page.app = this.APP;
            this.APP.route(url)[method](page.callBack)
        }
    }

}