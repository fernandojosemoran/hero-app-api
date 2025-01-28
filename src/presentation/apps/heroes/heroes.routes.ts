import { Router } from "express";

import heroesControllerInstance, { HeroController } from "./heroes.controller";
import Expose from "../../../infrastructure/objects/router";

export class HeroRoutes extends Expose {
    public constructor(
        private readonly controllers: HeroController
    ){
        super();
    }

    public get routes(): Router {
        this.router.post("/hero/create", this.controllers.createHero);
        this.router.get("/hero/heroes-list", this.controllers.getAllHeroes);
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
