import { User } from '../../domain/entities/user.entity';

import LogService from '../../../src/presentation/services/log.service';
import AuthService from "../../presentation/apps/auth/auth.service";
import LoginDto from "../../domain/dto/auth/login.dto";
import RegisterDto from "../../domain/dto/auth/register.dto";
import jwtPlugin from "../../infrastructure/plugins/jwt.plugin";
import EmailService from '../../presentation/services/email.service';
import EmailPlugin from '../../infrastructure/plugins/email.plugin';
import Bcrypt from '../../infrastructure/plugins/bcrypt.plugin';
import Env from '../../infrastructure/constants/env';
import HttpError from '../../infrastructure/errors/http-error';
import HttpStatusCode from "../../infrastructure/helpers/http-status-code";
import UUID from '../../infrastructure/plugins/uui.plugin';

jest.doMock("../../infrastructure/constants/env.ts", () => ({
    __esModule: true,
    default: {
        ...jest.requireActual("../../infrastructure/constants/env.ts").default,
        MODE_TEST: false, 
    },
}));

import AuthDataSourceImpl from "../../infrastructure/datasources/auth.datasource.impl";
import DbDatasourceImpl from '../../infrastructure/datasources/db.datasource.impl';

const logService: LogService = new LogService();
const jwt: jwtPlugin = new jwtPlugin(logService);
const uuid: UUID  = new UUID();
const email: EmailPlugin = new EmailPlugin();
const bcrypt: Bcrypt = new Bcrypt(logService);
const emailService: EmailService = new EmailService(email);
const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");


