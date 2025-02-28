

describe('./src/presentation/apps/auth/auth.routes.ts', () => {

    test('Should have properties like routes', async () => {
        expect((await import("./auth.routes")).default).toHaveProperty("routes");
    });

    test('Should routes method be an method', async () => {
        expect(typeof (await import("./auth.routes")).default.routes).toBe("function");
    });

    // test('Should call post method five times', async () => {  
    //     const postSpy = RouterApp.prototype.appRoutes.post = jest.fn();

    //     await (await import("./auth.routes")).default.routes;

    //     expect(postSpy).toHaveBeenCalled();
    // });

});