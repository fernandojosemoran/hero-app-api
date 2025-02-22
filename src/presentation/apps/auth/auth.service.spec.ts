import { User } from '../../../domain/entities/user.entity';

import LogService from '../../../../src/presentation/services/log.service';
import AuthService from "../auth/auth.service";
import LoginDto from "../../../domain/dto/auth/login.dto";
import RegisterDto from "../../../domain/dto/auth/register.dto";
import jwtPlugin from "../../../infrastructure/plugins/jwt.plugin";
import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import AuthDataSourceImpl from "../../../infrastructure/datasources/auth.datasource.impl";
import UUID from '../../../infrastructure/plugins/uui.plugin';
import EmailService from '../../services/email.service';
import EmailPlugin from '../../../infrastructure/plugins/email.plugin';
import Bcrypt from '../../../infrastructure/plugins/bcrypt.plugin';
import Env from '../../../infrastructure/constants/env';
import HttpError from '../../../infrastructure/errors/http-error';
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";
import DbDatasourceImpl from '../../../infrastructure/datasources/db.datasource.impl';

const logService: LogService = new LogService();
const jwt: jwtPlugin = new jwtPlugin(logService);
const uuid: UUID  = new UUID();
const email: EmailPlugin = new EmailPlugin();
const bcrypt: Bcrypt = new Bcrypt(logService);
const emailService: EmailService = new EmailService(email);
const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");
const authDatasource = new AuthDataSourceImpl(jwt, uuid, emailService, bcrypt, dbDatasource);

describe('./src/presentation/apps/auth/auth.service.ts', () => {

    let authRepository!: AuthRepositoryImpl;

    beforeEach(() => {
        jest.resetAllMocks();
        authRepository = new AuthRepositoryImpl(authDatasource);
    });

    test('Should contain login,register,refreshToken methods', () => {
        expect(typeof AuthService.prototype.login).toBe("function");
        expect(typeof AuthService.prototype.register).toBe("function");
        expect(typeof AuthService.prototype.refreshToken).toBe("function");
    });

    test('Should be called login method with authorization,email,password,userName,token parameters', () => {
        const authLoginMock = authRepository.login = jest.fn();

        const loginDto = {
            authorization: false,
            email: "test@gmail.com",
            password: "testPassword",
            userName: "test",
            token: "test token"
        } as LoginDto;

        authRepository.login(loginDto);

        expect(authLoginMock).toHaveBeenCalledWith(loginDto);
    });

    test('Should be called register method with authorization,email,password,userName,token parameters', () => {
        const authLoginMock = authRepository.register = jest.fn();

        const registerDto: RegisterDto = {
            authorization: false,
            password: "testPassword",
            confirmPassword: "testPassword",
            email: "test@gmail.com",
            userName: "test",
            lastName: "test2000",
        };

        authRepository.register(registerDto);

        expect(authLoginMock).toHaveBeenCalledWith(registerDto);
    });

    test('Should be called refresh token method with a token', () => {
        const authLoginMock = authRepository.refreshToken = jest.fn();

        const token: string = "test-token";

        authRepository.refreshToken(token);

        expect(authLoginMock).toHaveBeenCalledWith(token);
    });
    
    // REGISTER
    test("Should register a user", async () => {
        const sendRegisterEmailSpy = jest.spyOn(emailService, "sendRegisterEmail").mockImplementation(jest.fn());
        const bcryptHashSpy = jest.spyOn(bcrypt, "hash");
        const uuidV4Spy = jest.spyOn(uuid, "generateV4UUID");
        const adDatasourceAddMethodSpy = jest.spyOn(dbDatasource, "add").mockImplementation(() => Promise.resolve(true));
        const jwtGenerateTokenSpy = jest.spyOn(jwt, "generateToken");
        
        const dto: RegisterDto = {
            userName: "test1",
            lastName: "jest",
            password: "test123",
            confirmPassword: "test123",
            email: "test@gmail.com",
            authorization: true,
        };
    

        await authRepository.register(dto);
        
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
            expect.stringMatching(new RegExp(`^Confirm you account using by following link ${Env.HOST_URL}/account/authorization/.+`)),
            "Welcome to http://heroes-app.vercel"
        );

        expect(adDatasourceAddMethodSpy).toHaveBeenCalled();
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
            await authRepository.register(dto);
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
            await authRepository.register(dto);
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

        const login = await authRepository.login(dto);
        
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
            await authRepository.login(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            
            expect(message).toBe("User not exist");
            expect(status).toBe(HttpStatusCode.NOT_FOUND);
            
        }
    });

    test("Should throw a error if user not is authorized during the login", async () => {
        const dto: LoginDto = {
            userName: "test1",
            email: "test@gmail.com",
            password: "test123",
            authorization: false
        };

        dbDatasource.findByProperty = jest.fn(() => Promise.resolve({ id: "test-id", lastName: "test1", ...dto } as User));

        try {
            await authRepository.login(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            
            expect(message).toBe("You account don't are authorized, checkout you email service and confirm you account.");
            expect(status).toBe(HttpStatusCode.AUTHORIZED);
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
            await authRepository.login(dto);
        } catch (error) {
            const { message, status } = error as HttpError;
            
            expect(message).toBe("Password is not valid");
            expect(status).toBe(HttpStatusCode.AUTHORIZED);
            // await deleteUser(dto.email);
        }
    });

    // REFRESH TOKEN
    test("Should refresh a jwt token", async () => {
        const token: string = "test-token";
        const tokenPayload = { id: "testId", userName: "test1", lastName: "jest" };

        const jwtVerifyToken = jest.spyOn(jwt, "verifyToken").mockReturnValue(Promise.resolve(tokenPayload));
        const jwtGenerateToken = jest.spyOn(jwt, "generateToken").mockReturnValue(Promise.resolve(token));

        const newToken: string = await authRepository.refreshToken(token);

        expect(jwtVerifyToken).toHaveBeenCalledWith(token);
        expect(jwtGenerateToken).toHaveBeenCalledWith(tokenPayload);
        expect(typeof newToken).toBe("string");
    });
});