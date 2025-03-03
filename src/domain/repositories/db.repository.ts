import { User } from "src/domain/entities/user.entity";
import { HeroEntity } from "../entities/hero.entity";

abstract class DbRepository {
    abstract add(user: User): Promise<boolean>;
    abstract update(user: User): Promise<User | HeroEntity | undefined>;
    abstract findOne(id: string): Promise<User | HeroEntity | undefined>;
    abstract findMany(): Promise<User[] | HeroEntity[]>;
    abstract delete(id: string): Promise<User | HeroEntity | undefined>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract findByProperty<K extends keyof User | keyof HeroEntity>(params: { property: K; value: any }): Promise<User | HeroEntity | undefined>;
}

export default DbRepository;