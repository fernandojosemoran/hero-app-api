import Env from "./env";

describe('./src/infrastructure/constants/env.ts', () => {
    test(`Should have ${Object.keys(Env).length} properties`, () => {
        expect(Object.keys(Env)).toHaveLength(13);
    });

    test('Should have system envs like PORT, DEBUG, HOST_URL, MODE_TEST, OWNER_TO_SEND_EMAIL_TEST', () => {
        expect(Env).toHaveProperty("PORT");
        expect(Env).toHaveProperty("DEBUG");
        expect(Env).toHaveProperty("MODE_TEST");
        expect(Env).toHaveProperty("OWNER_TO_SEND_EMAIL_TEST");
    });

    test('Should have lists allowed envs like WHITE_LIST_ALLOWED_HOSTS_DEV, WHITE_LIST_ALLOWED_HOSTS_PROD', () => {
        expect(Env).toHaveProperty("WHITE_LIST_ALLOWED_HOSTS_DEV");
        expect(Env).toHaveProperty("WHITE_LIST_ALLOWED_HOSTS_PROD");
    });

    test('Should have tokens envs like JWT_SECRET_KEY', () => {
        expect(Env).toHaveProperty("JWT_SECRET_KEY");
    });

    test('Should have cookies envs like COOKIE_SECRET_KEY', () => {
        expect(Env).toHaveProperty("COOKIE_SECRET_KEY");
    });
    
    test('Should have email envs like MAILER_SERVICE, MAILER_EMAIL, MAILER_SECRET_KEY', () => {
        expect(Env).toHaveProperty("MAILER_SERVICE");
        expect(Env).toHaveProperty("MAILER_EMAIL");
        expect(Env).toHaveProperty("MAILER_SECRET_KEY");
    });

    test('Should have rate limit envs like RATE_LIMIT', () => {
        expect(Env).toHaveProperty("RATE_LIMIT");
    });
});