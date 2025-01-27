import Middleware from "../middleware";

class Authentication extends Middleware {
    public constructor(){
        super();
    }

    public get use(): Middleware {
        return new Middleware();
    }
}

export default Authentication;