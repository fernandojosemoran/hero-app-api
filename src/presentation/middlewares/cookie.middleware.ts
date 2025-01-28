import { RequestHandler } from "express";

import cookieParser from "cookie-parser";
import Env from "../../infrastructure/constants/env";

function cookieMiddleware(): RequestHandler {
    return cookieParser(
        Env.COOKIE_SECRET_KEY, 
        {
            decode: (value) => {
                console.log(value); 
                return value;
            }
        }
    );
}

export default cookieMiddleware;