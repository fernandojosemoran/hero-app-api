import { ILoginResponse } from "../../domain/responses/login-response";

import LoginDto from "../../domain/dto/auth/login.dto";
import RegisterDto from "../../domain/dto/auth/register.dto";
import AuthRepository from "../../domain/repositories/auth.repository";
import AuthDataSourceImpl from "../datasources/auth.datasource.impl";

class AuthRepositoryImpl implements AuthRepository {
    public constructor(private readonly datasource: AuthDataSourceImpl) {}

    public login(dto: LoginDto): Promise<ILoginResponse> {
        return this.datasource.login(dto);
    }
    public register(dto: RegisterDto): Promise<void> {
        return this.datasource.register(dto);
    }
    public refreshToken(token: string): Promise<string> {
        return this.datasource.refreshToken(token);
    }
}

export default AuthRepositoryImpl;