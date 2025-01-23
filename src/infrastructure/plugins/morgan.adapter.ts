import morgan from "morgan";
import LogService from "../../presentation/services/log.service";

const logService: LogService = new LogService();

const morganStreamOptions = {
    stream: { 
        write: (str: string) => {
            logService.infoLog(str, "./src/server.ts | morganMiddleware");
            console.info(str);
        },
    }
};

export const morganMiddleware = () => morgan("common", morganStreamOptions);
