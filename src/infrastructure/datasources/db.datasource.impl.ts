import { User, UserEntity } from "../../../src/domain/entities/user.entity";
import { HeroEntity, HeroEntityResponse } from "../../../src/domain/entities/hero.entity";

import path from "path";
import DbDatasource from "../../../src/domain/datasources/db.datasource";
import fs from "fs";
import ConfigApp from "../../../config-app";
import userDb from "../../presentation/data/user.json";
import heroesDb from "../../presentation/data/heroes.json";
import Env from "../constants/env";

class DbDatasourceImpl implements DbDatasource {
    private path!: string;
    private users: UserEntity = { users: [] };
    private heroes: HeroEntityResponse = { heroes: [] };
    private readonly dirname: string = ConfigApp.rootDirPath;

    public constructor(private readonly db: "hero" | "user") {
        const MODE_TEST: boolean = Env.MODE_TEST;

        const heroDestination: string = MODE_TEST ? "./src/presentation/data/heroes.test.json" : "./src/presentation/data/heroes.json";
        const userDestination: string = MODE_TEST ? "./src/presentation/data/user.test.json" : "./src/presentation/data/user.json";
    
        switch (db) {
            case "hero":
                if (!MODE_TEST) this.heroes.heroes = heroesDb.heroes as HeroEntity[];
                this.path = path.join(this.dirname, heroDestination);
                break;
            case "user":
                if (!MODE_TEST) this.users.users = userDb.users;
                this.path = path.join(this.dirname, userDestination);
                break;
            default:
                if (!MODE_TEST) this.heroes.heroes = heroesDb.heroes as HeroEntity[];
                this.path = path.join(this.dirname, heroDestination);
                break;
        }
    }

    public async add(entity: User | HeroEntity): Promise<boolean> {

        if (this.db === "user") {
            const user: User | undefined = this.users.users.find(usr => usr.id === entity.id);

            if (user) return false;
            
            this.users.users.push(entity as User);
            fs.writeFileSync(this.path, JSON.stringify(this.users, null, 4), { encoding: "utf-8", flag: "w" });
            return true;
        }

        if (this.db === "hero") {
            const hero: HeroEntity | undefined = this.heroes.heroes.find(hero => hero.id === entity.id);
            
            if (hero) return false;

            this.heroes.heroes.push(entity as HeroEntity);
            fs.writeFileSync(this.path, JSON.stringify(this.heroes, null, 4), { encoding: "utf-8", flag: "w" });
            return true;
        }

        return false;
    }

    public async update(entity: User | HeroEntity): Promise<User | HeroEntity | undefined> {
        if (this.db === "user") {
            const user = this.users.users.find(user => user.id === entity.id);

            if (!user) return undefined;

            const users: User[] = this.users.users.filter(user => user.id !== entity.id);
            
            users.push(entity as User);

            this.users.users = users;

            fs.writeFileSync(this.path, JSON.stringify(this.users, null, 4), { encoding: "utf-8", flag: "w" });

            return entity as User;
        }

        const hero = this.heroes.heroes.find(hero => hero.id === entity.id);

        if (!hero) return undefined;

        const heroes: HeroEntity[] = this.heroes.heroes.filter(hero => hero.id !== entity.id);
        
        heroes.push(entity as HeroEntity);

        this.heroes.heroes = heroes;

        fs.writeFileSync(this.path, JSON.stringify(this.heroes, null, 4), { encoding: "utf-8", flag: "w" });

        return entity as HeroEntity;
    }

    public async findOne(id: string): Promise<User | HeroEntity | undefined> {
        if (this.db === "user") return this.users.users.find(user => user.id === id);
        
        return this.heroes.heroes.find(hero => hero.id === id);
    }

     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async findByProperty<K extends keyof User | keyof HeroEntity>(params: { property: K; value: any }): Promise<User | HeroEntity | undefined> {
        if (this.db === "user") {
            return this.users.users.find(user => user[params.property as keyof User] === params.value);
        }
    
        return this.heroes.heroes.find(hero => hero[params.property as keyof HeroEntity] === params.value);
    }

    public async findMany(): Promise<User[] | HeroEntity[]> {
        if (this.db === "user") return this.users.users;

        return this.heroes.heroes;
    }

    public async delete(id: string): Promise<User | HeroEntity | undefined> {
        if (this.db === "user") {
            const user = this.users.users.find(user => user.id === id);

            if (!user) return undefined;

            const users: User[] = this.users.users.filter(user => user.id !== id);
            
            this.users.users = users;

            fs.writeFileSync(this.path, JSON.stringify(this.users, null, 4), { encoding: "utf-8", flag: "w" });

            return user;
        }

        const hero = this.heroes.heroes.find(hero => hero.id === id);

        if (!hero) return undefined;

        const heroes: HeroEntity[] = this.heroes.heroes.filter(hero => hero.id !== id);
        
        this.heroes.heroes = heroes;

        fs.writeFileSync(this.path, JSON.stringify(this.heroes, null, 4), { encoding: "utf-8", flag: "w" });

        return hero;
    }
}

export default DbDatasourceImpl;