import RegisterDto from "../../../domain/dto/auth/register.dto";
import AuthRepositoryImpl from "../../../infrastructure/repositories/auth.repository.impl";
import LoginDto from "../../../domain/dto/auth/login.dto";
import { ILoginResponse } from "../../../domain/responses/login-response";

interface IAuthService {
    login(dto: LoginDto): Promise<ILoginResponse>;
    register(dto: RegisterDto): Promise<void>;
    refreshToken(token: string): Promise<string>;
}

class AuthService implements IAuthService {

    public constructor(
        private readonly _repository: AuthRepositoryImpl,
    ) {}

    public login(dto: LoginDto): Promise<ILoginResponse> {
        return this._repository.login(dto);
    };

    public register(dto: RegisterDto): Promise<void> {
        return this._repository.register(dto);
    };

    public refreshToken(token: string): Promise<string> {
        return this._repository.refreshToken(token);
    };
}

export default AuthService;