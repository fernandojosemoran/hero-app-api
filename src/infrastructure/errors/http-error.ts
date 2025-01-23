class HttpError extends Error {

    private constructor(
        public readonly message: string,
        public readonly status: number
    ) {
        super(message);
    }

    public static internalServerError( message: string ): HttpError {
        return new HttpError(message, 500);
    }

    public static badRequest(message: string): HttpError {
        return new HttpError(message, 400);
    }

    public static notFound(message: string): HttpError {
        return new HttpError(message, 404);
    }

    public static unauthorized(message: string): HttpError {
        return new HttpError(message, 401);
    }

    public static paymentRequired(message: string): HttpError {
        return new HttpError(message, 402);
    }

    public static forbidden(message: string): HttpError {
        return new HttpError(message, 403);
    }

    public static methodNotAllowed(message: string): HttpError {
        return new HttpError(message, 405);
    }

    public static notAcceptable(message: string): HttpError {
        return new HttpError(message, 406);
    }

    public static proxyAuthenticationRequired(message: string): HttpError {
        return new HttpError(message, 407);
    }

    public static requestTimeout(message: string): HttpError {
        return new HttpError(message, 408);
    }

    public static conflict(message: string): HttpError {
        return new HttpError(message, 409);
    }
}

export default HttpError;