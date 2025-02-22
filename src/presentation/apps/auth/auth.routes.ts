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
import Bcrypt from "../../../infrastructure/plugins/bcrypt.plugin";
import DbDatasourceImpl from "../../../../src/infrastructure/datasources/db.datasource.impl";

export class AuthRoutes extends Expose { 

    public constructor(private readonly _controller: AuthController) {
        super();
    }
    
    public get routes(): Router {
        this.router.post("/login", this._controller.login);
        this.router.post("/refresh-token", this._controller.refreshToken);
        this.router.post("/logout", this._controller.logout);
        this.router.post("/register", this._controller.register);

        return this.router;
    }
}

// dependencies
const logService: LogService = new LogService();
const bcrypt: Bcrypt = new Bcrypt(logService);
const uuidPlugin: UUID = new UUID();
const jwtPlugin: Jwt = new Jwt(logService);
const emailService: EmailService = new EmailService(new Email());
const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");
const datasource: AuthDataSourceImpl = new AuthDataSourceImpl(jwtPlugin, uuidPlugin, emailService, bcrypt, dbDatasource );
const repository: AuthRepositoryImpl = new AuthRepositoryImpl(datasource);
const authService: AuthService = new AuthService(repository);

export default new AuthRoutes(
    new AuthController(
        authService,
        logService
    )
);