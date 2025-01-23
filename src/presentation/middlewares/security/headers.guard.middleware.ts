import { NextFunction, Request, Response } from "express";
import Env from "../../../../src/infrastructure/constants/env";
import HttpStatusCode from "../../../../src/infrastructure/helpers/http-status-code";

interface IHeaderGuardMiddleware {
    Authorization: ""
}

export function headersGuardMiddleware(request: Request, response: Response, next: NextFunction) {
    if (!request.headers.authorization) return response.status(HttpStatusCode.FORBIDDEN).redirect(Env.HOST_URL);
    if (!request.headers.origin) return response.status(HttpStatusCode.FORBIDDEN).redirect(Env.HOST_URL);
    if (!request.headers.accept)

    // const headers = request.headers;
    
    next();
}

