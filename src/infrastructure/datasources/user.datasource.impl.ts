import ChangePasswordDto from "../../domain/dto/user/change-password.dto";
import UserDataSource from "../../domain/datasources/user.datasource";
import AuthorizationAccountDto from "../../domain/dto/user/authorization-account.dto";
import DbDatasourceImpl from "./db.datasource.impl";
import Jwt from "../plugins/jwt.plugin";
import HttpError from "../errors/http-error";
import { User } from "../../../src/domain/entities/user.entity";

interface ITokenPayload {
    id: string;
    userName: string;
    lastName: string;
    iat: number;
    exp: number;
}

class UserDataSourceImpl implements UserDataSource{

    public constructor(
        private readonly _dbUser: DbDatasourceImpl,
        private readonly _jwt: Jwt
    ) {}
    
    public async authorizationAccount(dto: AuthorizationAccountDto): Promise<boolean> {
        const payload: ITokenPayload | undefined = await this._jwt.verifyToken<ITokenPayload>(dto.token);

        if (!payload) throw HttpError.unauthorized("You account don't can be authorized, try again or request a new token.");

        const user =  await this._dbUser.findOne(payload.id) as User | undefined;
        
        if (!user) throw HttpError.notFound("User not found, you don't have an account.");
        if (user.authorization) throw HttpError.conflict("You already have authorized account.");

        this._dbUser.update({ ...user, authorization: true } as User);

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