import { rateLimitMiddleware } from "./rate-limit.middleware";

import request from "supertest";
import Server from "../../server";
import configApp from "../../../config-app";
import routerApp from "../../router-app";

jest.mock("express-rate-limit", () => {
    const currentRateLimit = jest.requireActual("express-rate-limit");
    
    return jest.fn((options) => currentRateLimit(options));
});

import rateLimit, { Options } from "express-rate-limit";
import HttpStatusCode from "../../infrastructure/helpers/http-status-code";

jest.mock("../../infrastructure/constants/env", () => ({
    ...jest.requireActual("../../infrastructure/constants/env"),
    RATE_LIMIT: 3
}));

import Env from "../../infrastructure/constants/env";

describe('./src/presentation/middlewares/rate-limit.middleware.ts', () => {
    const server: Server = new Server(configApp, routerApp);
    
    test('Should call rateLimitMiddleware with rateLimit options', () => {
        const rateLimitOptions: Partial<Options> = {
            limit: Env.RATE_LIMIT,
            windowMs: 15 * 60 * 1000,
            // standardHeaders: "draft-8",
            // legacyHeaders: false,
            message: { response: "Request limit reached." }
        };
        
        rateLimitMiddleware();
        
        expect(rateLimit).toHaveBeenCalledWith(rateLimitOptions);
    });
    
    test("Should respond with rate limit reached with an INTERNAL_SERVER_ERROR", async () => {
        server.start();

        let response;

        for (let index = 0; index <= 3; index++) {
            response = await request(server.server).get("/");

            if (response?.status === HttpStatusCode.TOO_MANY_REQUESTS) break;
        }

        await server.stop();

        expect(response?.status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
        expect(response?.body).toEqual({ response: "Request limit reached." });
    });
});