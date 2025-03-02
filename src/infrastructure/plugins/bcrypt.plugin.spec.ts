import LogService from '../../presentation/services/log.service';
import Bcrypt from "./bcrypt.plugin";

describe('./src/infrastructure/plugins/bcrypt.plugin.ts', () => {
    let bcrypt: Bcrypt;

    beforeEach(() => {
        jest.resetAllMocks();
        bcrypt = new Bcrypt(new LogService());
    });
    
    test('Should have properties like compare and hash', () => {
        expect(bcrypt).toHaveProperty("compare");
        expect(bcrypt).toHaveProperty("hash");
    });

    test('Should have compare and hash properties as methods', () => {
        expect(typeof bcrypt.compare).toBe("function");
        expect(typeof bcrypt.hash).toBe("function");
    });

    test("Should call hash method with a password", async () => {
        const hashSpy = jest.spyOn(bcrypt, "hash").mockImplementation(jest.fn());

        const password: string = "test-password";

        await bcrypt.hash(password);

        expect(hashSpy).toHaveBeenCalledWith(password);
    });

    test('Should call compare method with a password and password hashed', async () => {
        const compareSpy = jest.spyOn(bcrypt, "compare").mockImplementation(jest.fn());

        const password: string = "test-password";
        const passwordHashed: string = "hash-test";

        await bcrypt.compare(password, passwordHashed);

        expect(compareSpy).toHaveBeenCalledWith(password, passwordHashed);
    }); 

    test('Should hash a password with hash method', async () => {
        const password: string = "test-password";

        const passwordHashed: string | undefined = await bcrypt.hash(password);

        expect(passwordHashed).not.toBeUndefined();
        expect(typeof passwordHashed).toBe("string");
    }); 

    test('Should hash a compare if password hashed is valid with compare method', async () => {
        const password: string = "test-password";

        const passwordHashed: string | undefined = await bcrypt.hash(password);

        const passwordCompared: boolean | undefined = await bcrypt.compare(password, passwordHashed!);

        expect(passwordCompared).not.toBeUndefined();
        expect(typeof passwordCompared).toBe("boolean");
        expect(passwordCompared).toBeTruthy();
    }); 
});