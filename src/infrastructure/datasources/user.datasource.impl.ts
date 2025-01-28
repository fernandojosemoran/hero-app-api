import ChangePasswordDto from "../../domain/dto/user/change-password.dto";
import UserDataSource from "../../domain/datasources/user.datasource";
import AuthorizationAccountDto from "../../domain/dto/user/authorization-account.dto";

class UserDataSourceImpl implements UserDataSource{
    
    public authorizationAccount(dto: AuthorizationAccountDto): Promise<boolean> {
        return Promise.resolve(true);
    }

    public changePassword(dto: ChangePasswordDto): Promise<boolean> {
        return Promise.resolve(true);
    }

    public deleteAccount(): Promise<void> {
        return Promise.resolve();
    }
}

export default UserDataSourceImpl;