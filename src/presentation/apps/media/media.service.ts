import { configApp } from "../../../../config-app";
import fs from "fs";

interface IMediaService {
    streamHeroImage(image: string): Promise<fs.ReadStream>;
}

// hidden dependencies 
const rootPath: string = configApp.rootDirPath;

class MediaService implements IMediaService{
    public streamHeroImage(image: string): Promise<fs.ReadStream> {
        return Promise.resolve(fs.createReadStream(`${rootPath}/statics/media/${image}`));
    };
}

export default MediaService;