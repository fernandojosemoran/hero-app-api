import AuthDataSource from "../../domain/datasources/auth.datasource";
import LoginDto from "../../domain/dto/auth/login.dto";
import RegisterDto from "../../domain/dto/auth/register.dto";

class AuthDataSourceImpl implements AuthDataSource {
    public login(dto: LoginDto): Promise<string> {
        return Promise.resolve("");
    }

    public register(dto: RegisterDto): void {
        throw new Error("Method not implemented.");
    }

    public logout(): void {
        throw new Error("Method not implemented.");
    }

    public refreshToken(token: string): void {
        throw new Error("Method not implemented.");
    }
}

export default AuthDataSourceImpl;