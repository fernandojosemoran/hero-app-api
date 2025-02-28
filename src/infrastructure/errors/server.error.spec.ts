import ServerErrors from "./server.error";

describe('./src/infrastructure/errors/server.errors.ts', () => {
    
    test('Should have the instance and startServer property', () => {
        expect(ServerErrors).toHaveProperty("instance");
        expect(ServerErrors).toHaveProperty("startServer");
    });

    test('Should have instance and startServer properties as methods.', () => {
        expect(typeof ServerErrors.instance).toBe("function");
        expect(typeof ServerErrors.startServer).toBe("function");
    });

    test('Should return a ServerErrors instance with instance and startServer methods', () => {
        expect(ServerErrors.instance("testing with jest")).toBeInstanceOf(ServerErrors);
        expect(ServerErrors.startServer("testing with jest")).toBeInstanceOf(ServerErrors);
    });

    test('Should return a ServerErrors instance with message, name, and stack properties', () => {
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