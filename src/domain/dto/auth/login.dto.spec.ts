/* eslint-disable @typescript-eslint/no-explicit-any */
import LoginDto from "./login.dto";


describe('./src/domain/dto/auth/login.dto.ts', () => {
    const user: any = {
        userName: "test1",
        email: "test@gmail.com",
        password: "test123",
        token: ""
    };

    test("Should contain a property create", () => {
        expect(LoginDto).toHaveProperty("create");
    });

    test("Should be a method the create property", () => {
        expect(typeof LoginDto.create).toBe("function");
    });

    test('Should return an error if userName is undefined', () => {
        const [ , error ] = LoginDto.create({ ...user, userName: "" });

        expect(error).toBe("User is required.");
    });

    test('Should return an error if email is undefined', () => {
        const [ , error ] = LoginDto.create({ ...user, email: "" });

        expect(error).toBe("Email is required.");
    });

    test('Should return an error if email is invalid', () => {
        const [ , error ] = LoginDto.create({ ...user, email: "jest" });

        expect(error).toBe("Email field is not valid.");
    });

    test('Should return an error if password is undefined', () => {
        const [ , error ] = LoginDto.create({ ...user, password: "" });

        expect(error).toBe("Password is required.");
    });
});