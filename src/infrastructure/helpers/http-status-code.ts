class HttpStatusCode {
    public static readonly OK: number = 200;
    public static readonly FOUND: number = 302;
    public static readonly CREATED: number = 201;
    public static readonly ACCEPTED: number = 202;

    public static readonly NOT_FOUND: number = 404;
    public static readonly INTERNAL_SERVER_ERROR: number = 500;
    public static readonly BAD_REQUEST: number = 400;
    public static readonly FORBIDDEN: number = 304;
    public static readonly AUTHORIZED: number = 401;
}

export default HttpStatusCode;