import LogService from "../../presentation/services/log.service";

class ServerErrors extends Error {
    private constructor(message: string) {
        new LogService().errorLog(message, "./src/presentation/server.ts");

        super(message);
    }

    public static instance(message: string): void {
        new ServerErrors(message);
    }

    public static startServer(message: string): void {
        new ServerErrors(message);
    }
}

export default ServerErrors;