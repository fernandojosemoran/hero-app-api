import LoginDto from "../../domain/dto/auth/login.dto";
import RegisterDto from "../../domain/dto/auth/register.dto";
import EmailService from "../../presentation/services/email.service";
import LogService from "../../presentation/services/log.service";
import AuthDataSourceImpl from "../datasources/auth.datasource.impl";
import DbDatasourceImpl from "../datasources/db.datasource.impl";
import Bcrypt from "../plugins/bcrypt.plugin";
import EmailPlugin from "../plugins/email.plugin";
import jwtPlugin from "../plugins/jwt.plugin";
import UUID from "../plugins/uui.plugin";
import AuthRepositoryImpl from "./auth.repository.impl";


describe('./src/infrastructure/repositories/auth.repository.impl.ts', () => {
    const logService: LogService = new LogService();
    const jwt: jwtPlugin = new jwtPlugin(logService);
    const uuid: UUID  = new UUID();
    const email: EmailPlugin = new EmailPlugin();
    const bcrypt: Bcrypt = new Bcrypt(logService);
    const emailService: EmailService = new EmailService(email);
    const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");

    const datasource: AuthDataSourceImpl = new AuthDataSourceImpl(jwt,uuid,emailService,bcrypt,dbDatasource);
    const repository: AuthRepositoryImpl = new AuthRepositoryImpl(datasource);

    test('Should have properties like login, register, refreshToken', () => {
        expect(repository).toHaveProperty("login");
        expect(repository).toHaveProperty("register");
        expect(repository).toHaveProperty("refreshToken");
    });

    test('Should login, register, refreshToken be methods', () => {
        expect(typeof repository.login).toBe("function");
        expect(typeof repository.register).toBe("function");
        expect(typeof repository.refreshToken).toBe("function");
    });

    test('Should call login method with LoginDto', () => {
        const loginDatasourceSpy = jest.spyOn(datasource, "login").mockImplementation(jest.fn());
        const loginRepositorySpy = jest.spyOn(repository, "login");

        const dto: LoginDto = {
            userName: "test",
            email: "test@gmail.com",
            password: "test123",
            authorization: true
        };

        repository.login(dto);

        expect(loginDatasourceSpy).toHaveBeenCalledWith(dto);
        expect(loginRepositorySpy).toHaveBeenCalledWith(dto);
    });

    test('Should call register method with RegisterDto', () => {
        const registerDatasourceSpy = jest.spyOn(datasource, "register").mockImplementation(jest.fn());
        const registerRepositorySpy = jest.spyOn(repository, "register");

        const dto: RegisterDto = {
            userName: "test",
            lastName: "jest",
            email: "test@gmail.com",
            password: "test123",
            confirmPassword: "test123",
            authorization: true
        };

        repository.register(dto);

        expect(registerDatasourceSpy).toHaveBeenCalledWith(dto);
        expect(registerRepositorySpy).toHaveBeenCalledWith(dto);
    });

    test('Should call logout method with a jwt token', () => {
        const token: string = "test-token";

        const refreshTokenDatasourceSpy = jest.spyOn(datasource, "refreshToken").mockImplementation(jest.fn());
        const refreshTokenRepositorySpy = jest.spyOn(repository, "refreshToken");

        repository.refreshToken(token);

        expect(refreshTokenDatasourceSpy).toHaveBeenCalledWith(token);
        expect(refreshTokenRepositorySpy).toHaveBeenCalledWith(token);
    });
});