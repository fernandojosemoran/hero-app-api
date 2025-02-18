import helmet from "helmet";

export function helmetMiddleware() {
    return helmet({
      crossOriginEmbedderPolicy: true,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
         directives: {
            "default-src": [ "'self'" ],
            "script-src": [ "'self'", "'unsafe-inline'" ],
            "script-src-attr": [ "'unsafe-inline'" ], // allowed frontend events like onclick etc.
            "img-src": [ "'self'", "*" ] // self is the option best recommended for the security of you system
          }
      }
   });
}
