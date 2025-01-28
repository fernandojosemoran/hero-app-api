import configApp from "../config-app";
import RouterApp from "./router-app";
import ServerApp from "./server";

function main(): void {
    new ServerApp(configApp, RouterApp).start();
}

(function(): void {
    main();
})();