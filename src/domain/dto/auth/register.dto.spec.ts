/* eslint-disable @typescript-eslint/no-explicit-any */

import RegisterDto from "./register.dto";

describe('./src/domain/dto/auth/register.dto.ts', () => {    
    const register: any = {
        userName: "test1",
        lastName: "jest",
        email: "test@gmail.com",
        password: "test123",
        confirmPassword: "test123"
    };

    test('Should contain a create property', () => {
        expect(RegisterDto).toHaveProperty("create");
    });

    test('Should be a method the create property', () => {
        expect(typeof RegisterDto.create).toBe("function");
    });

    test('Should return an error if userName is empty', () => {
        const [ , error ] = RegisterDto.create({ ...register, userName: "" });

        expect(error).toBe("User name is required.");
    });

    test('Should return an error if lastName is empty', () => {
        const [ , error ] = RegisterDto.create({ ...register, lastName: "" });

        expect(error).toBe("Last name is required.");
    });

    test('Should return an error if email is empty', () => {
        const [ , error ] = RegisterDto.create({ ...register, email: "" });

        expect(error).toBe("Email is required.");
    });

    test('Should return an error if email is invalid', () => {
        const [ , error ] = RegisterDto.create({ ...register, email: "jest" });

        expect(error).toBe("Email field is invalid.");
    });

    test('Should return an error if password is empty', () => {
        const [ , error ] = RegisterDto.create({ ...register, password: "" });

        expect(error).toBe("Password is required.");
    });

    test('Should return an error if confirm password is empty', () => {
        const [ , error ] = RegisterDto.create({ ...register, confirmPassword: "" });

        expect(error).toBe("Confirm password is required.");
    });

    test('Should return an error if password and confirm password no match', () => {
        const [ , error ] = RegisterDto.create({ ...register, confirmPassword: "jest" });

        expect(error).toBe("Confirm password no match.");
    });

    test('Should return a valid register dto with correct properties when arguments are valid', () => {
        const [ dto ,  ] = RegisterDto.create(register);

        expect(dto).not.toBeUndefined();
        expect(dto).toHaveProperty("userName");
        expect(dto).toHaveProperty("lastName");
        expect(dto).toHaveProperty("password");
        expect(dto).toHaveProperty("confirmPassword");
        expect(dto).toHaveProperty("email");
    });
});