import { helmetMiddleware } from "./helmet.middleware";
import helmet, { HelmetOptions } from "helmet";
import ConfigApp from "../../../../config-app";
import routerApp from "../../../router-app";
import Server from "../../../server";
import request from "supertest";
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";

jest.mock("helmet", () => {
    const actualHelmet = jest.requireActual("helmet");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockHelmet = jest.fn(() => (req: any, res: any, next: any) => actualHelmet()(req, res, next));
    return mockHelmet;
});

describe('./src/presentation/middlewares/security/helmet.middleware.spec.ts', () => {
    const server: Server = new Server(ConfigApp, routerApp);

    beforeAll(() => server.start());
    afterAll(async () => await server.stop());

    test('Should call helmet middleware with Helmet options', async () => {
        const helmetConf: Readonly<HelmetOptions> = {
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: {
                directives: {
                    "default-src": [ "'self'" ],
                    "script-src": [ "'self'", "'unsafe-inline'" ],
                    "script-src-attr": [ "'unsafe-inline'" ],
                    "img-src": [ "'self'", "*" ]
                }
            }
        };

        helmetMiddleware();

        expect(helmet).toHaveBeenCalledWith(helmetConf);
    });

    test("Should set expected security headers from Helmet middleware", async () => {
        const response = await request(server.server)
            .get("/")
            .expect(HttpStatusCode.OK);

        expect(response.header["content-security-policy"]).toBe("default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests");
        expect(response.header['cross-origin-opener-policy']).toBe("same-origin");
        expect(response.header['cross-origin-resource-policy']).toBe("same-origin");
        expect(response.header['origin-agent-cluster']).toBe("?1");
        expect(response.header['referrer-policy']).toBe("no-referrer");
        expect(response.header['strict-transport-security']).toBe("max-age=31536000; includeSubDomains");
        expect(response.header['x-content-type-options']).toBe("nosniff");
        expect(response.header['x-dns-prefetch-control']).toBe("off");
        expect(response.header['x-download-options']).toBe("noopen");
        expect(response.header['x-frame-options']).toBe("SAMEORIGIN");
        expect(response.header['x-permitted-cross-domain-policies']).toBe("none");
        expect(response.header['x-xss-protection']).toBe("0");
    });
});