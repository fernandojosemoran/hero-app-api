import CreateHeroDto from "../../domain/dto/heroes/create-hero.dto";
import DeleteHeroDto from "../../domain/dto/heroes/delete-hero.dto";
import SearchHeroDto from "../../domain/dto/heroes/search-hero.dto";
import UpdateHeroDto from "../../domain/dto/heroes/update-hero.dto";
import { Publisher } from "../../domain/entities/hero.entity";
import DbDatasourceImpl from "../datasources/db.datasource.impl";
import HeroDatasourceImpl from "../datasources/hero.datasource.impl";
import HeroRepositoryImpl from "./hero.repository.impl";

describe('./src/infrastructure/repositories/hero.repository.impl.ts', () => {
    const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("hero");
    const heroesDatasource: HeroDatasourceImpl = new HeroDatasourceImpl(dbDatasource);
    const repository: HeroRepositoryImpl = new HeroRepositoryImpl(heroesDatasource);

    test('Should have properties for create, update, delete, get, search a hero', () => {
        expect(repository).toHaveProperty("createHero");
        expect(repository).toHaveProperty("updateHero");
        expect(repository).toHaveProperty("deleteHero");
        expect(repository).toHaveProperty("getAllHeroes");
        expect(repository).toHaveProperty("getHeroById");
        expect(repository).toHaveProperty("searchHero");
    });

    test('Should have all properties as methods', () => {
        expect(typeof repository.createHero).toBe("function");
        expect(typeof repository.updateHero).toBe("function");
        expect(typeof repository.deleteHero).toBe("function");
        expect(typeof repository.getAllHeroes).toBe("function");
        expect(typeof repository.getHeroById).toBe("function");
        expect(typeof repository.searchHero).toBe("function");
    });

    test('Should call createHero method with CreateHeroDto', () => {
        const repositoryCreateHeroSpy = jest.spyOn(repository, "createHero");
        const datasourceCreateHeroSpy = jest.spyOn(heroesDatasource, "createHero").mockImplementation(jest.fn());

        const dto: CreateHeroDto = {
            id: "marvel-super-test",
            superhero: "super test",
            alter_ego: "jest",
            characters: "mock, spyOn, fn",
            first_appearance: "comic #25",
            publisher: Publisher.MarvelComics,
            alt_image: "test-image.webp"
        };

        repository.createHero(dto);

        expect(repositoryCreateHeroSpy).toHaveBeenCalledWith(dto);
        expect(datasourceCreateHeroSpy).toHaveBeenCalledWith(dto);
    });

    test('Should call updateHero method with UpdateHeroDto', () => {
        const repositoryUpdateHeroSpy = jest.spyOn(repository, "updateHero");
        const datasourceUpdateHeroSpy = jest.spyOn(heroesDatasource, "updateHero").mockImplementation(jest.fn());

        const dto: UpdateHeroDto = {
            id: "marvel-super-testing",
            superhero: "super testing",
            alter_ego: "jest",
            characters: "resetAllMocks, resetAllModules, restoreAllMocks",
            first_appearance: "comic #25",
            publisher: Publisher.MarvelComics,
            alt_image: "test-image.jpg"
        };

        repository.updateHero(dto);

        expect(repositoryUpdateHeroSpy).toHaveBeenCalledWith(dto);
        expect(datasourceUpdateHeroSpy).toHaveBeenCalledWith(dto);
    });

    test('Should call deleteHero method with DeleteHeroDto', () => {
        const repositoryDeleteHeroSpy = jest.spyOn(repository, "deleteHero");
        const datasourceUpdateHeroSpy = jest.spyOn(heroesDatasource, "deleteHero").mockImplementation(jest.fn());

        const dto: DeleteHeroDto = {
            id: "marvel-super-testing"
        };

        repository.deleteHero(dto);

        expect(repositoryDeleteHeroSpy).toHaveBeenCalledWith(dto);
        expect(datasourceUpdateHeroSpy).toHaveBeenCalledWith(dto);
    });

    test('Should call getAllHeroes method', () => {
        const repositoryGetAllHeroesSpy = jest.spyOn(repository, "getAllHeroes");
        const datasourceGetAllHeroesSpy = jest.spyOn(heroesDatasource, "getAllHeroes").mockImplementation(jest.fn());

        repository.getAllHeroes();

        expect(repositoryGetAllHeroesSpy).toHaveBeenCalled();
        expect(datasourceGetAllHeroesSpy).toHaveBeenCalled();
    });

    test('Should call getHeroById method with an id', () => {
        const repositoryGetHeroByIdSpy = jest.spyOn(repository, "getHeroById");
        const datasourceGetHeroByIdSpy = jest.spyOn(heroesDatasource, "getHeroById").mockImplementation(jest.fn());
        
        const id: string = "marvel-super-test";

        repository.getHeroById(id);

        expect(repositoryGetHeroByIdSpy).toHaveBeenCalledWith(id);
        expect(datasourceGetHeroByIdSpy).toHaveBeenCalledWith(id);
    });

    test('Should call searchHero method with SearchHeroDto', () => {
        const repositorySearchHeroSpy = jest.spyOn(repository, "searchHero");
        const datasourceSearchHeroSpy = jest.spyOn(heroesDatasource, "searchHero").mockImplementation(jest.fn());

        const dto: SearchHeroDto = {
            superhero: "super-test"
        };

        repository.searchHero(dto);

        expect(repositorySearchHeroSpy).toHaveBeenCalledWith(dto);
        expect(datasourceSearchHeroSpy).toHaveBeenCalledWith(dto);
    });
});