import express, { Router, Response } from "express";

import heroesRoutes from "./presentation/apps/heroes/heroes.routes";
import LogService from "./presentation/services/log.service";
import HttpStatusCode from "./infrastructure/helpers/http-status-code";
import configApp from "../config-app";
import mediaRoutes from "./presentation/apps/media/media.routes";
import path from "path";
import authRoutes from "./presentation/apps/auth/auth.routes";
import userRoutes from "./presentation/apps/user/user.routes";

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
        
        this.router.use("/api/hero", heroesRoutes.routes);
        this.router.use("/api/media", mediaRoutes.routes);
        this.router.use("/api/auth", authRoutes.routes);
        this.router.use("/api/account", userRoutes.routes);
        
        this.router.use(express.static(path.join(this.staticFilePath)));
        this.router.get("*", (_, response) => response.sendFile(path.join(this.staticFilePath, "index.html"), (error) => this.handlerErrorSendFile(error, response)));
        
        return this.router;
    }
}

export default new RouterApp(
    new LogService(),
    path.join(configApp.staticFilesPath, "out")
);
