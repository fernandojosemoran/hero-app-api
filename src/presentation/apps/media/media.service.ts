import configApp from "../../../../config-app";
import fs from "fs";
import path from "path";
import HttpError from "../../../../src/infrastructure/errors/http-error";

interface IMediaService {
    streamHeroImage(image: string): Promise<fs.ReadStream>;
}

class MediaService implements IMediaService{
    public streamHeroImage(image: string): Promise<fs.ReadStream> {
        return new Promise((resolve, reject) => {
            const stream: fs.ReadStream = fs.createReadStream(path.join(configApp.staticFilesPath, "media", image))
            .on("open", () => resolve(stream))
            // .on("data", (stream) => console.log({ stream }))
            .on("error", () => reject(HttpError.notFound("Not found image")));
        });
    };
}

export default MediaService;
