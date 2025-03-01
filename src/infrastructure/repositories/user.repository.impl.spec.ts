import LogService from '../../presentation/services/log.service';
import UserRepositoryImpl from '../../infrastructure/repositories/user.repository.impl';
import DbDatasourceImpl from '../datasources/db.datasource.impl';
import UserDataSourceImpl from '../datasources/user.datasource.impl';
import Jwt from '../plugins/jwt.plugin';
import AuthorizationAccountDto from '../../domain/dto/user/authorization-account.dto';
import ChangePasswordDto from '../../domain/dto/user/change-password.dto';


describe('./src/infrastructure/repositories/user.repository.impl.ts', () => {
    const logService: LogService = new LogService();
    const jwtPlugin:  Jwt = new Jwt(logService);
    const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("user");
    const userDatasource: UserDataSourceImpl = new UserDataSourceImpl(dbDatasource, jwtPlugin);
    const repository: UserRepositoryImpl = new UserRepositoryImpl(userDatasource);

    test('Should have properties like authorizationAccount, changePassword, deleteAccount', () => {
        expect(repository).toHaveProperty("authorizationAccount");
        expect(repository).toHaveProperty("changePassword");
        expect(repository).toHaveProperty("deleteAccount");
    });

    test('Should login, register, refreshToken be methods', () => {
        expect(typeof repository.authorizationAccount).toBe("function");
        expect(typeof repository.changePassword).toBe("function");
        expect(typeof repository.deleteAccount).toBe("function");
    });

    test('Should call authorizationAccount method with AuthorizationAccountDto', () => {
        const repositoryAuthorizationAccountSpy = jest.spyOn(repository, "authorizationAccount");
        const datasourceAuthorizationAccountSpy = jest.spyOn(userDatasource, "authorizationAccount").mockImplementation(jest.fn());

        const dto: AuthorizationAccountDto = {
            token: "test-token"
        };

        repository.authorizationAccount(dto);

        expect(repositoryAuthorizationAccountSpy).toHaveBeenCalledWith(dto);
        expect(datasourceAuthorizationAccountSpy).toHaveBeenCalledWith(dto);
    });

    test('Should call changePassword method with ChangePasswordDto', () => {
        const repositoryChangePasswordSpy = jest.spyOn(repository, "changePassword");
        const datasourceChangePasswordSpy = jest.spyOn(userDatasource, "changePassword").mockImplementation(jest.fn());

        const dto: ChangePasswordDto = {
            oldPassword: "test123",
            newPassword: "jest123",
            confirmNewPassword: "jest123"
        };

        repository.changePassword(dto);

        expect(repositoryChangePasswordSpy).toHaveBeenCalledWith(dto);
        expect(datasourceChangePasswordSpy).toHaveBeenCalledWith(dto);
    });

    test('Should call deleteAccount method with DeleteAccountDto', () => {
        const repositoryChangePasswordSpy = jest.spyOn(repository, "deleteAccount");
        const datasourceChangePasswordSpy = jest.spyOn(userDatasource, "deleteAccount").mockImplementation(jest.fn());

        // TODO

        // const dto: ChangePasswordDto = {
        //     oldPassword: "test123",
        //     newPassword: "jest123",
        //     confirmNewPassword: "jest123"
        // };

        repository.deleteAccount();

        expect(repositoryChangePasswordSpy).toHaveBeenCalled();
        expect(datasourceChangePasswordSpy).toHaveBeenCalled();
    });
});