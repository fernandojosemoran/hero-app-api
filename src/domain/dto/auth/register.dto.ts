import { User } from "../../../domain/entities/user.entity";

interface IRegisterDto extends User {
    confirmPassword: string;
}

class RegisterDto {

    private constructor(
        public readonly userName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly confirmPassword: string
    ){}

    private static validateEmail(email: string): boolean {
        const regex: string = "/^[a-zA-Z0-9]?@*.(gmail,yahoo).{com,es}/";
        return new RegExp(regex).test(email);
    }

    public static create(user: IRegisterDto): [ RegisterDto?, string? ] {
        const {
            confirmPassword,
            email,
            lastName,
            password,
            userName
        } = user;

        if (!userName) return [ undefined,  "User name is required." ];
        if (!lastName) return [ undefined,  "Last name is required." ];
        if (!email) return [ undefined,  "Email is required." ];
        if (!this.validateEmail(email)) return [ undefined, "Email field is invalid." ];
        if (!password) return [ undefined,  "Password is required." ];
        if (!confirmPassword) return [ undefined,  "Confirm password is required." ];
        if (!(password === confirmPassword)) return [ undefined,  "Confirm password is not same." ];

        return [ new RegisterDto(userName, lastName, email, password, confirmPassword), undefined ];
    }
}

export default RegisterDto;