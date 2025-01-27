import { Router } from "express";

import mediaControllerInstance, { MediaController } from "./media.controller";

export class MediaRoutes {
    private readonly router: Router = Router();

    public constructor(
        private readonly controller: MediaController
    ) {}

    public get mediaRoutes(): Router {

        this.router.get("/hero/:image", this.controller.streamHeroImages);

        return this.router;
    }
}

export default new MediaRoutes(
    mediaControllerInstance
);