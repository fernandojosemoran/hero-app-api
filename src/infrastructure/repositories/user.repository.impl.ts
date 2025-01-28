import AuthorizationAccountDto from "src/domain/dto/user/authorization-account.dto";
import ChangePasswordDto from "src/domain/dto/user/change-password.dto";
import UserRepository from "src/domain/repositories/user.repository";
import UserDataSourceImpl from "../datasources/user.datasource.impl";

class UserRepositoryImpl implements UserRepository {
    public constructor(private readonly _datasource: UserDataSourceImpl) {}

    public authorizationAccount(dto: AuthorizationAccountDto): Promise<boolean> {
        return this._datasource.authorizationAccount(dto);
    }
    public changePassword(dto: ChangePasswordDto): Promise<boolean> {
        return this._datasource.changePassword(dto);
    }
    public deleteAccount(): Promise<void> {
        return this._datasource.deleteAccount();
    }
}

export default UserRepositoryImpl;