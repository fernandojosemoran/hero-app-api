interface IAuthOutputs {
    endpoint: {
      USER_NOT_FOUND: string;
      USER_ALREADY_EXIST: string;
      PASSWORD_IS_NOT_VALID: string;
      YOU_ACCOUNT_ARE_NOT_AUTHORIZED: string;
      SOMETHING_OCCURRED_WRONG_WITH_LOGIN: string;
      SOMETHING_OCCURRED_WRONG: string;
      TOKEN_IS_NOT_VALID: string;
    };
    dto: {
      register: { [key: string]: string };
      login: { [key: string]: string };
    };
  }
  
  export const AuthOutputs: IAuthOutputs = {
    endpoint: {
      USER_NOT_FOUND: "user has not a account.",
      USER_ALREADY_EXIST: "user has already a account.",
      PASSWORD_IS_NOT_VALID: "password is not valid.",
      YOU_ACCOUNT_ARE_NOT_AUTHORIZED: "you account are not authorized, checkout you email service and confirm you account.",
      SOMETHING_OCCURRED_WRONG_WITH_LOGIN: "Something occurred wrong, trying login again.",
      SOMETHING_OCCURRED_WRONG: "Sorry something occurred wrong",
      TOKEN_IS_NOT_VALID: "Token is not valid",
    },
    dto: {
      register: {
        name: "Laura",
        lastName: "Martinez",
      },
      login: {
        name: "Juan",
        lastName: "Diaz",
      },
    },
  };
  