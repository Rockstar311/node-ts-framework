
export interface AppModuleConstructor {
    pagesRoute: any[];
    provides?: any[];
    routing: any;
    childModules?: any[],
    childUrl?: string;
    corsWhiteList?: string[]
}