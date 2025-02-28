import ConfigApp from './../../../../config-app';
import RouterApp from '../../../router-app';
import controllers from "./media.controller";
import Server from "../../../server";
import request from "supertest";
import HttpStatusCode from '../../../infrastructure/helpers/http-status-code';

describe('./src/presentation/apps/media/media.controller.ts', () => {
    const server: Server = new Server(ConfigApp, RouterApp);

    beforeAll(() => server.start());
    afterAll(async () => await server.stop());

    test('Should have a property called streamHeroImages', () => {
        expect(controllers).toHaveProperty("streamHeroImages");
    });

    test('Should streamHeroImages property be a method', () => {
        expect(typeof controllers.streamHeroImages).toBe("function");
    });

    test('Should get a status code 200 in GET /api/media/hero/:image.ext', async () => {
        await request(server.server)
        .get("/api/media/hero/dc-batman.webp")
        .expect(HttpStatusCode.FOUND);
    });

    test('Should respond with an error if image not found in GET /api/media/hero/:image.ext', async () => {
        const response = await request(server.server)
        .get("/api/media/hero/halo.jpg")
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: "Not found image" });
    });
});