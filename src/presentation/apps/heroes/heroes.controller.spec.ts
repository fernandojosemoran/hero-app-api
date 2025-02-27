import { HeroController } from './heroes.controller';
import { HeroEntity, Publisher } from '../../../domain/entities/hero.entity';

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

const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("hero");
const heroDatasource: HeroDatasourceImpl = new HeroDatasourceImpl(dbDatasource);
const heroRepository: HeroRepositoryImpl = new HeroRepositoryImpl(heroDatasource);

// type HeroResponseType = { response: HeroEntity | HeroEntity[] | string };

describe('./src/presentation/apps/heroes/heroes.controller.ts', () => {
    const controller: HeroController = new HeroController(new HeroService(heroRepository), new LogService());
    const server: Server = new Server(ConfigApp, RouterApp);
    
    beforeAll(() => server.start());
    afterAll(async () => await server.stop());
    
    beforeEach(() => jest.resetAllMocks());

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

    
    test('Should contain properties like createHero,getAllHeroes,deleteHero,updateHero,searchHero', () => {
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

    test("Should create an hero with endPoint /api/hero/create -> POST", async () => {
        const response = await request(server.server)
        .post("/api/hero/create")
        .set("User-Agent", "HeroesApp")
        .send(heroes[0]) 
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CREATED); 

        expect(response.body).toEqual({ response: heroes[0] });
    });

    test("Should response an error if hero already exist with endPoint /api/hero/create -> POST", async () => {
        const response = await request(server.server)
        .post("/api/hero/create")
        .set("User-Agent", "HeroesApp")
        .send(heroes[0]) 
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.CONFLICT);
        
        expect(response.body).toEqual({ response: "hero already exist" });
    });

    // Update

    test("Should update an hero with endPoint /api/hero/update/:id -> PUT", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const response = await request(server.server)
        .put(`/api/hero/update/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.ACCEPTED);

        expect(response.body).toEqual({ response: modifiedHero });
    });

    test("Should response an error if hero don't exist with endPoint /api/hero/update/:id -> PUT", async () => {
        const modifiedHero: HeroEntity = heroes[1];

        const response = await request(server.server)
        .put(`/api/hero/update/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: "hero not found" });
    });

    test("Should response an error if hero don't exist with endPoint /api/hero/update/:id -> PUT", async () => {
        jest.spyOn(DbDatasourceImpl.prototype, "update").mockImplementation();
        
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const response = await request(server.server)
        .put(`/api/hero/update/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "sorry some occurred wrong" });
    });

    // GET HERO BY ID

    test("Should get an hero by id with endPoint /api/hero/:id -> GET", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const response = await request(server.server)
        .get(`/api/hero/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.OK);

        expect(response.body).toEqual({ response: modifiedHero });
    });

    test("Should response an error if hero don't exist with endPoint /api/hero/:id -> GET", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0], id: "test-id" };

        const response = await request(server.server)
        .get(`/api/hero/${modifiedHero.id}`)
        .set("User-Agent", "HeroesApp")
        .send(modifiedHero)
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: "hero not exist." });
    });

    // GET ALL HEROES

    test("Should get all heroes with endPoint /api/hero/heroes-list -> GET", async () => {
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

    test("Should search a hero with endPoint /api/hero/search/:superhero -> GET", async () => {
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

    test("Should delete a hero with endPoint /api/hero/delete/:superhero -> DELETE", async () => {
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

    test("Should response an error if hero don't exist with endPoint /api/hero/delete/:superhero -> DELETE", async () => {
        const hero: HeroEntity = heroes[0];

        const response = await request(server.server)
        .delete(`/api/hero/delete/${hero.id}`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);
        
        expect(response.body).toEqual({ response: "hero not found" });
    });

    test("Should response an error if hero don't exist with endPoint /api/hero/delete/:superhero -> DELETE", async () => {
        const hero: HeroEntity = heroes[0];

        dbDatasource.findOne = jest.fn(() => Promise.resolve(hero));
        dbDatasource.delete = jest.fn(() => Promise.resolve(undefined));

        const response = await request(server.server)
        .delete(`/api/hero/delete/${hero.id}`)
        .set("User-Agent", "HeroesApp")
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.NOT_FOUND);

        expect(response.body).toEqual({ response: "hero not found" });
    });

    test("Should response an error if hero don't went saved with endPoint /api/hero/create -> POST", async () => {
        DbDatasourceImpl.prototype.findOne = jest.fn(() => Promise.resolve(undefined));
        DbDatasourceImpl.prototype.add = jest.fn(() => Promise.resolve(false));

        const response = await request(server.server)
        .post("/api/hero/create")
        .set("User-Agent", "HeroesApp")
        .send(heroes[0]) 
        .expect("Content-Type", /json/)
        .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);

        expect(response.body).toEqual({ response: "Sorry some occurred wrong" });
    });
});