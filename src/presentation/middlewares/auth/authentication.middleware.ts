import { NextFunction, Request, Response } from "express";

import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";
import Jwt from "../../../infrastructure/plugins/jwt.plugin";
import LogService from "../../../presentation/services/log.service";

function authentication(request: Request, response: Response, next: NextFunction) {
    const loginPath: string = "/auth/login";

    const oldAuthToken: string | undefined = request.cookies["auth-token"];
    const isAuthorized: string | undefined = request.headers.authorization;

    console.log({ isAuthorized });

    if (!isAuthorized || isAuthorized !== "True") return response.status(HttpStatusCode.UNAUTHORIZED).redirect(loginPath);
    if (!oldAuthToken) return response.status(HttpStatusCode.UNAUTHORIZED).redirect(loginPath);

    const jwt: Jwt = new Jwt(new LogService());

    const isValidOldAuthToken = jwt.verifyToken<{id: string, userName: string, lastName: string}>(oldAuthToken);

    if (!isValidOldAuthToken) return response.status(HttpStatusCode.UNAUTHORIZED).redirect(loginPath);
    
    next();
}


export default authentication;