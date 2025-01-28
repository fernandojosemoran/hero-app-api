import { Router } from "express";

import mediaControllerInstance, { MediaController } from "./media.controller";
import Expose from "../../../infrastructure/objects/router";

export class MediaRoutes extends Expose{
    public constructor(
        private readonly controller: MediaController
    ) {
        super();
    }

    public get routes(): Router {
        this.router.get("/hero/:image", this.controller.streamHeroImages);

        return this.router;
    }
}

export default new MediaRoutes(
    mediaControllerInstance
);