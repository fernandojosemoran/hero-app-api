 
import HttpError from "../../../infrastructure/errors/http-error";
import MediaService from "./media.service";
import httpStatusCode from "../../../infrastructure/helpers/http-status-code";

describe('./src/presentation/apps/media/media.service.ts', () => {
    const mediaService: MediaService = new MediaService();

    test('Should have a property called streamHeroImage', () => {
        expect(mediaService).toHaveProperty("streamHeroImage");
    });

    test('Should ensure that streamHeroImage property is a method', () => {
        expect(typeof mediaService.streamHeroImage).toBe("function");
    });

    test('Should return an error if image not found', async () => {
        await mediaService.streamHeroImage("batman.webp")
        .catch((error: HttpError) => {
            expect(error.status).toBe(httpStatusCode.NOT_FOUND);
            expect(error.message).toBe("Not found image");
        });
    });
});