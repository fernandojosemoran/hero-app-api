import { Request, Response } from "express";
import { ILoginResponse } from "../../../domain/responses/login-response";

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
        const [ dto, error ] = LoginDto.create(request.body);
        
        if (error) {
            this._logService.errorLog(error, `${this._contextPath} | login()`);
            return response.status(HttpStatusCode.BAD_REQUEST).json({ response: error });
        }

        const handlerResponse = ({ token, ...user }: ILoginResponse) => {
            return response
            .status(HttpStatusCode.OK)
            .cookie(
                "auth-token", 
                token,
                {
                    httpOnly: true,
                    secure: !Env.DEBUG,
                    expires: new Date(Date.now() + 3600000),
                    maxAge: 3600000,
                    sameSite: Env.DEBUG ? "lax" : "none"
                }
            )
            .setHeaders(new Headers({
                Authorization: "True",
                "X-Powered-By": "HeroesApp"
            }))
            .json({ response: user });
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
        .then(() => response.status(HttpStatusCode.CREATED).json({ response: true }))
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | register()`, response));
    };

    public logout = (request: Request, response: Response): any => {

        const authToken: string | undefined = request.cookies["auth-token"];

        if (!authToken) return response.status(HttpStatusCode.CONFLICT).json({ response: false });

        response.clearCookie(
            'auth-token', 
            { 
                httpOnly: true, 
                secure: !Env.DEBUG, 
                sameSite: Env.DEBUG ? "lax" : "none"
            }
        ); 
        
        return response.status(HttpStatusCode.OK).json({ response: true });
    };

    public refreshToken = (request: Request, response: Response): any => {
        const authToken: string = request.cookies["auth-token"];

        const isAuthorized: string | undefined = request.headers.authorization;

        if (!isAuthorized || isAuthorized !== "True") return response.status(HttpStatusCode.UNAUTHORIZED).json({ response: false });
        if (!authToken) return response.status(HttpStatusCode.UNAUTHORIZED).json({ response: false });

        this._authService.refreshToken(authToken)
        .then(token => response
            .status(HttpStatusCode.CREATED)
            .cookie(
                "auth-token", 
                token,
                {
                    httpOnly: true,
                    secure: !Env.DEBUG,
                    expires: new Date(Date.now() + 3600000),
                    maxAge: 3600000,
                    sameSite: Env.DEBUG ? "lax" : "none"
                }
            )
            .setHeaders(new Headers({
                Authorization: "True",
                "X-Powered-By": "HeroesApp"
            }))
            .json({ response: true })
        )
        .catch(error => this.handlerResponseError(error, `${this._contextPath} | refreshToken()`, response));
    };
}

export default AuthController;
