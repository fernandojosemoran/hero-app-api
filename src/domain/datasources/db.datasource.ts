import { User } from "src/domain/entities/user.entity";
import { HeroEntity } from "../entities/hero.entity";

abstract class DbDatasource {
    abstract add(user: User): Promise<boolean>;
    abstract update(user: User): Promise<User | HeroEntity | undefined>;
    abstract findOne(id: string): Promise<User | HeroEntity | undefined>;
    abstract findMany(): Promise<User[] | HeroEntity[]>;
    abstract delete(id: string): Promise<User | HeroEntity | undefined>;
}

export default DbDatasource;