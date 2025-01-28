export interface UserEntity {
    users: User[];
}

export interface User {
    id:      string;
    userName: string;
    lastName: string;
    email:   string;
    password: string;
    authorization: boolean;
}
