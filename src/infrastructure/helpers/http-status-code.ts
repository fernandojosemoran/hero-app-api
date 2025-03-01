class HttpStatusCode {
    // successfully
    public static readonly OK: number = 200;
    public static readonly FOUND: number = 302;
    public static readonly CREATED: number = 201;
    public static readonly ACCEPTED: number = 202;

    //errors
    public static readonly CONFLICT: number = 409;
    public static readonly NOT_FOUND: number = 404;
    public static readonly INTERNAL_SERVER_ERROR: number = 500;
    public static readonly BAD_REQUEST: number = 400;
    public static readonly FORBIDDEN: number = 403;
    public static readonly UNAUTHORIZED: number = 401;
    public static readonly METHOD_NOT_ALLOWED: number = 405;
    public static readonly NOT_ACCEPTABLE: number = 406;
    public static readonly PROXY_AUTHENTICATION_REQUIRED: number = 407;
    public static readonly REQUEST_TIMEOUT: number = 408;
    public static readonly PAYMENT_REQUIRED: number = 402;
    public static readonly TOO_MANY_REQUESTS: number = 429;
}

export default HttpStatusCode;