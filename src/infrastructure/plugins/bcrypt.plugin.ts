import bycript from "bcrypt";
import LogService from "src/presentation/services/log.service";

class Bcrypt {
    private readonly _contextPath: string = "./src/infrastructure/plugins/bcrypt.plugin.ts | compare()";
    private readonly _getSalt: number = 10;

    public constructor(private readonly _logService: LogService) {}

    public compare(plaintTextPassword: string, hash: string): Promise<boolean | undefined> {
        return new Promise((resolve) => {
            bycript.compare(plaintTextPassword, hash, (error, result) => {
                if (error) {
                    this._logService.errorLog(error, `${this._contextPath} | compare()`, true);
                    resolve(undefined);
                }

                resolve(result);
            });
        });
    }

    public hash(plaintTextPassword: string): Promise<string | undefined> {
        return new Promise((resolve) => {
            bycript.hash(plaintTextPassword, this._getSalt, (error, encode) => {
                if (error) {
                    // '$2b$10$UpD5dRhYEEcm7fJg5gZ.ae0pyvAOsRWKJlk5pu.xTtLr1EEgQqem6'
                    this._logService.errorLog(error, `${this._contextPath} | hash()`, true);
                    resolve(undefined);
                }

                resolve(encode);
            });
        });
    }
}

export default Bcrypt;