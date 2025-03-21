import { HeroController } from './heroes.controller';
import { HeroEntity, Publisher } from '../../../domain/entities/hero.entity';
import { heroesOutputs } from '../../../domain/outputs/heroes.out';

import DbDatasourceImpl from '../../../infrastructure/datasources/db.datasource.impl';
import HeroDatasourceImpl from '../../../infrastructure/datasources/hero.datasource.impl';
import HeroRepositoryImpl from '../../../infrastructure/repositories/hero.repository.impl';
import LogService from '../../services/log.service';
import HeroService from './heroes.service';
import Server from "../../../server";
import ConfigApp from '../../../../config-app';
import RouterApp from '../../../router-app';
import HttpStatusCode from '../../../infrastructure/helpers/http-status-code';
import request from "supertest";

// type HeroResponseType = { response: HeroEntity | HeroEntity[] | string };

describe('./src/presentation/apps/heroes/heroes.controller.ts', () => {
    let dbDatasource: DbDatasourceImpl;
    let heroDatasource: HeroDatasourceImpl;
    let heroRepository: HeroRepositoryImpl;

    let controller: HeroController;
    const server: Server = new Server(ConfigApp, RouterApp);
    
    beforeAll(() => server.start());
    afterAll(async () => await server.stop());
    
    beforeEach(() => {
        jest.resetAllMocks();

        dbDatasource = new DbDatasourceImpl("hero");
        heroDatasource = new HeroDatasourceImpl(dbDatasource);
        heroRepository = new HeroRepositoryImpl(heroDatasource);
        controller = new HeroController(new HeroService(heroRepository), new LogService());
    });

    const { endpoint } = heroesOutputs;

    const heroes: HeroEntity[] = [
        {
            id: "dc-jest-superhero",
            superhero: "Jest Superhero",
            alter_ego: "Jest User",
            characters: "Jest Character A, Jest Character B",
            first_appearance: "Jest Comic #1",
            publisher: Publisher.DCComics,
            alt_image: "https://test.com/media/jest-image.jpg"
        },
        {
            id: "marvel-mocha-superhero",
            superhero: "Mocha Superhero",
            alter_ego: "Mocha User",
            characters: "Mocha Character X",
            first_appearance: "Mocha Comic #1",
            publisher: Publisher.MarvelComics,
            alt_image: "https://test.com/media/mocha-image.jpg"
        },
        {
            id: "dc-jasmine-superhero",
            superhero: "Jasmine Superhero",
            alter_ego: "Jasmine User",
            characters: "Jasmine Character Alpha, Jasmine Character Beta",
            first_appearance: "Jasmine Comic #1",
            publisher: Publisher.DCComics,
            alt_image: "https://test.com/media/jasmine-image.jpg"
        },
            {
            id: "marvel-vitest-superhero",
            superhero: "Vitest Superhero",
            alter_ego: "Vitest User",
            characters: "Vitest Character One, Vitest Character Two",
            first_appearance: "Vitest Comic #1",
            publisher: Publisher.MarvelComics,
            alt_image: "https://test.com/media/vitest-image.jpg"
        },
            {
            id: "dc-cypress-superhero",
            superhero: "Cypress Superhero",
            alter_ego: "Cypress User",
            characters: "Cypress Character Q, Cypress Character W, Cypress Character E",
            first_appearance: "Cypress Comic #1",
            publisher: Publisher.DCComics,
            alt_image: "https://test.com/media/cypress-image.jpg"
        },
        {
            id: "marvel-playwright-superhero",
            superhero: "Playwright Superhero",
            alter_ego: "Playwright User",
            characters: "Playwright Character U, Playwright Character I, Playwright Character O",
            first_appearance: "Playwright Comic #1",
            publisher: Publisher.MarvelComics,
            alt_image: "https://test.com/media/playwright-image.jpg"
        },
            {
            id: "dc-supertest-superhero",
            superhero: "Supertest Superhero",
            alter_ego: "Supertest User",
            characters: "Supertest Character R, Supertest Character T, Supertest Character Y",
            first_appearance: "Supertest Comic #1",
            publisher: Publisher.DCComics,
            alt_image: "https://test.com/media/supertest-image.jpg"
        },
            {
            id: "marvel-chai-superhero",
            superhero: "Chai Superhero",
            alter_ego: "Chai User",
            characters: "Chai Character A1, Chai Character B2, Chai Character C3",
            first_appearance: "Chai Comic #1",
            publisher: Publisher.MarvelComics,
            alt_image: "https://test.com/media/chai-image.jpg"
        },
        {
            id: "dc-puppeteer-superhero",
            superhero: "Puppeteer Superhero",
            alter_ego: "Puppeteer User",
            characters: "Puppeteer Character D4, Puppeteer Character E5, Puppeteer Character F6",
            first_appearance: "Puppeteer Comic #1",
            publisher: Publisher.DCComics,
            alt_image: "https://test.com/media/puppeteer-image.jpg"
        }
    ];

    
    test('Should have properties like createHero,getAllHeroes,deleteHero,updateHero,searchHero', () => {
        expect(controller).toHaveProperty("createHero");
        expect(controller).toHaveProperty("getAllHeroes");
        expect(controller).toHaveProperty("deleteHero");
        expect(controller).toHaveProperty("updateHero");
        expect(controller).toHaveProperty("searchHero");
        expect(controller).toHaveProperty("getHeroById");
    });

    test('Should properties createHero,getAllHeroes,deleteHero,updateHero,searchHero be methods', () => {
        expect(typeof controller.createHero).toBe("function");
        expect(typeof controller.getAllHeroes).toBe("function");
        expect(typeof controller.deleteHero).toBe("function");
        expect(typeof controller.updateHero).toBe("function");
        expect(typeof controller.searchHero).toBe("function");
        expect(typeof controller.getHeroById).toBe("function");
    });

    // CREATE

    test("Should create a hero in POST /api/hero/create", async () => {
        const response = await request(server.server)
        .post("/api/hero/create")
        .set("User-Agent", "HeroesApp")
        .send(heroes[0]) 
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CREATED); 

        expect(response.body).toEqual({ response: heroes[0] });
    });

    test("Should respond with an error if hero already exists in POST /api/hero/create", async () => {
        const response = await request(server.server)
        .post("/api/hero/create")
        .set("User-Agent", "HeroesApp")
        .send(heroes[0]) 
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CONFLICT);
        
        expect(response.body).toEqual({ response: endpoint.HERO_ALREADY_EXISTS });
    });

    // Update

    test("Should update a hero in PUT /api/hero/update/:id ", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const response = await request(server.server)
        .put(`/api/hero/update/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.ACCEPTED);

        expect(response.body).toEqual({ response: modifiedHero });
    });

    test("Should respond with an error if hero does not exist in PUT /api/hero/update/:id", async () => {
        const modifiedHero: HeroEntity = heroes[1];

        const response = await request(server.server)
        .put(`/api/hero/update/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: endpoint.HERO_NOT_FOUND });
    });

    test("Should respond with an error if hero does not exist in PUT /api/hero/update/:id", async () => {
        jest.spyOn(DbDatasourceImpl.prototype, "update").mockImplementation();
        
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const response = await request(server.server)
        .put(`/api/hero/update/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: endpoint.SOMETHING_OCCURRED_WRONG });
    });

    // GET HERO BY ID

    test("Should get a hero by id in GET /api/hero/:id", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const response = await request(server.server)
        .get(`/api/hero/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);

        expect(response.body).toEqual({ response: modifiedHero });
    });

    test("Should respond with an error if hero does not exist in GET /api/hero/:id", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0], id: "test-id" };

        const response = await request(server.server)
        .get(`/api/hero/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: endpoint.HERO_NOT_FOUND });
    });

    // GET ALL HEROES

    test("Should get all heroes in GET /api/hero/heroes-list", async () => {
        for (const hero of heroes.slice(1)) {
            await request(server.server)
            .post("/api/hero/create")
            .set("User-Agent", "HeroesApp")
            .send(hero) 
            .expect("Content-Type", /json/)
            .expect(HttpStatusCode.CREATED); 
        }

        const response = await request(server.server)
        .get(`/api/hero/heroes-list`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);
        
        expect(response.body.response).toHaveLength(9);
        expect(response.body).toEqual({ response: [ { ...heroes[0], alter_ego: "vitest" }, ...heroes.slice(1) ] });
    });

    // SEARCH HERO

    test("Should search a hero in GET /api/hero/search/:superhero", async () => {
        const hero: HeroEntity = heroes[5];

        const response = await request(server.server)
        .get(`/api/hero/search/${hero.superhero}`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);
        
        expect(response.body.response).toHaveLength(1);
        expect(response.body).toEqual({ response: [ hero ] });
    });

    // DELETE

    test("Should delete a hero in DELETE /api/hero/delete/:superhero", async () => {
        const hero: HeroEntity = heroes[0];

        for (const hero of heroes.slice(1)) {
            await request(server.server)
            .delete(`/api/hero/delete/${hero.id}`)
            .set("User-Agent", "HeroesApp")
            .expect("Content-Type", /json/)
            .expect(HttpStatusCode.OK);    
        }
        
        const response = await request(server.server)
        .delete(`/api/hero/delete/${hero.id}`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);  

        expect(response.body).toEqual({ response: `Hero ${hero.id} were deleted.` });
    });

    test("Should respond with an error if hero does not exist in DELETE /api/hero/delete/:superhero", async () => {
        const hero: HeroEntity = heroes[0];

        const response = await request(server.server)
        .delete(`/api/hero/delete/${hero.id}`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);
        
        expect(response.body).toEqual({ response: endpoint.HERO_NOT_FOUND });
    });

    test("Should respond with an error if hero does not exist in DELETE /api/hero/delete/:superhero", async () => {
        const hero: HeroEntity = heroes[0];

        dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));
        dbDatasource.delete = jest.fn(() => Promise.resolve(undefined));

        const response = await request(server.server)
        .delete(`/api/hero/delete/${hero.id}`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: endpoint.HERO_NOT_FOUND });
    });

    test("Should respond with an error if hero was not saved in POST /api/hero/create", async () => {
        DbDatasourceImpl.prototype.findOne = jest.fn(() => Promise.resolve(undefined));
        DbDatasourceImpl.prototype.add = jest.fn(() => Promise.resolve(false));

        const response = await request(server.server)
        .post("/api/hero/create")
        .set("User-Agent", "HeroesApp")
        .send(heroes[0]) 
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: endpoint.SOMETHING_OCCURRED_WRONG });
    });
});