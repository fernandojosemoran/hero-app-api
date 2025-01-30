import Env from "./src/infrastructure/constants/env";
import path from "path";

interface IConfigApp {
    rootDirPath: string;
    debug: boolean;
    port: number;
    staticFilesPath: string;
}

export class ConfigApp implements IConfigApp{
    public readonly rootDirPath: string = __dirname;
    public readonly debug: boolean = Env.DEBUG;
    public readonly port: number = Env.PORT;
    public readonly staticFilesPath: string = path.join(__dirname, "statics");
}

const configApp: ConfigApp = new ConfigApp();

export default configApp;