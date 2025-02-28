import configApp from "../config-app";
import routerApp from "./router-app";
import Server from "./server";

const startMock = jest.fn();

jest.mock("./server", () => {
    return jest.fn().mockImplementation(() => ({
        start: startMock,
    }));
});

describe("./app.ts", () => {
    test("Should initialize Server with configApp and routerApp and call start()", async () => {

        await import("./app");

        expect(Server).toHaveBeenCalledWith(configApp, routerApp);

        expect(startMock).toHaveBeenCalled();
    });
});