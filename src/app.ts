import ServerApp from "./server";

function main(): void {
    new ServerApp().start();
}

(function(): void {
    main();
})();