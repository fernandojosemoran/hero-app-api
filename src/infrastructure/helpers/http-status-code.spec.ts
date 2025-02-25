import HttpStatusCode from "./http-status-code";

describe('Indicate the directory of the file to test', () => {

    test("Should contain http status code properties", () => {
        expect(HttpStatusCode).toHaveProperty("OK");
        expect(HttpStatusCode).toHaveProperty("FOUND");
        expect(HttpStatusCode).toHaveProperty("CREATED");
        expect(HttpStatusCode).toHaveProperty("ACCEPTED");
        expect(HttpStatusCode).toHaveProperty("CONFLICT");
        expect(HttpStatusCode).toHaveProperty("NOT_FOUND");
        expect(HttpStatusCode).toHaveProperty("INTERNAL_SERVER_ERROR");
        expect(HttpStatusCode).toHaveProperty("BAD_REQUEST");
        expect(HttpStatusCode).toHaveProperty("FORBIDDEN");
        expect(HttpStatusCode).toHaveProperty("UNAUTHORIZED");
        expect(HttpStatusCode).toHaveProperty("METHOD_NOT_ALLOWED");
        expect(HttpStatusCode).toHaveProperty("NOT_ACCEPTABLE");
        expect(HttpStatusCode).toHaveProperty("PROXY_AUTHENTICATION_REQUIRED");
        expect(HttpStatusCode).toHaveProperty("REQUEST_TIMEOUT");
        expect(HttpStatusCode).toHaveProperty("PAYMENT_REQUIRED");
    });

    test("Should ensure HTTP status code properties are numbers", () => {
        expect(typeof HttpStatusCode.OK).toBe("number");
        expect(typeof HttpStatusCode.FOUND).toBe("number");
        expect(typeof HttpStatusCode.CREATED).toBe("number");
        expect(typeof HttpStatusCode.ACCEPTED).toBe("number");
        expect(typeof HttpStatusCode.CONFLICT).toBe("number");
        expect(typeof HttpStatusCode.NOT_FOUND).toBe("number");
        expect(typeof HttpStatusCode.INTERNAL_SERVER_ERROR).toBe("number");
        expect(typeof HttpStatusCode.BAD_REQUEST).toBe("number");
        expect(typeof HttpStatusCode.FORBIDDEN).toBe("number");
        expect(typeof HttpStatusCode.UNAUTHORIZED).toBe("number");
        expect(typeof HttpStatusCode.METHOD_NOT_ALLOWED).toBe("number");
        expect(typeof HttpStatusCode.NOT_ACCEPTABLE).toBe("number");
        expect(typeof HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED).toBe("number");
        expect(typeof HttpStatusCode.REQUEST_TIMEOUT).toBe("number");
        expect(typeof HttpStatusCode.PAYMENT_REQUIRED).toBe("number");
    });

    test('Should ensure each property matches the correct HTTP status code', () => {
        expect(HttpStatusCode.OK).toBe(200);
        expect(HttpStatusCode.FOUND).toBe(302);
        expect(HttpStatusCode.CREATED).toBe(201);
        expect(HttpStatusCode.ACCEPTED).toBe(202);
        expect(HttpStatusCode.CONFLICT).toBe(409);
        expect(HttpStatusCode.NOT_FOUND).toBe(404);
        expect(HttpStatusCode.INTERNAL_SERVER_ERROR).toBe(500);
        expect(HttpStatusCode.BAD_REQUEST).toBe(400);
        expect(HttpStatusCode.FORBIDDEN).toBe(303);
        expect(HttpStatusCode.UNAUTHORIZED).toBe(401);
        expect(HttpStatusCode.METHOD_NOT_ALLOWED).toBe(405);
        expect(HttpStatusCode.NOT_ACCEPTABLE).toBe(406);
        expect(HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED).toBe(407);
        expect(HttpStatusCode.REQUEST_TIMEOUT).toBe(408);
        expect(HttpStatusCode.PAYMENT_REQUIRED).toBe(402);
    });
});