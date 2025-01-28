import { User } from './../../entities/user.entity';

interface IUserLoginDto extends User {
    token?: string;
}

class LoginDto {
    private constructor(
        public readonly email: string,
        public readonly userName: string,
        public readonly authorization: boolean,
        public readonly token?: string
    ) {}

    private static validateEmail(email: string): boolean {
        const regex: string = "/^[a-zA-Z0-9]?@*.(gmail,yahoo).{com,es}/";
        return new RegExp(regex).test(email);
    }

    public static create(user: IUserLoginDto): [LoginDto?, string?] {

        const { 
            email, 
            userName, 
            password, 
            authorization = false,
            token
        } = user;

        if (!email) return [ undefined, "Email is required." ];
        // if (!this.validateEmail(email)) return [ undefined, "Email field is not valid." ];
        if (!userName) return [ undefined, "User is required." ];
        if (!password) return [ undefined, "Password is required." ];

        return [ new LoginDto(email, userName, authorization, token), undefined ];
    }
}

export default LoginDto;