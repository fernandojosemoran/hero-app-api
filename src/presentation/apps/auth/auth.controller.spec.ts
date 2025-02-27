import { User } from "../../../domain/entities/user.entity";

import AuthDataSourceImpl from "../../../infrastructure/datasources/auth.datasource.impl";
import DbDatasourceImpl from "../../../infrastructure/datasources/db.datasource.impl";
import Bcrypt from "../../../infrastructure/plugins/bcrypt.plugin";
import Email from "../../../infrastructure/plugins/email.plugin";
import Jwt from "../../../infrastructure/plugins/jwt.plugin";
import UUID from "../../../infrastructure/plugins/uui.plugin";
import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import EmailService from "../../services/email.service";
import LogService from "../../services/log.service";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import Server from "../../../server";
import ConfigApp from "../../../../config-app";
import RouterApp from "../../../router-app";
import HttpStatusCode from "../../../infrastructure/helpers/http-status-code";
import request from "supertest";

interface IRegister {
    userName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ILogin {
    userName: string;
    email: string;
    password: string;
}

// interface ITokenPayload {
//     id: string;
//     userName: string;
//     lastName: string;
// }

// interface ITokenDecode extends ITokenPayload {
//     iat: number;
//     exp: number;
// }

describe('./src/presentation/apps/auth/auth.controller.ts', () => {
    let logService: LogService;
    let bcrypt: Bcrypt;
    let uuidPlugin: UUID;
    let jwtPlugin: Jwt;
    let emailService: EmailService;
    let dbDatasource: DbDatasourceImpl;
    let authDatasource: AuthDataSourceImpl;
    let authRepository: AuthRepositoryImpl;
    let authService: AuthService;
    let controller!: AuthController;

    const server: Server = new Server(ConfigApp, RouterApp);

    const user: User = {
        id: "test-id",
        userName: "test",
        lastName: "jest",
        email: "test@gmail.com",
        password: "test123",
        authorization: true
    };

    let cookieLogin: string;

    beforeAll(() => server.start());

    afterAll(async () => {
        const usr = await dbDatasource.findByProperty({ property: "email", value: user.email }) as User | undefined;
        await dbDatasource.delete(usr?.id ?? user.id);

        await server.stop();
    });

    afterEach(() => {
        emailService.sendAuthorizedAccountEmail = jest.fn();
        emailService.sendRegisterEmail = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();

        logService = new LogService();
        bcrypt = new Bcrypt(logService);
        uuidPlugin = new UUID();
        jwtPlugin = new Jwt(logService);
        emailService = new EmailService(new Email());
        dbDatasource = new DbDatasourceImpl("user");
        authDatasource = new AuthDataSourceImpl(jwtPlugin, uuidPlugin, emailService, bcrypt, dbDatasource );
        authRepository = new AuthRepositoryImpl(authDatasource);
        authService = new AuthService(authRepository);
        
        controller = new AuthController(authService, logService);
    });

    test('Should contain properties like login, register, logout, refreshToken', () => {
        expect(controller).toHaveProperty("login");
        expect(controller).toHaveProperty("register");
        expect(controller).toHaveProperty("logout");
        expect(controller).toHaveProperty("refreshToken");
    });

    test('Should be methods the login, register, logout, refreshToken properties', () => {
        expect(typeof controller.login).toBe("function");
        expect(typeof controller.logout).toBe("function");
        expect(typeof controller.refreshToken).toBe("function");
        expect(typeof controller.register).toBe("function");
    });

    // REGISTER

    test("Should register an user with endPoint POST -> /api/auth/register", async () => {
        const register: IRegister = { ...user, confirmPassword: user.password };
    
        const response = await request(server.server)
        .post("/api/auth/register")
        .set("User-Agent", "HeroesApp")
        .send(register)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CREATED);

        expect(response.body).toEqual({ response: true });
    });

    test("Should response an error if user already exist with endPoint POST -> /api/auth/register", async () => {
        const register: IRegister = { ...user, confirmPassword: user.password };
    
        const response = await request(server.server)
        .post("/api/auth/register")
        .set("User-Agent", "HeroesApp")
        .send(register)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CONFLICT);
        
        expect(response.body).toEqual({ response: "user has already a account." });
    });

