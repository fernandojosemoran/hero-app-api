import { Router } from "express";

import UserController from "./user.controller";
import LogService from "../../../presentation/services/log.service";
import UserRepositoryImpl from "../../../infrastructure/repositories/user.repository.impl";
import UserDataSourceImpl from "../../../infrastructure/datasources/user.datasource.impl";
import Expose from "../../../infrastructure/objects/router";
import DbDatasourceImpl from "../../../../src/infrastructure/datasources/db.datasource.impl";
import Jwt from "../../../../src/infrastructure/plugins/jwt.plugin";

const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");
const logService: LogService = new LogService();
const jwtPlugin: Jwt = new Jwt(logService);

const userController: UserController = new UserController(
    new LogService(),
    new UserRepositoryImpl(new UserDataSourceImpl(dbDatasource, jwtPlugin))
);

export class UserRoutes extends Expose {
    public constructor(
        private readonly _controllers: UserController
    ){
        super();
    }

    public get routes(): Router {
        this.router.get("/authorization/:token", this._controllers.authorizationAccount);
        this.router.put("/change-password", this._controllers.changePassword);
        this.router.delete("/delete-account", this._controllers.deleteAccount);
        
        return this.router;
    }
}

export default new UserRoutes(
    userController
);
