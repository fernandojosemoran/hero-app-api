import { HeroEntity, Publisher } from "../../domain/entities/hero.entity";
import { User } from "../../domain/entities/user.entity";
import DbDatasourceImpl from "../../infrastructure/datasources/db.datasource.impl";

describe('./src/infrastructure/datasources/db.datasource.impl.ts', () => {
    const dbUsers: DbDatasourceImpl = new DbDatasourceImpl("user");
    const dbHeroes: DbDatasourceImpl = new DbDatasourceImpl("hero");

    // Users
    test('Should save an user successfully ', async () => {
        const user: User = {
            id: "userID1",
            userName: "test1",
            lastName: "jest",
            password: "password123",
            email: "test@gmail.com",
            authorization: false
        };

        const result = await dbUsers.add(user);

        expect(result).toBeTruthy();
    });

    test('Should update an users\' information successfully', async () => {
        const user: User = {
            id: "userID1",
            userName: "test200",
            lastName: "jest2000",
            password: "password2000",
            email: "test2000@gmail.com",
            authorization: true
        };

        const result = await dbUsers.update(user);

        expect(result).toEqual(user);
    });

    test('Should find an user successfully ', async () => {
        const user: User = {
            id: "userID1",
            userName: "test200",
            lastName: "jest2000",
            password: "password2000",
            email: "test2000@gmail.com",
            authorization: true
        };

        const result = await dbUsers.findOne(user.id);

        expect(result).toEqual(user);
    });

    test('Should find a user', async () => {
        const user: User = {
            id: "userID1",
            userName: "test200",
            lastName: "jest2000",
            password: "password2000",
            email: "test2000@gmail.com",
            authorization: true
        };

        const result = await dbUsers.findMany();

        expect(result).toEqual([ user ]);
    });

    test('Should successfully find a user by any property successfully', async () => {
        const user: User = {
            id: "userID1",
            userName: "test200",
            lastName: "jest2000",
            password: "password2000",
            email: "test2000@gmail.com",
            authorization: true
        };

        const result = await dbUsers.findByProperty({ property: "email", value: user.email });

        expect(result).toEqual( user );
    });

    test('Should delete an user', async () => {
        const user: User = {
            id: "userID1",
            userName: "test200",
            lastName: "jest2000",
            password: "password2000",
            email: "test2000@gmail.com",
            authorization: true
        };

        const result = await dbUsers.delete(user.id);

        expect(result).toEqual(user);
    });

    // Heroes 

    test('Should save a hero successfully ', async () => {
        const hero: HeroEntity = {
            id: "dc-super-test",
            superhero: "super test",
            alter_ego: "test1",
            characters: "test characters",
            first_appearance: "test 1/2/2000",
            publisher: Publisher.DCComics,
            alt_image: "image test",
        };

        const result = await dbHeroes.add(hero);

        expect(result).toBeTruthy();
    });

    test('Should update a hero\' information successfully ', async () => {
        const hero: HeroEntity = {
            id: "dc-super-test",
            superhero: "super jest",
            alter_ego: "jest1",
            characters: "jest characters",
            first_appearance: "jest 1/2/2000",
            publisher: Publisher.DCComics,
            alt_image: "image jest",
        };

        const result = await dbHeroes.update(hero);

        expect(result).toEqual(hero);
    });

    test('Should find a hero successfully ', async () => {
        const hero: HeroEntity = {
            id: "dc-super-test",
            superhero: "super jest",
            alter_ego: "jest1",
            characters: "jest characters",
            first_appearance: "jest 1/2/2000",
            publisher: Publisher.DCComics,
            alt_image: "image jest",
        };

        const result = await dbHeroes.findOne(hero.id!);

        expect(result).toEqual(hero);
    });

    test('Should find a hero successfully ', async () => {
        const hero: HeroEntity = {
            id: "dc-super-test",
            superhero: "super jest",
            alter_ego: "jest1",
            characters: "jest characters",
            first_appearance: "jest 1/2/2000",
            publisher: Publisher.DCComics,
            alt_image: "image jest",
        };

        const result = await dbHeroes.findMany();

        expect(result).toEqual([ hero ]);
    });

    test('Should successfully find a hero by any property successfully', async () => {
        const hero: HeroEntity = {
            id: "dc-super-test",
            superhero: "super jest",
            alter_ego: "jest1",
            characters: "jest characters",
            first_appearance: "jest 1/2/2000",
            publisher: Publisher.DCComics,
            alt_image: "image jest",
        };

        const result = await dbHeroes.findByProperty({ property: "first_appearance", value: hero.first_appearance });

        expect(result).toEqual( hero );
    });

    test('Should delete a hero successfully ', async () => {
        const hero: HeroEntity = {
            id: "dc-super-test",
            superhero: "super jest",
            alter_ego: "jest1",
            characters: "jest characters",
            first_appearance: "jest 1/2/2000",
            publisher: Publisher.DCComics,
            alt_image: "image jest",
        };

        const result = await dbHeroes.delete(hero.id!);

        expect(result).toEqual(hero);
    });
});
