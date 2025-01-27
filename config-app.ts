import Middleware from "./src/presentation/middlewares/middleware";
import Env from "./src/infrastructure/constants/env";
import path from "path";
import RouterAppInstance, { RouterApp } from "./src/router-app";

interface IConfigApp {
    rootDirPath: string;
    debug: boolean;
    port: number;
    staticFilesPath: string;
    middlewares: Middleware[],
    routesApp: RouterApp
}

export const configApp: IConfigApp = {
    rootDirPath: __dirname, 
    debug: Env.DEBUG,
    port: Env.PORT,
    staticFilesPath: path.join(__dirname, "statics/frontend/browser"),
    middlewares: [

    ],
    routesApp: RouterAppInstance
};

export default configApp;