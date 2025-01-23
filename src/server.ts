// hidden dependencies
import { morganMiddleware } from './infrastructure/adapters/morgan.adapter';
import { corsMiddleware } from './presentation/middlewares/security/cors.middleware';
import { RouterApp } from './router-app';

import express from 'express';
import ServerErrors from "./infrastructure/errors/server.errors";
import http from "http";
import path from 'path';
import LogService from './presentation/services/log.service';
import ConfigApp from '../config-app';


// hidden dependencies
const logService: LogService = new LogService();

class ServerApp {
    private readonly server = express();
    private readonly staticFilePath: string = path.resolve(ConfigApp.rootDirPath, "statics/");

    private serverAppInstance: ServerApp | undefined = undefined;
    private serverListeningFlag: http.Server | undefined;
    private startMethodFlagFlag: boolean = false;

    public constructor(
        private readonly port: number,
        private readonly routesApp: RouterApp,
    ) {}

    public get getInstance(): ServerApp {
        if (this.serverAppInstance) throw "already exist a instance of ServerApp";

        const serverInstance = new ServerApp(this.port, this.routesApp);
        
        this.serverAppInstance = serverInstance;

        return serverInstance;
    }

    private middlewares(): void {
        this.server.use(morganMiddleware());
        this.server.use(corsMiddleware());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
        this.server.use(express.static(this.staticFilePath));
    }

    private routes(): void {
        this.server.use(this.routesApp.appRoutes);
    }

    public start(): void {
        if (this.startMethodFlagFlag) throw ServerErrors.startServer("The method start already were executed.");

        this.middlewares();
        this.routes();
        this.serverListeningFlag = this.server.listen(this.port, (error) => {
            if (error) return logService.errorLog(error);

            logService.infoLog(`Server running on http://127.0.0.1:${this.port}`, "./src/server.ts | start()", true);
        });
        this.startMethodFlagFlag = true;
    }
    

    public stop(): void {
        this.serverListeningFlag!.close();
    }   
}

export default ServerApp;