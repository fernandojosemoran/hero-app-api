import AuthorizationAccountDto from "../dto/user/authorization-account.dto";
import ChangePasswordDto from "../dto/user/change-password.dto";

abstract class UserDataSource {
    abstract authorizationAccount(dto: AuthorizationAccountDto): Promise<boolean>;
    abstract changePassword(dto: ChangePasswordDto): Promise<boolean>;
    abstract deleteAccount(): Promise<void>
}

export default UserDataSource;