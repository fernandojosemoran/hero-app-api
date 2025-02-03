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
        this.router.post("/create", this.controllers.createHero);
        this.router.get("/heroes-list", this.controllers.getAllHeroes);
        this.router.get("/:id", this.controllers.getHeroById);
        this.router.delete("/delete/:id", this.controllers.deleteHero);
        this.router.put("/update/:id", this.controllers.updateHero);
        this.router.get("/search/:superhero", this.controllers.searchHero);
        
        return this.router;
    }
}

export default new HeroRoutes(
    heroesControllerInstance
);
