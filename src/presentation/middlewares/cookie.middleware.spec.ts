import cookieParser from "cookie-parser";
import Env from "../../infrastructure/constants/env";
import cookieMiddleware from "./cookie.middleware";

jest.mock("cookie-parser", () => {
    const currentCookieParse = jest.requireActual("cookie-parser");
    
    return jest.fn((secret: string, options: cookieParser.CookieParseOptions) => currentCookieParse(secret, options));
});

interface ICookieParseOption {
    secret: string | string[]; 
    decode: cookieParser.CookieParseOptions
}

describe('./src/presentation/middlewares/cookie.middleware.ts', () => {
    test('Should call cookieParser middleware with cookieParse options', () => {
        const cookieParseOptions: ICookieParseOption = {
            secret: Env.COOKIE_SECRET_KEY, 
            decode: { decode: expect.any(Function) }
        };

        cookieMiddleware();

        expect(cookieParser).toHaveBeenCalledWith(cookieParseOptions.secret, cookieParseOptions.decode);
    });
});