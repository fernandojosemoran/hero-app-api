import env from "env-var";
import dotenv from "dotenv";

dotenv.config();

class Env {
    public static readonly PORT: number = env.get("PORT").required().default(5000).asPortNumber();
    public static readonly DEBUG: boolean = env.get("DEBUG").default("false").asBool();
    public static readonly WHITE_LIST_ALLOWED_HOSTS_DEV: string[] = env.get("WHITE_LIST_ALLOWED_HOSTS_DEV").required().asArray();
    public static readonly WHITE_LIST_ALLOWED_HOSTS_PROD: string[] = env.get("WHITE_LIST_ALLOWED_HOSTS_PROD").required().asArray();
    public static readonly HOST_URL: string = env.get("HOST_URL").required().asUrlString();
    public static readonly JWT_SECRET_KEY: string = env.get("JWT_SECRET_KEY").required().asString();
    public static readonly COOKIE_SECRET_KEY: string = env.get("COOKIE_SECRET_KEY").required().asString();
    public static readonly MAILER_SERVICE: string = env.get("MAILER_SERVICE").required().asString();
    public static readonly MAILER_EMAIL: string = env.get("MAILER_EMAIL").required().asString();
    public static readonly MAILER_SECRET_KEY: string = env.get("MAILER_SECRET_KEY").required().asString();
}

export default Env;