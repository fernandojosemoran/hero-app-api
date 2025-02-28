import { Router } from "express";

import routes from "./auth.routes";
import controllers from "./auth.controller";
import Server from "../../../server";
import ConfigApp from "../../../../config-app";
import RouterApp from "../../../router-app";

describe('./src/presentation/apps/auth/auth.routes.ts', () => {
    const router: Router = routes.routes;

    

    const server: Server = new Server(ConfigApp, RouterApp);

    test('Should have the property routes', async () => {
        expect((await import("./auth.routes")).default).toHaveProperty("routes");
    });

    test('Should routes property be a method', async () => {
        expect(typeof (await import("./auth.routes")).default.routes).toBe("function");
    });

    test('Should ensure that for register, login, logout, refresh-token exist', async () => {  
        const postSpy = jest.spyOn(router, "post");

        server.start();

        await server.stop();

        expect(postSpy).toHaveBeenCalledWith("/login", controllers.login);
        expect(postSpy).toHaveBeenCalledWith("/refresh-token", controllers.refreshToken);
        expect(postSpy).toHaveBeenCalledWith("/logout", controllers.logout);
        expect(postSpy).toHaveBeenCalledWith("/register", controllers.register);
    });
});