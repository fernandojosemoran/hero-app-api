import { HeroEntity, Publisher } from './../../domain/entities/hero.entity';

import CreateHeroDto from "../../domain/dto/heroes/create-hero.dto";
import HeroDatasourceImpl from "./hero.datasource.impl";
import DbDatasourceImpl from "./db.datasource.impl";
import SearchHeroDto from "../../domain/dto/heroes/search-hero.dto";
import UpdateHeroDto from "../../domain/dto/heroes/update-hero.dto";
import DeleteHeroDto from "../../domain/dto/heroes/delete-hero.dto";
import HttpError from '../errors/http-error';
import HttpStatusCode from "../helpers/http-status-code";

const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("hero");

describe('./src/infrastructure/datasources/hero.datasource.impl.ts', () => {
    let datasource!: HeroDatasourceImpl;

    const hero: HeroEntity = {
        id: "dc-test",
        superhero: "test",
        alter_ego: "jest",
        first_appearance: "test-date",
        publisher: Publisher.DCComics,
        characters: "character1, character2",
        alt_image: "test-image"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        datasource = new HeroDatasourceImpl(dbDatasource);
    });

    test('Should contain properties like searchHero,createHero,updateHero,deleteHero,getAllHeroes,getHeroById', () => {
        expect(datasource).toHaveProperty("searchHero");
        expect(datasource).toHaveProperty("createHero");
        expect(datasource).toHaveProperty("updateHero");
        expect(datasource).toHaveProperty("deleteHero");
        expect(datasource).toHaveProperty("getAllHeroes");
        expect(datasource).toHaveProperty("getHeroById");
    });

    test('Should contain searchHero,createHero,updateHero,deleteHero,getAllHeroes,getHeroById as methods', () => {
        expect(typeof datasource.createHero).toBe("function");
        expect(typeof datasource.deleteHero).toBe("function");
        expect(typeof datasource.getAllHeroes).toBe("function");
        expect(typeof datasource.getHeroById).toBe("function");
        expect(typeof datasource.searchHero).toBe("function");
        expect(typeof datasource.updateHero).toBe("function");
    });

    test("Should create a hero", async () => {
        const findOneMock = dbDatasource.findOne = jest.fn(undefined);
        const addMock = dbDatasource.add = jest.fn(() => Promise.resolve(true));

        const response = await datasource.createHero(hero as CreateHeroDto);

        expect(findOneMock).toHaveBeenCalledWith(hero.id);
        expect(addMock).toHaveBeenCalledWith(hero);
        expect(response).toEqual(hero);
    });

    test("Should throw an error if hero already exist when createHero method is executed", () => {
        const findOneMock = dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));

        const response = datasource.createHero(hero as CreateHeroDto);
        
        expect(findOneMock).toHaveBeenCalledWith(hero.id);

        response.catch((error: HttpError) => {
            expect(error.message).toBe("hero already exist");
            expect(error.status).toBe(HttpStatusCode.CONFLICT);
        });
    });

    test("Should throw an error if hero not went saved successfully when createHero method is executed", () => {
        dbDatasource.findOne = jest.fn();
        dbDatasource.add = jest.fn(() => Promise.resolve(false));

        datasource.createHero(hero as CreateHeroDto)
        .catch((error: HttpError) => {
            expect(error.message).toBe("Sorry some occurred wrong");
            expect(error.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        });
    });

    test("Should search a hero", async () => {
        const findManyMock = dbDatasource.findMany = jest.fn(() => Promise.resolve([ hero ]));

        const response: HeroEntity[] = await datasource.searchHero(hero as SearchHeroDto);

        expect(findManyMock).toHaveBeenCalled();
        expect(response).toEqual([ hero ]);
    });

    test("Should update an hero", async () => {
        const heroModified: HeroEntity = { ...hero, superhero: "super-test" };
        
        const findOneMock = dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));
        const updateMock = dbDatasource.update = jest.fn(() => Promise.resolve(heroModified));

        const response: HeroEntity = await datasource.updateHero(heroModified as UpdateHeroDto);

        expect(findOneMock).toHaveBeenCalledWith(hero.id);
        expect(updateMock).toHaveBeenCalledWith(heroModified);
        expect(response).toEqual({
            ...hero,
            superhero: "super-test"
        });
    });

    test("Should throw an hero if hero not exist when updateHero method is executed", () => {
        const heroModified: HeroEntity = { ...hero, superhero: "super-test" };
        
        const findOneMock = dbDatasource.findOne = jest.fn(undefined);

        const response = datasource.updateHero(heroModified as UpdateHeroDto);

        expect(findOneMock).toHaveBeenCalledWith(hero.id);

        response.catch((error: HttpError) => {
            expect(error.message).toBe("hero not found");
            expect(error.status).toBe(HttpStatusCode.NOT_FOUND);
        });
    });

    test("Should throw an hero if hero not went updated successfully when updateHero method is executed", () => {
        const heroModified: HeroEntity = { ...hero, superhero: "super-test" };
        
        dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));
        dbDatasource.update = jest.fn();

        datasource.updateHero(heroModified as UpdateHeroDto)
        .catch((error: HttpError) => {
            expect(error.message).toBe("sorry some occurred wrong");
            expect(error.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        });
    });

    test("Should delete an hero", async () => {
        const findOneMock = dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));
        const deleteMock = dbDatasource.delete = jest.fn(() => Promise.resolve(hero));

        const response: string = await datasource.deleteHero(hero as DeleteHeroDto);

        expect(findOneMock).toHaveBeenCalledWith(hero.id);
        expect(deleteMock).toHaveBeenCalledWith(hero.id);
        expect(response).toBe(`Hero ${hero.id} were deleted.`);
    });

    test("Should throw an error if hero not exist when deleteHero method is executed", () => {
        dbDatasource.findOne = jest.fn();
        dbDatasource.delete = jest.fn(() => Promise.resolve(hero));

        datasource.deleteHero(hero as DeleteHeroDto)
        .catch((error: HttpError) => {
            expect(error.message).toBe("hero not found");
            expect(error.status).toBe(HttpStatusCode.NOT_FOUND);
        });
    });

    test("Should throw an error if hero don't went deleted when deleteHero method is executed", () => {
        dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));
        dbDatasource.delete = jest.fn();

        datasource.deleteHero(hero as DeleteHeroDto)
        .catch((error: HttpError) => {
            expect(error.message).toBe("hero not found");
            expect(error.status).toBe(HttpStatusCode.NOT_FOUND);
        });
    });

    test("Should get all heroes", async () => {
        const findManyMock = dbDatasource.findMany = jest.fn(() => Promise.resolve( [ hero, hero, hero, hero, hero ] ));

        const response: HeroEntity[] =  await datasource.getAllHeroes();

        expect(findManyMock).toHaveBeenCalled();
        expect(response).toHaveLength(5);
        expect(response).toEqual([ hero, hero, hero, hero, hero ]);
    });

    test("Should get a hero by id", async () => {
        const findOneMock = dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));

        const response: HeroEntity =  await datasource.getHeroById(hero.id!);

        expect(findOneMock).toHaveBeenCalledWith(hero.id);
        expect(response).toEqual(hero);
    });

    test("Should get a hero by id", () => {
        dbDatasource.findOne = jest.fn();
        datasource.getHeroById(hero.id!)
        .catch((error: HttpError) => {
            expect(error.message).toBe("hero not exist.");
            expect(error.status).toBe(HttpStatusCode.NOT_FOUND);
        });
    });
});