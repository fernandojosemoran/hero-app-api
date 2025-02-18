import rateLimit from "express-rate-limit";

export function rateLimitMiddleware() {
    return rateLimit({
        limit: 100,
        windowMs: 15 * 60 * 1000,
        // standardHeaders: "draft-8",
        // legacyHeaders: false,
        message: { response: "Request limit reached." }
    });
}