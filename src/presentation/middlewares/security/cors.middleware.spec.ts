import { corsMiddleware } from "./cors.middleware";

import ConfigApp from "../../../../config-app";
import routerApp from "../../../router-app";
import request from "supertest";
import Server from "../../../server";
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";

jest.mock("cors", () => {
    const cors = jest.requireActual("cors");
    return jest.fn((options) => cors(options));
});

import cors from "cors";

type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>;

type CustomOrigin = ( requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void ) => void;
interface ICorsParams {
    allowedHeaders?: string | string[],
    credentials?: boolean,
    exposedHeaders?: string | string[],
    maxAge?: number,
    methods?: string,
    optionsSuccessStatus?: number,
    origin?: CustomOrigin | StaticOrigin,
    preflightContinue?: boolean,
}

describe('./src/presentation/middlewares/security/cors.middleware.ts', () => {    
    
    const server: Server = new Server(ConfigApp, routerApp);
    
    beforeAll(async () => server.start());
    afterAll(async () => await server.stop());

    test('Should corsMiddleware be call with cors options', async () => {
        const corsOptions: ICorsParams = { 
            origin: expect.any(Function),
            optionsSuccessStatus: 200,  
            credentials: true,
            methods: "GET,PUT,POST,DELETE",
            allowedHeaders: [ "Authorization", "Content-Type" ]
        };

        corsMiddleware();

        expect(cors).toHaveBeenCalledWith(corsOptions);
    });

    test("Should deny requests from a disallowed origin configured in cors middleware", async () => {
        await request(server.server)
        .get("/")
        .set("Origin", "https://cors-error.com")
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });

});