import configApp from "../config-app";
import routerApp from "./router-app";
import Server from "./server";

describe('./src/server.ts', () => {
    const server: Server = new Server(configApp, routerApp);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should contain properties like start and stop', () => {
        expect(server).toHaveProperty("start");
        expect(server).toHaveProperty("stop");
    });

    test('Should be methods start and stop properties', () => {
        expect(typeof server.start).toBe("function");
        expect(typeof server.stop).toBe("function");
    });

    test('should start the server without errors', (done) => {
        expect(() => server.start()).not.toThrow();
        done();
    });

    test('should stop the server correctly', (done) => {
        expect(async () => await server.stop()).not.toThrow();
        done();
    });
});