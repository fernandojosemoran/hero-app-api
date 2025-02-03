import LoginDto from "../dto/auth/login.dto";
import RegisterDto from "../dto/auth/register.dto";
import { ILoginResponse } from "../responses/login-response";

abstract class AuthRepository {
    abstract login(dto: LoginDto): Promise<ILoginResponse>;
    abstract register(dto: RegisterDto): Promise<void>;
    abstract refreshToken(token: string): Promise<string>;
}

export default AuthRepository;