    test("Should response an error if password don't went hashed with endPoint POST -> /api/auth/register", async () => {
        const register: IRegister = { ...user, confirmPassword: user.password, email: "jasmine@gmail.com" };
    
        jest.spyOn(Bcrypt.prototype, "hash").mockImplementation(() => Promise.resolve(undefined));

        const response = await request(server.server)
        .post("/api/auth/register")
        .set("User-Agent", "HeroesApp")
        .send(register)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "Sorry something occurred wrong" });
    });

    test("Should response an error if jwt don't went generated with endPoint POST -> /api/auth/register", async () => {
        const register: IRegister = { ...user, confirmPassword: user.password, email: "jasmine@gmail.com" };
    
        jest.spyOn(Jwt.prototype, "generateToken").mockImplementation(() => Promise.resolve(undefined));

        const response = await request(server.server)
        .post("/api/auth/register")
        .set("User-Agent", "HeroesApp")
        .send(register)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "Sorry something occurred wrong" });
    });

    test("Should response an error if user don't went saved with endPoint POST -> /api/auth/register", async () => {
        const register: IRegister = { ...user, confirmPassword: user.password, email: "jasmine@gmail.com" };
    
        DbDatasourceImpl.prototype.add = jest.fn(() => Promise.resolve(false));
    
        const response = await request(server.server)
        .post("/api/auth/register")
        .set("User-Agent", "HeroesApp")
        .send(register)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "Sorry something occurred wrong" });
    });

    // LOGIN

    test("Should responder with a token and user with endPoint POST -> /api/auth/login", async () => {
        const { userName, email, password }: ILogin = user;

        Jwt.prototype.generateToken = jest.fn(() => Promise.resolve("Token"));

        const response = await request(server.server)
        .post("/api/auth/login")
        .set("User-Agent", "HeroesApp")
        .send({ userName, email, password })
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);

        expect(response.headers["x-powered-by"]).toBe("HeroesApp");
        expect(response.headers["set-cookie"][0]).toMatch(/^([\w-]+)=([\w.-]+); Max-Age=\d+; Path=\/; Expires=[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT; HttpOnly; SameSite=Lax$/);

        cookieLogin = response.headers["set-cookie"][0];

        // console.warn({ cookieLogin, cookieLoginSplit: cookieLogin.split(";")[0] });

        expect(response.body).toEqual({
             response: {
                 id: expect.any(String), 
                 userName, 
                 email, 
                 lastName: user.lastName 
            } 
        });
    });

    test("Should responder an error if user not found with endPoint POST -> /api/auth/login ", async () => {
        const { userName, password }: ILogin = user;

        const response = await request(server.server)
        .post("/api/auth/login")
        .set("User-Agent", "HeroesApp")
        .send({ userName, email: "jest@gmail.com", password })
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: "User not exist" });
    });

    test("Should responder an error if user password is not valid with endPoint POST -> /api/auth/login ", async () => {
        const { userName, email }: ILogin = user;

        const response = await request(server.server)
        .post("/api/auth/login")
        .set("User-Agent", "HeroesApp")
        .send({ userName, email, password: "jest2025" })
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.UNAUTHORIZED);

        expect(response.body).toEqual({ response: "Password is not valid" });
    });

    test("Should responder an error if jwt don't generated a token with endPoint POST -> /api/auth/login ", async () => {
        const { userName, email, password }: ILogin = user;

        Jwt.prototype.generateToken = jest.fn(() => Promise.resolve(undefined));

        const response = await request(server.server)
        .post("/api/auth/login")
        .set("User-Agent", "HeroesApp")
        .send({ userName, email, password })
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "Something occurred wrang, trying login again." });
    });

    // REFRESH TOKEN

    test("Should responder with a jwt toke with endPoint POST -> /api/auth/login ", async () => {
        const newToken: string = "new-token";

        const newTokenProperties = {
            id: "test-id",
            userName: user.userName,
            lastName: user.lastName
        };

        jest.spyOn(Jwt.prototype, "verifyToken").mockImplementation(jest.fn(() => Promise.resolve(newTokenProperties)));
        jest.spyOn(Jwt.prototype, "generateToken").mockImplementation(jest.fn(() => Promise.resolve(newToken)));
        
        const response = await request(server.server)
        .post("/api/auth/refresh-token")
        .set("Cookie", cookieLogin)
        .set("Authorization", "True")
        .set("User-Agent", "HeroesApp")
        .expect(HttpStatusCode.CREATED);

        expect(response.headers["x-powered-by"]).toBe("HeroesApp");
        expect(response.headers["set-cookie"][0]).toMatch(new RegExp(`^auth-token=${newToken}; Max-Age=\\d+; Path=\\/; Expires=[A-Za-z]{3}, \\d{2} [A-Za-z]{3} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT; HttpOnly; SameSite=Lax$`));
        expect(response.body).toEqual({ response: true });
    });

    test("Should responder an error if token is not valid with endPoint POST -> /api/auth/login ", async () => {

        const response = await request(server.server)
        .post("/api/auth/refresh-token")
        .set("Cookie", cookieLogin)
        .set("Authorization", "True")
        .set("User-Agent", "HeroesApp")
        .expect(HttpStatusCode.NOT_ACCEPTABLE);

        expect(response.body).toEqual({ response: "Token is not valid." });
    });

    test("Should responder an error if token is not valid with endPoint POST -> /api/auth/login ", async () => {
        const newTokenProperties = {
            id: "test-id",
            userName: user.userName,
            lastName: user.lastName
        };

        jest.spyOn(Jwt.prototype, "verifyToken").mockImplementation(jest.fn(() => Promise.resolve(newTokenProperties)));
        jest.spyOn(Jwt.prototype, "generateToken").mockImplementation(jest.fn(() => Promise.resolve(undefined)));

        const response = await request(server.server)
        .post("/api/auth/refresh-token")
        .set("Cookie", cookieLogin)
        .set("Authorization", "True")
        .set("User-Agent", "HeroesApp")
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "Something occurred wrang, trying login again." });
    });
});