import configApp from "../config-app";
import routerApp from "./router-app";
import Server from "./server";

describe('./src/server.ts', () => {
    const server: Server = new Server(configApp, routerApp);

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should have properties like start and stop', () => {
        expect(server).toHaveProperty("start");
        expect(server).toHaveProperty("stop");
    });

    test('Should start and stop be methods', () => {
        expect(typeof server.start).toBe("function");
        expect(typeof server.stop).toBe("function");
    });

    test('Should start the server without errors', (done) => {
        expect(() => server.start()).not.toThrow();
        done();
    });

    test('Should stop the server correctly', (done) => {
        expect(async () => await server.stop()).not.toThrow();
        done();
    });
});