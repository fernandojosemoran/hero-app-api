import cors from "cors";
import Env from "../../../../src/infrastructure/constants/env";


type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>;

type CustomOrigin = (
    requestOrigin: string | undefined,
    callback: (err: Error | null, origin?: StaticOrigin) => void,
) => void;

interface ICorsParams {
    allowedHeaders?: string | string[],
    credentials?: boolean,
    exposedHeaders?: string | string[],
    maxAge?: number,
    methods?: string,
    optionsSuccessStatus?: number,
    origin?: CustomOrigin | StaticOrigin,
    preflightContinue?: boolean,
}

const origins: StaticOrigin = Env.DEBUG ? Env.WHITE_LIST_ALLOWED_HOSTS_DEV : Env.WHITE_LIST_ALLOWED_HOSTS_PROD;

const optionsCors: ICorsParams = { 
    origin: (origin, callback) => {
        if (!origin || origins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    optionsSuccessStatus: 200,  
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: [ "Authorization", "Content-Type" ]
};


export const corsMiddleware = () => cors(optionsCors);
