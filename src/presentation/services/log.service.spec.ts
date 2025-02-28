import LogService from '../../../src/presentation/services/log.service';

describe('./src/presentation/services/log.service.ts', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Should have properties like infoLog, errorLog', () => {
        expect(LogService.prototype).toHaveProperty("errorLog");
        expect(LogService.prototype).toHaveProperty("infoLog");
    });

    test('Should have like infoLog, errorLog as methods', () => {
        expect(typeof LogService.prototype.errorLog).toBe("function");
        expect(typeof LogService.prototype.infoLog).toBe("function");
    });

    test("Should call infoLog method with log, origin, show arguments", () => {
        const logService: LogService = new LogService();

        const params = {
            log: "test info log",
            origin: "test origin",
            show: false
        };

        const infoLogSmock = logService.infoLog = jest.fn();

        logService.infoLog(params.log, params.origin, params.show);

        expect(infoLogSmock).toHaveBeenCalledWith(params.log, params.origin, params.show);
    });

    test("Should call errorLog method with log, origin, show arguments", () => {
        const logService: LogService = new LogService();

        const params = {
            log: "test error log",
            origin: "test origin",
            show: false
        };

        const errorLogSmock = logService.errorLog = jest.fn();

        logService.errorLog(params.log, params.origin, params.show);

        expect(errorLogSmock).toHaveBeenCalledWith(params.log, params.origin, params.show);
    });
});