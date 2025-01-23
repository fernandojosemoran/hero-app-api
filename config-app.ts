import Env from "./src/infrastructure/constants/env";

class ConfigApp {
    public static readonly rootDirPath: string = __dirname; 
    public static readonly debug: boolean = Env.DEBUG;
}

export default ConfigApp;