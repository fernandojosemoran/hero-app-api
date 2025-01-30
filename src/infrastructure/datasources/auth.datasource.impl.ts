import { User } from "../../domain/entities/user.entity";

import AuthDataSource from "../../domain/datasources/auth.datasource";
import LoginDto from "../../domain/dto/auth/login.dto";
import RegisterDto from "../../domain/dto/auth/register.dto";
import Jwt from "../plugins/jwt.plugin";
import userDB from "../../presentation/data/user.json";
import HttpError from "../errors/http-error";
import UUID from "../plugins/uui.plugin";
import EmailService from "../../presentation/services/email.service";
import fs from "fs";

interface ITokenPayload {
    id: string;
    userName: string;
    lastName: string;
}


class AuthDataSourceImpl implements AuthDataSource {
    private readonly _users: User[] = userDB.users;
    private readonly _userDbPath: string = "../../presentation/data/user.json";

    public constructor(
        private readonly _jwt: Jwt,
        private readonly _uuid: UUID,
        private readonly _email: EmailService
    ) {}

    public async login(dto: LoginDto): Promise<string> {
        const user: User | undefined = this._users.find(user => user.email === dto.email);

        if (!user) throw HttpError.notFound("User not exist");
        if (!user.authorization) throw HttpError.unauthorized("You account don't are authorized, checkout you email service and confirm you account.");

        const payload: ITokenPayload = { id: user.id, userName: user.userName, lastName: user.lastName };

        const token: string | undefined = await this._jwt.generateToken(payload);

        if (!token) throw HttpError.internalServerError("Something occurred wrang, trying login again.");

        return Promise.resolve(token);
    }

    public async register(dto: RegisterDto): Promise<void> {
        const userExist: User | undefined = this._users.find((user) => user.email === dto.email);
        
        if (userExist) throw HttpError.conflict("user has already a account.");

        const newUser: User = {
            id: this._uuid.generateV4UUID(),
            ...dto,
        };

        this._users.push(newUser);

        fs.writeFileSync(this._userDbPath, JSON.stringify({ users: this._users }), { encoding: "utf-8", mode: "w" });

        try {
            const verifyAccountToken: string | undefined = await this._jwt.generateToken({ id: userExist!.id,userName: userExist!.userName, lastName: userExist!.lastName });

            await this._email.sendRegisterEmail(
                userExist!.email, 
                `${userExist!.userName} ${userExist!.lastName}`,
                `Confirm you account using by following link http://127.0.0.1:3000/account/authorization/${verifyAccountToken}`,
                "Welcome to http://heroes-app.vercel"
            );
        } catch (error) {
            console.error(error);
            throw HttpError.internalServerError("Sorry something occurred wrong");
        }
    }

    public logout(): void {
        throw new Error("Method not implemented.");
    }

    public async refreshToken(token: string): Promise<string> {
        const oldToken: ITokenPayload | undefined = await this._jwt.verifyToken<ITokenPayload>(token);

        if (!oldToken) throw HttpError.notAcceptable("Token is not valid.");

        const newToken: string | undefined = await this._jwt.generateToken(oldToken);

        if (!newToken) throw HttpError.internalServerError("Something occurred wrang, trying login again.");

        return Promise.resolve(newToken);
    }
}

export default AuthDataSourceImpl;