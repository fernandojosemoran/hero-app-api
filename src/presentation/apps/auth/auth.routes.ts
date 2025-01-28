import { Router } from "express";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import AuthDataSourceImpl from "../../../infrastructure/datasources/auth.datasource.impl";
import LogService from "../../../presentation/services/log.service";
import Expose from "../../../infrastructure/objects/router";

export class AuthRoutes extends Expose { 

    public constructor(private readonly _controller: AuthController) {
        super();
    }
    
    public get routes(): Router {
        this.router.get("/login", this._controller.login);
        this.router.put("/refresh-token", this._controller.refreshToken);
        this.router.get("/logout", this._controller.logout);
        this.router.post("/register", this._controller.register);

        return this.router;
    }
}

const repository: AuthRepositoryImpl = new AuthRepositoryImpl(new AuthDataSourceImpl());

export default new AuthRoutes(
    new AuthController(
        new AuthService(repository),
        new LogService()
    )
);