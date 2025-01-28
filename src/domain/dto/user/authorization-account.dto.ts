class AuthorizationAccountDto {
    private constructor(
        public readonly token: string
    ) {}

    public static create(token: string): [AuthorizationAccountDto?, number?] {

        if (!token) return [undefined, 401];

        return [new AuthorizationAccountDto(token), undefined];
    }
}

export default AuthorizationAccountDto;