import { Request, Response } from "express";

/* eslint-disable @typescript-eslint/no-explicit-any */
import AuthService from "./auth.service";
import RegisterDto from "../../../domain/dto/auth/register.dto";
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";
import LogService from "../../../presentation/services/log.service";
import Controller from "../../../infrastructure/objects/controller";
import LoginDto from "../../../domain/dto/auth/login.dto";
import Env from "../../../infrastructure/constants/env";

interface IAuthController {
    login(request: Request, response: Response): any;
    register(request: Request, response: Response): any;
    logout(request: Request, response: Response): any;
    refreshToken(request: Request, response: Response): any;
}

class AuthController extends Controller implements IAuthController {
    private readonly _contextPath: string = "./src/presentation/apps/auth/auth.controller.ts";

    public constructor(
        private readonly _authService: AuthService,
        private readonly _logService: LogService
    ) {
        super(_logService);
    }
    
    public login = (request: Request, response: Response): any => {
        console.log({ cookie: request.cookies, signed: request.signedCookies });

        const [dto, error] = LoginDto.create(request.body);
        
        if (error) {
            this._logService.errorLog(error, `${this._contextPath} | login()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        }

        const handlerResponse = (token: string) => {
            return response.status(HttpStatusCode.OK).cookie(
                "Authorization", 
                token,
                {
                    httpOnly: true,
                    secure: Env.DEBUG,
                    expires: new Date(),
                    maxAge: 3600000
                }
            );
        };

        this._authService.login(dto!)
        .then(token => handlerResponse(token))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | login()`, response));
    };

    public register = (request: Request, response: Response): any => {

        const [ dto, error ] = RegisterDto.create(request.body);
        
        if (error) {
            this._logService.errorLog(error, `${this._contextPath} | register()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        }

        this._authService.register(dto!)
        .then(data => response.status(HttpStatusCode.CREATED).json({ response: data }))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | register()`, response));
    };

    public logout = (request: Request, response: Response): any => {
        this._authService.logout()
        .then(data => response.status(HttpStatusCode.OK).json({ response: data }))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | logout()`, response));
    };

    public refreshToken = (request: Request, response: Response): any => {
        this._authService.refreshToken("")
        .then(data => response.status(HttpStatusCode.CREATED).json({ response: data }))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | refreshToken()`, response));
    };
}

export default AuthController;