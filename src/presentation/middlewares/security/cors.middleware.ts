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
    methods?: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus?: number,
    origin?: CustomOrigin | StaticOrigin,
    preflightContinue?: boolean,
}

const origins: StaticOrigin = Env.DEBUG ? Env.WHITE_LIST_ALLOWED_HOSTS_PROD : Env.WHITE_LIST_ALLOWED_HOSTS_DEV;

const optionsCors: ICorsParams = { 
    origin: origins,
    optionsSuccessStatus: 200,  
};


export const corsMiddleware = () => cors(optionsCors);
