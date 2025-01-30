import LoginDto from "../dto/auth/login.dto";
import RegisterDto from "../dto/auth/register.dto";

abstract class AuthRepository {
    abstract login(dto: LoginDto): Promise<string>;
    abstract register(dto: RegisterDto): Promise<void>;
    abstract logout(): void;
    abstract refreshToken(token: string): Promise<string>;
}

export default AuthRepository;