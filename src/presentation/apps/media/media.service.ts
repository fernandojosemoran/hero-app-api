import fs from "fs";

interface IMediaService {
    streamHeroImage(image: string): Promise<fs.ReadStream>;
}

class MediaService implements IMediaService{
    public streamHeroImage(image: string): Promise<fs.ReadStream> {
        return Promise.resolve(fs.createReadStream(`./../../../statics/media/${image}`));
    };
}

export default MediaService;