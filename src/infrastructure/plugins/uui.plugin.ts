import { v4 } from "uuid";

class UUID {
    public generateV4UUID(): string {
        return v4();
    }
}

export default UUID;