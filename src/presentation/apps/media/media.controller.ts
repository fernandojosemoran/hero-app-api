/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";

import StreamHeroImageDto from "../../../../src/domain/dto/media/stream-hero-image.dto";
import HttpStatusCode from "../../../../src/infrastructure/helpers/http-status-code";
import Controller from "../../../../src/infrastructure/objects/controller";
import LogService from "../../../../src/presentation/services/log.service";
import MediaService from "./media.service";

export class MediaController extends Controller {
    public constructor(
        private readonly mediaServices: MediaService, 
        protected readonly logService: LogService
    ) {
        super(logService);
    }

    public streamHeroImages = (request: Request, response: Response): any => {
        const [ dto, error ] = StreamHeroImageDto.create(request.params.image);

        if (error) return response.status(HttpStatusCode.NOT_FOUND);

        this.mediaServices.streamHeroImage(dto!.image)
        .then(stream => stream.pipe(response).status(HttpStatusCode.FOUND))
        .catch(error => this.handlerResponseError(error, "streamHeroImages()", response));
    };
}

export default new MediaController(
    new MediaService(),
    new LogService()
);