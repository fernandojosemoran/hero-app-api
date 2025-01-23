import { Router, Response } from "express";

import heroesRoutes from "./presentation/apps/heroes/heroes.routes";
import LogService from "./presentation/services/log.service";
import path from "path";
import HttpStatusCode from "./infrastructure/helpers/http-status-code";
import ConfigApp from "../config-app";

// hidden dependencies 
const statusCode = HttpStatusCode;

export class RouterApp {
    private readonly router: Router = Router();
    
    public constructor(
        private readonly logService: LogService,
        private readonly staticFilePath: string
    ) {}

    private handlerErrorSendFile(error: Error, response: Response) {
        if (!error) return;

        this.logService.errorLog(error.message, ".src/presentation/server.ts", true);
        return response.status(statusCode.INTERNAL_SERVER_ERROR).send("An error occurred while loading the application.");
    }

    public get appRoutes(): Router {
        this.router.use("/api", heroesRoutes.getHeroesRoutes);
        this.router.get("^.*", (_, response) => response.sendFile(this.staticFilePath, (error) => this.handlerErrorSendFile(error, response)));

        return this.router;
    }
}

const staticFilePath: string = `${ConfigApp.rootDirPath}/statics`;

export default new RouterApp(
    new LogService(),
    path.join(staticFilePath, "index.html")
);
