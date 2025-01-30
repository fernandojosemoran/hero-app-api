import { ConfigApp } from '../config-app';
import { RouterApp } from './router-app';

// hidden dependencies
import { morganMiddleware } from './infrastructure/plugins/morgan.adapter';
import { corsMiddleware } from './presentation/middlewares/security/cors.middleware';

import express from 'express';
import ServerErrors from "./infrastructure/errors/server.errors";
import http from "http";
import LogService from './presentation/services/log.service';
import cookieMiddleware from './presentation/middlewares/cookie.middleware';


// hidden dependencies
const logService: LogService = new LogService();

class ServerApp {
    private readonly server = express();

    private _serverAppInstance: ServerApp | undefined = undefined;
    private _serverListeningFlag: http.Server | undefined;
    private _startMethodFlagFlag: boolean = false;

    public constructor(
        private readonly _config: ConfigApp,
        private readonly _routers: RouterApp
    ) {}

    public get getInstance(): ServerApp {
        if (this._serverAppInstance) throw "already exist a instance of ServerApp";

        const serverInstance = new ServerApp(this._config, this._routers);
        
        this._serverAppInstance = serverInstance;

        return serverInstance;
    }

    private middlewares(): void {
        this.server.use(morganMiddleware());
        this.server.use(corsMiddleware());
        this.server.use(cookieMiddleware());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.server.use(this._routers.appRoutes);
    }

    public start(): void {
        if (this._startMethodFlagFlag) throw ServerErrors.startServer("The method start already were executed.");

        this.middlewares();
        this.routes();
        this._serverListeningFlag = this.server.listen(this._config.port, (error) => {
            if (error) return logService.errorLog(error);

            logService.infoLog(`Server running on http://127.0.0.1:${this._config.port}`, "./src/server.ts | start()", true);
        });
        this._startMethodFlagFlag = true;
    }
    

    public stop(): void {
        this._serverListeningFlag!.close();
    }   
}

export default ServerApp;