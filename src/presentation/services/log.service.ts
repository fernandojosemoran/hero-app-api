import fs from "fs";
import Env from "../../../src/infrastructure/constants/env";

export type LogType = "info" | "error";

interface ILog {
    level: LogType,
    log: string | Error;
    origin?: string;
    createAt: string;
}

interface ILayerLogService {
    infoLog: (log: string, origin?: string, show?: boolean) => void;
    errorLog: (log: string | Error, origin?: string, show?: boolean) => void;
}

class LogService implements ILayerLogService {
    private readonly mainFolderName: string = "logs";
    private readonly infoLogsFileName: string = "infoLogs.log";
    private readonly errorLogsFileName: string = "errorLogs.log";

    private verifyMainFolder(): void {
        if (!fs.existsSync(this.mainFolderName)) fs.mkdirSync(this.mainFolderName);
    }

    private formatLog(log: string | Error, level: "info" | "error", origin?: string): string {
        const logEntry: ILog = {
            level,
            log,
            origin,
            createAt: new Date().toISOString(),
        };

        return JSON.stringify(logEntry);
    }

    private appendLog(filePath: string, logEntry: string): void {
        fs.appendFileSync(filePath, `${logEntry}\n`, "utf-8");
    }

    public infoLog(log: string, origin?: string, show: boolean = false): void {
        if (Env.MODE_TEST) return;
        
        this.verifyMainFolder();

        const infoLogsPath: string = `${this.mainFolderName}/${this.infoLogsFileName}`;
        const logEntry: string = this.formatLog(log, "info", origin);

        this.appendLog(infoLogsPath, logEntry);

        if (show) console.info(log);
    }

    public errorLog(log: string | Error, origin?: string, show: boolean = false): void {
        if (Env.MODE_TEST) return;

        this.verifyMainFolder();

        const errorLogsPath: string = `${this.mainFolderName}/${this.errorLogsFileName}`;
        const logEntry: string = this.formatLog(log, "error", origin);

        this.appendLog(errorLogsPath, logEntry);

        if (show) console.error(log);
    }
}

export default LogService;
