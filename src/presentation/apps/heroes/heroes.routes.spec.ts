import { Router } from 'express';

import Server from '../../../server';
import ConfigApp from '../../../../config-app';
import heroesRoutes from './heroes.routes';
import routes from "../../../router-app";
import controllers from "./heroes.controller";

describe('./src/presentation/apps/heroes/heroes.routes.ts', () => {
    const router: Router = heroesRoutes.routes;

    const server: Server = new Server(ConfigApp, routes);

    beforeEach(() => jest.resetAllMocks());

    test('Should have the property routes', () => {
        expect(heroesRoutes).toHaveProperty("routes");
    });

    test('Should the property appRoutes be a method', () => {
        expect(typeof heroesRoutes.routes).toBe("function");
    });

    test('Should ensure that routes for creating, getting, updating, and deleting heroes exist', async () => {
        const postSpy = jest.spyOn(router, "post");
        const getSpy = jest.spyOn(router, "get");
        const deleteSpy = jest.spyOn(router, "delete");
        const putSpy = jest.spyOn(router, "put");

        server.start();
        await server.stop();

        expect(postSpy).toHaveBeenCalledWith("/create", controllers.createHero);
        expect(getSpy).toHaveBeenCalledWith("/heroes-list", controllers.getAllHeroes);
        expect(getSpy).toHaveBeenCalledWith("/:id", controllers.getHeroById);
        expect(deleteSpy).toHaveBeenCalledWith("/delete/:id", controllers.deleteHero);
        expect(putSpy).toHaveBeenCalledWith("/update/:id", controllers.updateHero);
        expect(getSpy).toHaveBeenCalledWith("/search/:superhero", controllers.searchHero);
    });
});

