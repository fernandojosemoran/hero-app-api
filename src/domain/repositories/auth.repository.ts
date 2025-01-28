import LoginDto from "../dto/auth/login.dto";
import RegisterDto from "../dto/auth/register.dto";

abstract class AuthRepository {
    abstract login(dto: LoginDto): Promise<string>;
    abstract register(dto: RegisterDto): void;
    abstract logout(): void;
    abstract refreshToken(token: string): void;
}

export default AuthRepository;