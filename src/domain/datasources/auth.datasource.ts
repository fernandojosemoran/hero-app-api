import LoginDto from "../dto/auth/login.dto";
import RegisterDto from "../dto/auth/register.dto";
import { ILoginResponse } from "../responses/login-response";

abstract class AuthDataSource {
    abstract login(dto: LoginDto): Promise<ILoginResponse>;
    abstract register(dto: RegisterDto): void;
    abstract refreshToken(token: string): void;
}

export default AuthDataSource;