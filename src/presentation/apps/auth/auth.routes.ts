import { Router } from "express";

import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import AuthDataSourceImpl from "../../../infrastructure/datasources/auth.datasource.impl";
import LogService from "../../../presentation/services/log.service";
import Expose from "../../../infrastructure/objects/router";
import Jwt from "../../../infrastructure/plugins/jwt.plugin";
import UUID from "../../../infrastructure/plugins/uui.plugin";
import EmailService from "../../../presentation/services/email.service";
import Email from "../../../infrastructure/plugins/email.plugin";

export class AuthRoutes extends Expose { 

    public constructor(private readonly _controller: AuthController) {
        super();
    }
    
    public get routes(): Router {
        this.router.post("/login", this._controller.login);
        this.router.put("/refresh-token", this._controller.refreshToken);
        this.router.get("/logout", this._controller.logout);
        this.router.post("/register", this._controller.register);

        return this.router;
    }
}

// dependencies
const logService: LogService = new LogService();
const uuidPlugin: UUID = new UUID();
const jwtPlugin: Jwt = new Jwt(logService);
const emailService: EmailService = new EmailService(new Email());
const datasource: AuthDataSourceImpl = new AuthDataSourceImpl(jwtPlugin, uuidPlugin, emailService);
const repository: AuthRepositoryImpl = new AuthRepositoryImpl(datasource);
const authService: AuthService = new AuthService(repository);

export default new AuthRoutes(
    new AuthController(
        authService,
        logService
    )
);