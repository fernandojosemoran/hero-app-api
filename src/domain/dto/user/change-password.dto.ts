interface IChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

class ChangePasswordDto {
    private constructor(
        public readonly oldPassword: string,
        public readonly newPassword: string,
        public readonly confirmNewPassword: string
    ) {}

    public static create(passwords: IChangePassword): [ChangePasswordDto?, string?] {

        const { 
            confirmNewPassword,
            newPassword,
            oldPassword
        } = passwords;

        if (!oldPassword) return [ undefined, "Old password field is required." ];
        if (!newPassword) return [ undefined, "New password field is required." ];
        if (!confirmNewPassword) return [ undefined, "Confirm password field is required." ];

        if (!(newPassword === confirmNewPassword)) return [ undefined, "New password and Confirm password aren't same." ];

        return [ new ChangePasswordDto(oldPassword, newPassword, confirmNewPassword), undefined ];
    }
}

export default ChangePasswordDto;