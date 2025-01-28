import { User } from "../../../domain/entities/user.entity";

import RegisterDto from "../../../domain/dto/auth/register.dto";
import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import LoginDto from "../../../domain/dto/auth/login.dto";
import HttpError from "../../../infrastructure/errors/http-error";
import db from "../../../presentation/data/user.json";

interface IAuthService {
    login(dto: LoginDto): Promise<string>;
    register(dto: RegisterDto): Promise<void>;
    logout(): Promise<void>;
    refreshToken(token: string): Promise<void>;
}

class AuthService implements IAuthService {
    private readonly _users: User[] = db.users as User[];

    public constructor(private readonly _repository: AuthRepositoryImpl) {}

    public login(dto: LoginDto): Promise<string> {
        const userExist: User | undefined = this._users.find((user) => user.email === dto.email);
        
        if (!userExist) throw HttpError.notFound("User not exist");
        if (!dto.authorization) throw HttpError.unauthorized("You account isn't authenticated, checkout your email service and verify your.");
        
        this._repository.login(dto);

        return Promise.resolve("");
    };

    public register(dto: RegisterDto): Promise<void> {

        const userExist: User | undefined = this._users.find((user) => user.email === dto.email);
        
        if (userExist) throw HttpError.conflict("user has already a account.");

        this._repository.register(dto);

        return Promise.resolve();
    };

    public logout(): Promise<void> {
        return Promise.resolve();
    };

    public refreshToken(token: string): Promise<void> {
        this._repository.refreshToken(token);

        return Promise.resolve();
    };
}

export default AuthService;