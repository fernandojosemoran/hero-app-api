import CreateHeroDto from "../../../domain/dto/heroes/create-hero.dto";
import DeleteHeroDto from "../../../domain/dto/heroes/delete-hero.dto";
import GetHeroByIdDto from "../../../domain/dto/heroes/get-hero-by-id.dto";
import SearchHeroDto from "../../../domain/dto/heroes/search-hero.dto";
import UpdateHeroDto from "../../../domain/dto/heroes/update-hero.dto";
import { Publisher } from "../../../domain/entities/hero.entity";
import DbDatasourceImpl from "../../../infrastructure/datasources/db.datasource.impl";
import HeroDatasourceImpl from "../../../infrastructure/datasources/hero.datasource.impl";
import HeroRepositoryImpl from "../../../infrastructure/repositories/hero.repository.impl";
import HeroesService from "./heroes.service";

describe('./src/presentation/apps/heroes/heroes.service.ts', () => {
    const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("hero");
    const heroesDatasource: HeroDatasourceImpl = new HeroDatasourceImpl(dbDatasource);
    const repository: HeroRepositoryImpl = new HeroRepositoryImpl(heroesDatasource);
    const heroesService: HeroesService = new HeroesService(repository);

    beforeEach(() => jest.resetAllMocks());

    test('Should have properties like createHero, updateHero, deleteHero, getAllHeroes, getHeroById, searchHero', () => {
        expect(heroesService).toHaveProperty("createHero");
        expect(heroesService).toHaveProperty("updateHero");
        expect(heroesService).toHaveProperty("deleteHero");
        expect(heroesService).toHaveProperty("getAllHeroes");
        expect(heroesService).toHaveProperty("getHeroById");
        expect(heroesService).toHaveProperty("searchHero");
    });

    test('Should all properties be methods', () => { 
        expect(typeof heroesService.createHero).toBe("function");
        expect(typeof heroesService.updateHero).toBe("function");
        expect(typeof heroesService.deleteHero).toBe("function");
        expect(typeof heroesService.getAllHeroes).toBe("function");
        expect(typeof heroesService.getHeroById).toBe("function");
        expect(typeof heroesService.searchHero).toBe("function");
    });

    test("Should call the createHero method with CreateHeroDto from heroesRepository", () => {
        const dto: CreateHeroDto = {
            id: "dc-super-test",
            superhero: "super-test",
            alter_ego: "jest",
            characters: "character1, character2",
            first_appearance: "comic super-test #12",
            publisher: Publisher.DCComics,
            alt_image: "test-image.jpg"
        };
        
        const createHeroMock = repository.createHero = jest.fn();

        heroesService.createHero(dto);

        expect(createHeroMock).toHaveBeenCalledWith(dto);
    });

    test("Should call the updateHero method with an UpdateHeroDto from heroesRepository", () => {
        const dto: UpdateHeroDto = {
            id: "dc-super-test",
            superhero: "super-test",
            alter_ego: "jest",
            characters: "character1, character2",
            first_appearance: "comic super-test #12",
            publisher: Publisher.DCComics,
            alt_image: "test-image.jpg"
        };
        
        const updateHeroMock = repository.updateHero = jest.fn();

        heroesService.updateHero(dto);

        expect(updateHeroMock).toHaveBeenCalledWith(dto);
    });

    test("Should call the deleteHero method with a DeleteDto from heroesRepository", () => {
        const dto: DeleteHeroDto = { id: "dc-super-test" };
        
        const deleteHeroMock = repository.deleteHero = jest.fn();

        heroesService.deleteHero(dto);

        expect(deleteHeroMock).toHaveBeenCalledWith(dto);
    });

    test("Should call the getAllHeroes method from heroesRepository", () => {        
        const getAllHeroesHeroMock = repository.getAllHeroes = jest.fn();

        heroesService.getAllHeroes();

        expect(getAllHeroesHeroMock).toHaveBeenCalled();
    });

    test("Should call the getHeroById method with a GetHeroByIdDto from heroesRepository", () => {    
        const dto: GetHeroByIdDto = { id: "dc-super-test" };
        
        const getHeroByIdHeroMock = repository.getHeroById = jest.fn();

        heroesService.getHeroById(dto);

        expect(getHeroByIdHeroMock).toHaveBeenCalledWith(dto.id);
    });

    test("Should call the searchHero method with a SearchHeroDto from heroesRepository", () => {    
        const dto: SearchHeroDto = { superhero: "super-test" };
        
        const searchHeroMock = repository.searchHero = jest.fn();

        heroesService.searchHero(dto);

        expect(searchHeroMock).toHaveBeenCalledWith(dto);
    });
}); 