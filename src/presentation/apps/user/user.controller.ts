/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import Controller from "../../../infrastructure/objects/controller";
import UserRepositoryImpl from "src/infrastructure/repositories/user.repository.impl";
import LogService from "../../../presentation/services/log.service";
import ChangePasswordDto from "../../../domain/dto/user/change-password.dto";
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";
import AuthorizationAccountDto from "../../../domain/dto/user/authorization-account.dto";

interface IUserController {
    changePassword(request: Request, response: Response): any;
    authorizationAccount(request: Request, response: Response): any;
    deleteAccount(request: Request, response: Response): any;
}

class UserController extends Controller implements IUserController {
    private readonly _contextPath: string = "./src/presentation/apps/user/user.controller.ts";

    public constructor(
        private readonly _logService: LogService,
        private readonly _repository: UserRepositoryImpl
    ) {
        super(_logService);
    }

    public changePassword = (request: Request, response: Response): any => {

        const [dto, error] = ChangePasswordDto.create(request.body);

        if (error) {
            this._logService.errorLog(error, `${this._contextPath} | changePassword()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        }

        this._repository.changePassword(dto!)
        .then(() => response.status(HttpStatusCode.CREATED).redirect("/login"))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | changePassword()`, response));
    };

    public authorizationAccount = (request: Request, response: Response): any => {
        const [ dto, status ] = AuthorizationAccountDto.create(request.params.token);

        if (status) {
            this._logService.errorLog("occurred a error", `${this._contextPath} | authorizationAccount()`);
            return response.status(status).redirect("/login");
        }
        
        this._repository.authorizationAccount(dto!)
        .then(() => response.status(HttpStatusCode.OK).redirect("/heroes/list"))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | authorizationAccount()`, response));
    };

    public deleteAccount = (request: Request, response: Response): any => {
        this._repository.deleteAccount()
        .then(() => response.status(HttpStatusCode.OK).json({ response: "deleteAccount() success" }))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | deleteAccount()`, response));
    };
}

export default UserController;