describe('./src/infrastructure/datasources/auth.datasource.impl.ts', () => {
    const authDatasource: AuthDataSourceImpl = new AuthDataSourceImpl(jwt, uuid, emailService, bcrypt, dbDatasource);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Should contain methods like login,register,refreshToken', () => {
        expect(typeof AuthService.prototype.login).toBe("function");
        expect(typeof AuthService.prototype.register).toBe("function");
        expect(typeof AuthService.prototype.refreshToken).toBe("function");
    });
    
    // REGISTER
    test("Should register a user", async () => {
        const sendRegisterEmailSpy = jest.spyOn(emailService, "sendRegisterEmail").mockImplementation(jest.fn());
        const bcryptHashSpy = jest.spyOn(bcrypt, "hash");
        const uuidV4Spy = jest.spyOn(uuid, "generateV4UUID");
        const dbDatasourceAddMethodSpy = jest.spyOn(dbDatasource, "add").mockImplementation(() => Promise.resolve(true));
        const jwtGenerateTokenSpy = jest.spyOn(jwt, "generateToken");

        dbDatasource.findByProperty = jest.fn(undefined);
        
        const dto: RegisterDto = {
            userName: "test1",
            lastName: "jest",
            password: "test123",
            confirmPassword: "test123",
            email: "test@gmail.com",
            authorization: true,
        };
    
        await authDatasource.register(dto);
        
        expect(bcryptHashSpy).toHaveBeenCalledWith(dto.password);
        expect(uuidV4Spy).toHaveBeenCalled();

        expect(jwtGenerateTokenSpy).toHaveBeenCalledWith({
            id: expect.any(String),
            userName: dto.userName,
            lastName: dto.lastName
        });

        expect(sendRegisterEmailSpy).toHaveBeenCalledWith(            
            "fernandomoran323@gmail.com",
            `${dto.userName} ${dto.lastName}`,
             expect.stringMatching(new RegExp(`^Confirm you account using by following link ${Env.HOST_URL}/api/account/authorization/.+`)),
            "Welcome to http://heroes-app.vercel"
        );

        expect(dbDatasourceAddMethodSpy).toHaveBeenCalled();
    });

    test("Should throw an error if the user already exists during registration", async () => {
        const dto: RegisterDto = {
            userName: "test1",
            lastName: "jest",
            email: "test@gmail.com",
            password: "test123",
            confirmPassword: "test123",
            authorization: false            
        };

        dbDatasource.findByProperty = jest.fn(() => Promise.resolve({
            id: "test-id",
            ...dto
        } as User));

        try {
            await authDatasource.register(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            expect(message).toBe("user has already a account.");
            expect(status).toBe(HttpStatusCode.CONFLICT);
        }
    });

    test("Should throw an error if the password is not hashed during registration", async () => {
        bcrypt.hash = jest.fn(undefined);

        const dto: RegisterDto = {
            userName: "test1",
            lastName: "jest",
            email: "test@gmail.com",
            password: "test123",
            confirmPassword: "test123",
            authorization: false            
        };

        try {
            await authDatasource.register(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            expect(message).toBe("Sorry something occurred wrong");
            expect(status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    });

    // LOGIN
    test("Should login a user", async () => {
        const token: string = "test-token";
        const bcryptCompareSpy = jest.spyOn(bcrypt, "compare").mockReturnValue(Promise.resolve(true));
        const jwtGenerateToken = jest.spyOn(jwt, "generateToken").mockReturnValue(Promise.resolve(token));

        const dto: LoginDto = {
            userName: "test1",
            password: "test123",
            email: "test@gmail.com",
            authorization: true,
        };

        dbDatasource.findByProperty = jest.fn(() => Promise.resolve({ id: "test-id", lastName: "test1", ...dto } as User));

        const login = await authDatasource.login(dto);
        
        expect(bcryptCompareSpy).toHaveBeenCalled();
        expect(jwtGenerateToken).toHaveBeenCalledWith({ id: expect.any(String), userName: dto.userName, lastName: expect.any(String) });
        
        expect(login).toEqual(expect.objectContaining({
            token,
            id: expect.any(String),
            userName: dto.userName,
            lastName: "test1",
            email: dto.email
        }));
    });

    test("Should throw a error if user not exist during the login", async () => {
        const dto: LoginDto = {
            userName: "test1",
            email: "test@gmail.com",
            password: "test123",
            authorization: false
        };

        try {
            await authDatasource.login(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            
            expect(message).toBe("User not exist");
            expect(status).toBe(HttpStatusCode.NOT_FOUND);
        }
    });

    test("Should throw a error if user not is authorized during the login", async () => {

        // const { MODE_TEST } = (await import("../../../infrastructure/constants/env")).default;

        const dto: LoginDto = {
            userName: "test1",
            email: "test@gmail.com",
            password: "test123",
            authorization: false
        };
        
        bcrypt.compare = jest.fn(() => Promise.resolve(true));
        dbDatasource.findByProperty = jest.fn(() => Promise.resolve({ id: "test-id", lastName: "test1", ...dto } as User));

        try {
            await authDatasource.login(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            
            expect(message).toBe("You account don't are authorized, checkout you email service and confirm you account.");
            expect(status).toBe(HttpStatusCode.UNAUTHORIZED);
        }
    });


    test("Should throw a error if password is invalid during the login", async () => {
        const dto: LoginDto = {
            userName: "test1",
            email: "test@gmail.com",
            password: "test123",
            authorization: true
        };

        dbDatasource.findByProperty = jest.fn(() => Promise.resolve({ id: "test-id", lastName: "test1", ...dto } as User));
        bcrypt.compare = jest.fn(() => Promise.resolve(undefined));

        try {
            await authDatasource.login(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            
            expect(message).toBe("Password is not valid");
            expect(status).toBe(HttpStatusCode.UNAUTHORIZED);
        }
    });

    // REFRESH TOKEN
    test("Should refresh a jwt token", async () => {
        const token: string = "test-token";
        const tokenPayload = { id: "testId", userName: "test1", lastName: "jest" };

        const jwtVerifyToken = jest.spyOn(jwt, "verifyToken").mockReturnValue(Promise.resolve(tokenPayload));
        const jwtGenerateToken = jest.spyOn(jwt, "generateToken").mockReturnValue(Promise.resolve(token));

        const newToken: string = await authDatasource.refreshToken(token);

        expect(jwtVerifyToken).toHaveBeenCalledWith(token);
        expect(jwtGenerateToken).toHaveBeenCalledWith(tokenPayload);
        expect(typeof newToken).toBe("string");
    });

    test('Should be called login method with authorization,email,password,userName,token parameters', () => {
        const authLoginSpy = authDatasource.login = jest.fn();

        const loginDto = {
            authorization: false,
            email: "test@gmail.com",
            password: "testPassword",
            userName: "test",
            token: "test token"
        } as LoginDto;

        authDatasource.login(loginDto);

        expect(authLoginSpy).toHaveBeenCalledWith(loginDto);
    });

    test('Should be called register method with authorization,email,password,userName,token parameters', () => {
        const authRegisterSpy = authDatasource.register = jest.fn();

        const registerDto: RegisterDto = {
            authorization: false,
            password: "testPassword",
            confirmPassword: "testPassword",
            email: "test@gmail.com",
            userName: "test",
            lastName: "test2000",
        };
        
        authDatasource.register(registerDto);

        expect(authRegisterSpy).toHaveBeenCalledWith(registerDto);
    });

    test('Should be called refresh token method with a token', () => {
        const authRefreshTokenSpy = authDatasource.refreshToken = jest.fn();

        const token: string = "test-token";

        authDatasource.refreshToken(token);

        expect(authRefreshTokenSpy).toHaveBeenCalledWith(token);
    });
});