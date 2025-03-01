import rateLimit from "express-rate-limit";
import Env from "../../infrastructure/constants/env";

export function rateLimitMiddleware() {
    return rateLimit({
        limit: Env.RATE_LIMIT,
        windowMs: 15 * 60 * 1000,
        // standardHeaders: "draft-8",
        // legacyHeaders: false,
        message: { response: "Request limit reached." }
    });
}