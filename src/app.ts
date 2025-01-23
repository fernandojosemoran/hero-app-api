
import Env from "./infrastructure/constants/env";
import RouterApp from "./router-app";
import ServerApp from "./server";

function main(): void {
    new ServerApp(Env.PORT, RouterApp).start();
}

(function(): void {
    main();
})();