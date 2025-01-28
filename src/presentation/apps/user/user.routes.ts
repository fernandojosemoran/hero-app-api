import { Router } from "express";

import UserController from "./user.controller";
import LogService from "../../../presentation/services/log.service";
import UserRepositoryImpl from "../../../infrastructure/repositories/user.repository.impl";
import UserDataSourceImpl from "../../../infrastructure/datasources/user.datasource.impl";
import Expose from "../../../infrastructure/objects/router";

const userController: UserController = new UserController(
    new LogService(),
    new UserRepositoryImpl(new UserDataSourceImpl())
);

export class UserRoutes extends Expose {
    public constructor(
        private readonly _controllers: UserController
    ){
        super();
    }

    public get routes(): Router {
        this.router.put("/authorization-account/:token", this._controllers.authorizationAccount);
        this.router.put("/change-password", this._controllers.changePassword);
        this.router.delete("/delete-account", this._controllers.deleteAccount);
        
        return this.router;
    }
}

export default new UserRoutes(
    userController
);
