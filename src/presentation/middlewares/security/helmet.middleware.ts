import helmet from "helmet";
import Env from "../../../../src/infrastructure/constants/env";

export function helmetMiddleware() {
    return helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }, // allowed images of another domains
      contentSecurityPolicy: {
         directives: {
            "default-src": [ "'self'" ],
            "script-src": [ "'self'", "'unsafe-inline'" ],
            "script-src-attr": [ "'unsafe-inline'" ], // allowed frontend events like onclick etc.
            "img-src": [ "'self'", "*" ], // self is the option best recommended for the security of you system
            "connect-src": [ "'self'", ...Env.WHITE_LIST_ALLOWED_HOSTS_PROD, "wss:http://127.0.0.1:3000", "wss:http://127.0.0.1:3000" ],
            // "connect-src": [ "'self'", ...Env.WHITE_LIST_ALLOWED_HOSTS_PROD, "ws://<YOUR_WEBSOCKET_URL_HERE>", "wss://<YOUR_SECURE_WEBSOCKET_URL_HERE>" ],
         }
      }
   });
}
