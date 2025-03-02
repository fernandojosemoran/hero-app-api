import { JwtPayload } from 'jsonwebtoken';
import LogService from '../../presentation/services/log.service';
import JwtPlugin from './jwt.plugin';

interface IJwtPayload { 
    id: number; 
    name: string; 
    exp: number;
    iat: number;
}

describe('./src/infrastructure/plugins/jwt.plugin.ts', () => {
    const logService: LogService = new LogService();
    const jwtPlugin: JwtPlugin = new JwtPlugin(logService);

    const payload = { id: 1, name: "John Doe" };

    beforeEach(() => jest.clearAllMocks());

    test('Should have properties like decode, generateToken, and verifyToken', () => {
        expect(jwtPlugin).toHaveProperty("decode");
        expect(jwtPlugin).toHaveProperty("generateToken");
        expect(jwtPlugin).toHaveProperty("verifyToken");
    });

    test('Should have decode, generateToken, and verifyToken property as methods', () => {
        expect(typeof jwtPlugin.decode).toBe("function");
        expect(typeof jwtPlugin.generateToken).toBe("function");
        expect(typeof jwtPlugin.verifyToken).toBe("function");
    });

    test('Should call the generateToken method with payload', async () => {
        const generateTokenSpy = jest.spyOn(jwtPlugin, "generateToken");
        
        await jwtPlugin.generateToken(payload);

        expect(generateTokenSpy).toHaveBeenCalledWith(payload);
    });

    test('Should generateToken method generate a token', async () => {
        const token: string | undefined = await jwtPlugin.generateToken(payload);

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
    });

    test('Should call the decode method with payload', async () => {
        const decodeSpy = jest.spyOn(jwtPlugin, "decode");
        
        const token: string | undefined = await jwtPlugin.generateToken(payload);

        await jwtPlugin.decode(token!);

        expect(decodeSpy).toHaveBeenCalledWith(token!);
    });

    test('Should decode method decoded a token', async () => {
        const token: string | undefined = await jwtPlugin.generateToken(payload);

        const decodeToken: string | JwtPayload | null = await jwtPlugin.decode(token!);

        expect(token).toBeDefined();
        expect(decodeToken).toBeDefined();
        expect(decodeToken).toEqual({
            exp: expect.any(Number), 
            iat: expect.any(Number), 
            id: payload.id, 
            name: payload.name 
        });
    });

    test('Should call the verifyToken method with a token', async () => {
        const verifyTokenSpy = jest.spyOn(jwtPlugin, "verifyToken");

        const token: string | undefined = await jwtPlugin.generateToken(payload);

        await jwtPlugin.verifyToken<IJwtPayload>(token!);

        expect(token).toBeDefined();
        expect(verifyTokenSpy).toHaveBeenCalledWith(token!);
    });

    test('Should verifyToken method verify if token is valid', async () => {
        const token: string | undefined = await jwtPlugin.generateToken(payload);

        const isValidToken = await jwtPlugin.verifyToken<IJwtPayload>(token!);

        expect(token).toBeDefined();
        expect(isValidToken).not.toBeUndefined();
        expect(isValidToken).toEqual({
            exp: expect.any(Number), 
            iat: expect.any(Number), 
            id: payload.id, 
            name: payload.name 
        });
    });
});