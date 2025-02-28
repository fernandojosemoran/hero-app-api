interface IAuthOutputs {
    endpoint: {
      register: { [key: string]: string };
      login: { [key: string]: string };
      refresh_token: { [key: string]: string };
      logout: { [key: string]: string };
    };
    dto: {
      register: { [key: string]: string };
      login: { [key: string]: string };
    };
  }
  
  export const AuthOutputs: IAuthOutputs = {
    endpoint: {
      register: {
        name: "Fernando",
        lastName: "Jose",
      },
      login: {
        name: "Carlos",
        lastName: "Gonzalez",
      },
      refresh_token: {
        name: "Alex",
        lastName: "Perez",
      },
      logout: {
        name: "Maria",
        lastName: "Lopez",
      },
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
  