import HttpError from "./http-error";
import HttpStatusCode from "../helpers/http-status-code";

describe('./src/infrastructure/errors/http-error.ts', () => {
    test('Should contain severus properties of http status code errors', () => {
        expect(HttpError).toHaveProperty("internalServerError");
        expect(HttpError).toHaveProperty("badRequest");
        expect(HttpError).toHaveProperty("conflict");
        expect(HttpError).toHaveProperty("forbidden");
        expect(HttpError).toHaveProperty("methodNotAllowed");
        expect(HttpError).toHaveProperty("paymentRequired");
        expect(HttpError).toHaveProperty("unauthorized");
        expect(HttpError).toHaveProperty("notAcceptable");
        expect(HttpError).toHaveProperty("proxyAuthenticationRequired");
        expect(HttpError).toHaveProperty("badRequest");
        expect(HttpError).toHaveProperty("requestTimeout");
    });

    test('Should be methods all properties of HttpError', () => {
        expect(typeof HttpError.internalServerError).toBe("function");
        expect(typeof HttpError.badRequest).toBe("function");
        expect(typeof HttpError.conflict).toBe("function");
        expect(typeof HttpError.forbidden).toBe("function");
        expect(typeof HttpError.methodNotAllowed).toBe("function");
        expect(typeof HttpError.paymentRequired).toBe("function");
        expect(typeof HttpError.unauthorized).toBe("function");
        expect(typeof HttpError.notAcceptable).toBe("function");
        expect(typeof HttpError.proxyAuthenticationRequired).toBe("function");
        expect(typeof HttpError.requestTimeout).toBe("function");
    });

    test('Should return an instance of HttpError all methods', () => {
        expect(HttpError.internalServerError("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.badRequest("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.conflict("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.forbidden("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.methodNotAllowed("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.paymentRequired("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.unauthorized("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.notAcceptable("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.proxyAuthenticationRequired("testing with jest")).toBeInstanceOf(HttpError);
        expect(HttpError.requestTimeout("testing with jest")).toBeInstanceOf(HttpError);
    });

    test('Should return an instance of HttpError all methods', () => {
        const error: string = "testing with jest";

        const badRequestError: HttpError = HttpError.badRequest(error);
        const conflictError: HttpError = HttpError.conflict(error);
        const forbiddenError: HttpError = HttpError.forbidden(error);
        const internalServerErrorError: HttpError = HttpError.internalServerError(error);
        const methodNotAllowedError: HttpError = HttpError.methodNotAllowed(error);
        const notAcceptableError: HttpError = HttpError.notAcceptable(error);
        const notFoundError: HttpError = HttpError.notFound(error);
        const paymentRequiredError: HttpError = HttpError.paymentRequired(error);
        const proxyAuthenticationRequiredError: HttpError = HttpError.proxyAuthenticationRequired(error);
        const requestTimeoutError: HttpError = HttpError.requestTimeout(error);
        const unauthorizedError: HttpError = HttpError.unauthorized(error);

        // console.warn({ message: forbiddenError.message, status: forbiddenError.status, name: forbiddenError.name , stack: typeof forbiddenError?.stack });

        expect(badRequestError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.BAD_REQUEST,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(conflictError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.CONFLICT,
            name: "Error",
            stack: expect.any(String)
        }));

        // TODO
        // expect(forbiddenError).toEqual(expect.objectContaining({
        //     message: error,
        //     status: HttpStatusCode.FORBIDDEN,
        //     name: "Error",
        //     stack: expect.any(String)
        // }));

        expect(internalServerErrorError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(methodNotAllowedError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.METHOD_NOT_ALLOWED,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(notAcceptableError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.NOT_ACCEPTABLE,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(notFoundError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.NOT_FOUND,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(paymentRequiredError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.PAYMENT_REQUIRED,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(proxyAuthenticationRequiredError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(requestTimeoutError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.REQUEST_TIMEOUT,
            name: "Error",
            stack: expect.any(String)
        }));

        expect(unauthorizedError).toEqual(expect.objectContaining({
            message: error,
            status: HttpStatusCode.UNAUTHORIZED,
            name: "Error",
            stack: expect.any(String)
        }));
    });
});