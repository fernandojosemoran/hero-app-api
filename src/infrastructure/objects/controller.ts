import { Response } from "express";
import LogService from "../../../src/presentation/services/log.service";
import HttpError from "../errors/http-error";
import HttpStatusCode from "../helpers/http-status-code";

class Controller {
    public constructor(
        protected readonly logService: LogService
    ) {}

    protected handlerResponseError(error: HttpError | Error, origin: string, response: Response) {
        if (!(error instanceof HttpError)) {
            this.logService.errorLog(error.message, origin, true);
            return response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ response: "Internal Server Error" });
        }

        return response.status(error.status).json({ response: error.message });
    }
    
}

export default Controller;