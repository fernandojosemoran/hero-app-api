import { RequestHandler } from "express";

import cookieParser from "cookie-parser";
import Env from "../../infrastructure/constants/env";

function cookieMiddleware(): RequestHandler {
    return cookieParser(
        Env.COOKIE_SECRET_KEY, 
        {
            decode: (value) => {
                // value is similar to 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjMDA0ZjI3LWMwZGYtNDAyZi1hNDliLTljY2M5OGU4Zjk0OCIsInVzZXJOYW1lIjoiZmVybmFuZG8iLCJsYXN0TmFtZSI6Impvc2UiLCJpYXQiOjE3MzgzMDUwMzYsImV4cCI6MzQ3NjYxMzUyMX0.3vBOCxuf4CFWdZ00KFEYkhVJ0nvK2Duvdnj7Ly5b-cY'
                return value;
            },
        }
    );
}

export default cookieMiddleware;