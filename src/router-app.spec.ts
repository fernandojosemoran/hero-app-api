import { Router } from 'express';

import express from "express";
import configApp from '../config-app';
import routes from "./router-app";
import Server from './server';
import path from 'path';
import heroesRoutes from './presentation/apps/heroes/heroes.routes';
import mediaRoutes from './presentation/apps/media/media.routes';
import authRoutes from './presentation/apps/auth/auth.routes';
import userRoutes from './presentation/apps/user/user.routes';

describe('Indicate the directory of the file to test', () => {
    const router: Router = routes.appRoutes;

    const server: Server = new Server(configApp, routes);

    beforeEach(() => jest.resetAllMocks());

    test('Should have the property appRoutes', () => {
        expect(routes).toHaveProperty("appRoutes");
    });

    test('Should the property appRoutes be a method', () => {
        expect(typeof routes.appRoutes).toBe("function");
    });

    test('Should ensure that routes for heroes, media, authentication, and account exist', async () => {
        const staticFilePath: string = path.join(configApp.staticFilesPath, "out");

        const useSpy = jest.spyOn(router, "use");
        const getSpy = jest.spyOn(router, "get");
        const staticSpy = jest.spyOn(express, "static");

        server.start();
        await server.stop();

        expect(staticSpy).toHaveBeenCalledWith(path.join(staticFilePath));
        expect(useSpy).toHaveBeenCalledWith("/api/hero", heroesRoutes.routes);
        expect(useSpy).toHaveBeenCalledWith("/api/media", mediaRoutes.routes);
        expect(useSpy).toHaveBeenCalledWith("/api/auth", authRoutes.routes);
        expect(useSpy).toHaveBeenCalledWith("/api/account", userRoutes.routes);
        expect(getSpy).toHaveBeenCalledWith("*", expect.any(Function));
    });
});