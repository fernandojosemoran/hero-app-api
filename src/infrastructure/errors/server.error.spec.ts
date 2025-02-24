import ServerErrors from "./server.error";

describe('./src/infrastructure/errors/server.errors.ts', () => {
    
    test('Should contain instance and startServer property', () => {
        expect(ServerErrors).toHaveProperty("instance");
        expect(ServerErrors).toHaveProperty("startServer");
    });

    test('Should be methods the properties of instance and startServer', () => {
        expect(typeof ServerErrors.instance).toBe("function");
        expect(typeof ServerErrors.startServer).toBe("function");
    });

    test('Should return a instance of ServerErrors the instance and startServer methods', () => {
        expect(ServerErrors.instance("testing with jest")).toBeInstanceOf(ServerErrors);
        expect(ServerErrors.startServer("testing with jest")).toBeInstanceOf(ServerErrors);
    });

    test('Should return a instance of ServerErrors the instance and startServer methods', () => {
        const error: string = "testing with jest";

        const instanceError: ServerErrors = ServerErrors.instance(error);
        const startServerError: ServerErrors = ServerErrors.startServer(error);

        expect(instanceError).toEqual(expect.objectContaining({
            message: error,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(startServerError).toEqual(expect.objectContaining({
            message: error,
            name: "Error",
            stack: expect.any(String)
        }));
    });
});