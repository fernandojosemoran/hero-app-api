import LogService from '../../../../src/presentation/services/log.service';
import AuthService from "../auth/auth.service";
import LoginDto from "../../../domain/dto/auth/login.dto";
import RegisterDto from "../../../domain/dto/auth/register.dto";
import jwtPlugin from "../../../infrastructure/plugins/jwt.plugin";
import EmailService from '../../services/email.service';
import EmailPlugin from '../../../infrastructure/plugins/email.plugin';
import Bcrypt from '../../../infrastructure/plugins/bcrypt.plugin';
import UUID from '../../../infrastructure/plugins/uui.plugin';

import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import AuthDataSourceImpl from "../../../infrastructure/datasources/auth.datasource.impl";
import DbDatasourceImpl from '../../../infrastructure/datasources/db.datasource.impl';

const logService: LogService = new LogService();
const jwt: jwtPlugin = new jwtPlugin(logService);
const uuid: UUID  = new UUID();
const email: EmailPlugin = new EmailPlugin();
const bcrypt: Bcrypt = new Bcrypt(logService);
const emailService: EmailService = new EmailService(email);
const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");
const authDatasource = new AuthDataSourceImpl(jwt, uuid, emailService, bcrypt, dbDatasource);
const authRepository: AuthRepositoryImpl = new AuthRepositoryImpl(authDatasource);


describe('./src/presentation/apps/auth/auth.service.ts', () => {
    const authService: AuthService = new AuthService(authRepository);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Should have properties like register, login, and refreshToken', () => { 
        expect(authService).toHaveProperty("login"); 
        expect(authService).toHaveProperty("register");  
        expect(authService).toHaveProperty("refreshToken");     
    });

    test('Should have register, login, and refreshToken as methods', () => { 
        expect(typeof authService.login).toBe("function"); 
        expect(typeof authService.register).toBe("function");  
        expect(typeof authService.refreshToken).toBe("function");     
    });

    test('Should call login method with LoginDto', async () => { 
        const loginMock = authService.login = jest.fn();

        const dto = {
            userName: "test", 
            email: "test@gmail.com",
            password: "test123",
            authorization: true
        } as LoginDto;   

        await authService.login(dto);

        expect(loginMock).toHaveBeenCalledWith(dto);
    });

    test('Should call register method with RegisterDto', async () => { 
        const registerMock = authService.register = jest.fn();

        const dto = {
            userName: "test", 
            lastName: "jest",
            email: "test@gmail.com",
            password: "test123",
            confirmPassword: "test123",
            authorization: true,
        } as RegisterDto;   

        await authService.register(dto);

        expect(registerMock).toHaveBeenCalledWith(dto);
    });
});