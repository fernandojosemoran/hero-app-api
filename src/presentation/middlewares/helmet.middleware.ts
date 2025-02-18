import helmet from "helmet";

export function helmetMiddleware() {
    return helmet({
      crossOriginEmbedderPolicy: true,
      crossOriginResourcePolicy: false
   });
}
