import { Route } from './interface/route';
import { Express } from "express-serve-static-core";
export declare class Routing {
    private APP;
    private routes;
    constructor(routes: Route[], APP: Express);
    private start();
}
