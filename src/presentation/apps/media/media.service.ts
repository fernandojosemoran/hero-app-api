import configApp from "../../../../config-app";
import fs from "fs";
import path from "path";

interface IMediaService {
    streamHeroImage(image: string): Promise<fs.ReadStream>;
}

class MediaService implements IMediaService{
    public streamHeroImage(image: string): Promise<fs.ReadStream> {
        return Promise.resolve(fs.createReadStream(path.join(configApp.staticFilesPath, "media", image)));
    };
}

export default MediaService;
