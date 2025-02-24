import LogService from "../../presentation/services/log.service";

class ServerError extends Error {
    private constructor(message: string) {
        new LogService().errorLog(message, "./src/presentation/server.ts");

        super(message);
    }

    public static instance(message: string): ServerError {
        return new ServerError(message);
    }

    public static startServer(message: string): ServerError {
        return new ServerError(message);
    }
}

export default ServerError;