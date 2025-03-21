import { ConfigApp } from '../config-app';
import { RouterApp } from './router-app';
import { rateLimitMiddleware } from './presentation/middlewares/rate-limit.middleware';
import { helmetMiddleware } from './presentation/middlewares/security/helmet.middleware';

// hidden dependencies
import { morganMiddleware } from './presentation/middlewares/morgan.middleware';
import { corsMiddleware } from './presentation/middlewares/security/cors.middleware';

import express from 'express';
import ServerErrors from "./infrastructure/errors/server.error";
import http from "http";
import LogService from './presentation/services/log.service';
import cookieMiddleware from './presentation/middlewares/cookie.middleware';
import Env from './infrastructure/constants/env';



// hidden dependencies
const logService: LogService = new LogService();

class ServerApp {
    public readonly server = express();

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

    private disables(): void {
        this.server.disable('x-powered-by');
    }

    private middlewares(): void {
        this.server.use(rateLimitMiddleware());
        this.server.use(helmetMiddleware());
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

        const handlerServerAppError = (error: Error | undefined) => {
            if (error) return logService.errorLog(error);

            logService.infoLog(`Server running on http://127.0.0.1:${this._config.port}`, "./src/server.ts | start()", true);
        };

        this.middlewares();
        this.routes();
        this.disables();
        
        if (Env.MODE_TEST) this._serverListeningFlag = this.server.listen(0, handlerServerAppError);
        if (!Env.MODE_TEST) this._serverListeningFlag = this.server.listen(this._config.port, handlerServerAppError);
        this._startMethodFlagFlag = true;
    }

    public async stop(): Promise<void> {
        this._serverListeningFlag!.close();
    }   
}

export default ServerApp;