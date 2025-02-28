import { Router } from "express";

import controllers, { AuthController } from "./auth.controller";

import Expose from "../../../infrastructure/objects/router";


export class AuthRoutes extends Expose { 

    public constructor(private readonly _controller: AuthController) {
        super();
    }
    
    public get routes(): Router {
        this.router.post("/login", this._controller.login);
        this.router.post("/refresh-token", this._controller.refreshToken);
        this.router.post("/logout", this._controller.logout);
        this.router.post("/register", this._controller.register);

        return this.router;
    }
}

export default new AuthRoutes(controllers);