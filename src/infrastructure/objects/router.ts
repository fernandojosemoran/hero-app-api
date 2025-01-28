import { Router } from "express";

class Expose {
    protected router: Router = Router();

    protected get routes(): Router {
        return this.router;
    }
}

export default Expose;