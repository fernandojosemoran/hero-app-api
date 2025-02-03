import { User } from "../../domain/entities/user.entity";
import { ILoginResponse } from "../../domain/responses/login-response";

import AuthDataSource from "../../domain/datasources/auth.datasource";
import LoginDto from "../../domain/dto/auth/login.dto";
import RegisterDto from "../../domain/dto/auth/register.dto";
import Jwt from "../plugins/jwt.plugin";
import userDB from "../../presentation/data/user.json";
import HttpError from "../errors/http-error";
import UUID from "../plugins/uui.plugin";
import EmailService from "../../presentation/services/email.service";
import fs from "fs";
import path from "path";
import configApp from "../../../config-app";
import Bcrypt from "../plugins/bcrypt.plugin";
import Env from "../constants/env";

interface ITokenPayload {
    id: string;
    userName: string;
    lastName: string;
}

interface ITokenDecode extends ITokenPayload {
    iat: number;
    exp: number;
}

class AuthDataSourceImpl implements AuthDataSource {
    private readonly _users: User[] = userDB.users;
    private readonly _userDbPath: string = path.join(configApp.rootDirPath, "src/presentation/data/user.json");

    public constructor(
        private readonly _jwt: Jwt,
        private readonly _uuid: UUID,
        private readonly _email: EmailService,
        private readonly _bcrypt: Bcrypt
    ) {}

    public async login(dto: LoginDto): Promise<ILoginResponse> {
        const user: User | undefined = this._users.find(user => user.email === dto.email);

        if (!user) throw HttpError.notFound("User not exist");
        if (!user.authorization) throw HttpError.unauthorized("You account don't are authorized, checkout you email service and confirm you account.");

        const isValidPassword: boolean | undefined = await this._bcrypt.compare(dto.password, user.password);

        if (!isValidPassword) throw HttpError.unauthorized("Password is not valid");

        const payload: ITokenPayload = { id: user.id, userName: user.userName, lastName: user.lastName };

        const token: string | undefined = await this._jwt.generateToken(payload);

        if (!token) throw HttpError.internalServerError("Something occurred wrang, trying login again.");

        return Promise.resolve({
            token,
            id: user.id,
            userName: user.userName,
            lastName: user.lastName,
            email: user.email
        });
    }

    public async register(dto: RegisterDto): Promise<void> {
        const userExist: User | undefined = this._users.find((user) => user.email === dto.email);
        
        if (userExist) throw HttpError.conflict("user has already a account.");

        const hashPassword: string | undefined = await this._bcrypt.hash(dto.password);

        if (!hashPassword) throw HttpError.internalServerError("Sorry something occurred wrong");

        const newUser: User = {
            id: this._uuid.generateV4UUID(),
            password: hashPassword,
            authorization: dto.authorization,
            email: dto.email,
            lastName: dto.lastName,
            userName: dto.userName
        };

        this._users.push(newUser);
        
        try {
            const verifyAccountToken: string | undefined = await this._jwt.generateToken({ id: newUser.id,userName: newUser.userName, lastName: newUser.lastName });

            await this._email.sendRegisterEmail(
                "fernandomoran323@gmail.com", 
                `${newUser!.userName} ${newUser!.lastName}`,
                `Confirm you account using by following link ${Env.HOST_URL}/account/authorization/${verifyAccountToken}`,
                "Welcome to http://heroes-app.vercel"
            );

            fs.writeFileSync(this._userDbPath, JSON.stringify({ users: this._users }, null, 4), { encoding: "utf-8", flag: "w" });

        } catch (error) {
            console.error(error);
            throw HttpError.internalServerError("Sorry something occurred wrong");
        }
    }

    public async refreshToken(token: string): Promise<string> {
        const oldToken: ITokenDecode | undefined = await this._jwt.verifyToken<ITokenDecode>(token);
        
        if (!oldToken) throw HttpError.notAcceptable("Token is not valid.");

        const newToken: string | undefined = await this._jwt.generateToken({
             id: oldToken.id,
             userName: oldToken.userName,
             lastName: oldToken.lastName
        });

        if (!newToken) throw HttpError.internalServerError("Something occurred wrang, trying login again.");

        return Promise.resolve(newToken);
    }
}

export default AuthDataSourceImpl;