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

describe('./src/presentation/apps/auth/auth.controller.ts', () => {
    const logService: LogService = new LogService();
    const bcrypt: Bcrypt = new Bcrypt(logService);
    const uuidPlugin: UUID = new UUID();
    const jwtPlugin: Jwt = new Jwt(logService);
    const emailService: EmailService = new EmailService(new Email());
    const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");
    const datasource: AuthDataSourceImpl = new AuthDataSourceImpl(jwtPlugin, uuidPlugin, emailService, bcrypt, dbDatasource );
    const repository: AuthRepositoryImpl = new AuthRepositoryImpl(datasource);
    const authService: AuthService = new AuthService(repository);

    const server: Server = new Server(ConfigApp, RouterApp);

    const user: User = {
        id: "test-id",
        userName: "test",
        lastName: "jest",
        email: "test@gmail.com",
        password: "test123",
        authorization: true
    };

    let controller!: AuthController;

    beforeAll(() => server.start());

    afterAll(async () => {
        const usr = await dbDatasource.findByProperty({ property: "email", value: user.email }) as User | undefined;
        await dbDatasource.delete(usr?.id ?? user.id);

        await server.stop();
    });

    beforeEach(() => {
        jest.clearAllMocks();
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

    test("Should register a user with endPoint POST -> /api/auth/register", async () => {
        const register: IRegister = { ...user, confirmPassword: user.password };
    
        const response = await request(server.server)
        .post("/api/auth/register")
        .set("User-Agent", "HeroesApp")
        .send(register)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CREATED);

        expect(response.body).toEqual({ response: true });
    });

    // LOGIN

    test("Should responder with a token and user the login method", async () => {
        const { userName, email, password }: ILogin = user;

        const response = await request(server.server)
        .post("/api/auth/login")
        .set("User-Agent", "HeroesApp")
        .send({ userName, email, password })
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);

        expect(response.headers["x-powered-by"]).toBe("HeroesApp");
        expect(response.headers["set-cookie"][0]).toMatch(/^([\w-]+)=([\w.-]+); Max-Age=\d+; Path=\/; Expires=[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT; HttpOnly; SameSite=Lax$/);

        expect(response.body).toEqual({
             response: {
                 id: expect.any(String), 
                 userName, 
                 email, 
                 lastName: user.lastName 
            } 
        });
    });

    // REFRESH TOKEN
});