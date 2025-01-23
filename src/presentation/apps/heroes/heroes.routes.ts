import { Router } from "express";

import heroesControllerInstance, { HeroController } from "./heroes.controller";
import { headersGuardMiddleware } from "../../../../src/presentation/middlewares/security/headers.guard.middleware";

interface IHeroRoutes {
    get getHeroesRoutes(): Router;
}

export class HeroRoutes implements IHeroRoutes {
    private readonly router: Router = Router();

    public constructor(
        private readonly controllers: HeroController
    ){}

    public get getHeroesRoutes(): Router {
        this.router.post("/hero/create", this.controllers.createHero);
        this.router.get("/hero/heroes-list", headersGuardMiddleware, this.controllers.getAllHeroes);
        this.router.get("/hero/:id", this.controllers.getHeroById);
        this.router.delete("/hero/delete/:id", this.controllers.deleteHero);
        this.router.put("/hero/update/:id", this.controllers.updateHero);
        this.router.get("/hero/search/:superhero", this.controllers.searchHero);
        
        return this.router;
    }
}

export default new HeroRoutes(
    heroesControllerInstance
);
