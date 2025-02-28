import { Router } from "express";

import controllers from "./media.controller";
import routes from "../../../router-app";
import Server from "../../../server";
import ConfigApp from "../../../../config-app";
import mediaRoutes from "./media.routes";

describe('./src/presentation/apps/media/media.routes.ts', () => {
    const router: Router = mediaRoutes.routes;
    const server: Server = new Server(ConfigApp, routes);

    test('Should have a property called appRoutes', () => {
        expect(routes).toHaveProperty("appRoutes");
    });

    test('Should ensure that appRoutes is a method', () => {
        expect(typeof routes.appRoutes).toBe("function");
    });
    
    test('Should ensure that media route exists', async () => {
        const getSpy = jest.spyOn(router, "get");

        server.start();

        await server.stop();

        expect(getSpy).toHaveBeenCalledWith("/hero/:image", controllers.streamHeroImages);
    });
});