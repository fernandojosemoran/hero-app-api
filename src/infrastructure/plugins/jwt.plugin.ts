import LogService from "src/presentation/services/log.service";
import Env from "../constants/env";
import Plugin from "./plugin";
import jwt from "jsonwebtoken";



interface IJwtPlugin {
    generateToken(payload: string | Buffer | object): Promise<string | undefined>;
    verifyToken<T>(token: string): Promise<T | undefined>;
    decode(token: string): string | jwt.JwtPayload | null;
}

class Jwt extends Plugin implements IJwtPlugin {

    private readonly _contextName: string = "./src/infrastructure/plugins/jwt.plugin.ts";

    private readonly duration = {
        "1h": Math.floor(Date.now() / 1000) + (60 * 60)
    };

    private readonly _jwtSingConf: jwt.SignOptions = {
        expiresIn: this.duration["1h"]
    };

    private readonly _jwtDecodeConf: jwt.DecodeOptions = {
        json: true
    };

    public constructor(private readonly _logService: LogService) {
        super();
    }

    public decode(token: string): string | jwt.JwtPayload | null {
        return jwt.decode(token, this._jwtDecodeConf);
    }

    public generateToken(payload: string | Buffer | object): Promise<string | undefined> {
        return new Promise((resolve) => {
            jwt.sign(
                payload, 
                Env.JWT_SECRET_KEY, 
                this._jwtSingConf, 
                (error, encode) => {
                    if (error) {
                        this._logService.errorLog(error, `${this._contextName} | generateToken()`, true);
        
                        return resolve(undefined);
                    }
                    return resolve(encode!);
                }
            ); 
        });
    }

    public verifyToken<T>(token: string): Promise<T | undefined> {
        return new Promise((resolve) => {
            jwt.verify(
                token, 
                Env.JWT_SECRET_KEY, 
                (error, decode) => {
                    if (error) {
                        this._logService.errorLog(error, `${this._contextName} | verifyToken()`);

                        return resolve(undefined);
                    }
                    

                    /*
                        decode object structure

                          decode: {
                            id: 'ac004f27-c0df-402f-a49b-9ccc98e8f948',
                            userName: 'fernando',
                            lastName: 'jose',
                            iat: 1738536452,
                            exp: 3477076405
                        }
                    */

                    return resolve(decode as T);
                }
            );
        });
    }
}

export default Jwt;