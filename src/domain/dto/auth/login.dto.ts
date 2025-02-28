import { User } from './../../entities/user.entity';

interface IUserLoginDto extends User {
    token?: string;
}

class LoginDto {
    private constructor(
        public readonly email: string,
        public readonly userName: string,
        public readonly password: string,
        public readonly authorization: boolean,
        public readonly token?: string
    ) {}

    private static validateEmail(email: string): boolean {
        const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return new RegExp(regex).test(email);
    }

    public static create(user: IUserLoginDto): [LoginDto?, string?] {

        const { 
            email, 
            userName, 
            password, 
            token
        } = user;
        
        if (!userName) return [ undefined, "User is required." ];
        if (!email) return [ undefined, "Email is required." ];
        if (!this.validateEmail(email)) return [ undefined, "Email field is not valid." ];
        if (!password) return [ undefined, "Password is required." ];

        return [ new LoginDto(email, userName, password ,false, token), undefined ];
    }
}

export default LoginDto;