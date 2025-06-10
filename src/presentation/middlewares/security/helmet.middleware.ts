import helmet from "helmet";

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
            "connect-src": [ "'self'", "*" ],
            // "connect-src": [ "'self'", ...Env.WHITE_LIST_ALLOWED_HOSTS_PROD, "ws://<YOUR_WEBSOCKET_URL_HERE>", "wss://<YOUR_SECURE_WEBSOCKET_URL_HERE>" ],
         }
      }
   });
}
