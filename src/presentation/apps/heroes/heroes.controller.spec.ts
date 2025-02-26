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
import Env from '../../../infrastructure/constants/env';
import HttpStatusCode from '../../../infrastructure/helpers/http-status-code';

// const response = await request(server.server)
// .post("/api/hero/create")
// .set("User-Agent", "HeroesApp")
// .send(heroes[0]) 
// .expect("Content-Type", /json/)
// .expect(HttpStatusCode.CREATED); 

// expect(response.body).toEqual({ response: heroes[0] });

const dbDatasource: DbDatasourceImpl = new DbDatasourceImpl("hero");
const heroDatasource: HeroDatasourceImpl = new HeroDatasourceImpl(dbDatasource);
const heroRepository: HeroRepositoryImpl = new HeroRepositoryImpl(heroDatasource);

type HeroResponseType = { response: HeroEntity | HeroEntity[] | string };

describe('./src/presentation/apps/heroes/heroes.controller.ts', () => {
    const controller: HeroController = new HeroController(new HeroService(heroRepository), new LogService());
    const server: Server = new Server(ConfigApp, RouterApp);
    const BASE_URL: string = Env.HOST_URL;

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

    beforeEach(() => jest.clearAllMocks());
    beforeAll(() => server.start());
    afterAll(async () => {
        await server.stop();
    });
    
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

    test("Should create an hero with endPoint /api/hero/create -> POST", async () => {
        const httpConfig: RequestInit = {
            method: "POST",
            body: JSON.stringify(heroes[0]),
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "HeroesApp"
            }
        };

        const response = await fetch(`${BASE_URL}/api/hero/create`, httpConfig);
        const data: HeroResponseType = await response.json();

        expect(response.status).toBe(HttpStatusCode.CREATED);
        expect(data).toEqual({ response: heroes[0] });
    });

    test("Should update an hero with endPoint /api/hero/update/:id -> PUT", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const httpConfig: RequestInit = {
            method: "PUT",
            body: JSON.stringify(modifiedHero),
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "HeroesApp"
            }
        };

        const response = await fetch(`${BASE_URL}/api/hero/update/${heroes[0].id}`, httpConfig);
        const data: HeroResponseType = await response.json();

        expect(response.status).toBe(HttpStatusCode.ACCEPTED);
        expect(data).toEqual({ response: modifiedHero });
    });

    test("Should get an hero by id with endPoint /api/hero/:id -> GET", async () => {
        const modifiedHero: HeroEntity = { ...heroes[0],  alter_ego: "vitest" };

        const httpConfig: RequestInit = {
            method: "GET",
            headers: {
                "User-Agent": "HeroesApp"
            }
        };

        const response = await fetch(`${BASE_URL}/api/hero/${modifiedHero.id}`, httpConfig);
        const data: HeroResponseType = await response.json();

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(data).toEqual({ response: modifiedHero });
    });


    test("Should get all heroes with endPoint /api/hero/heroes-list -> GET", async () => {
        for (const hero of heroes) {
            const httpConfig: RequestInit = {
                method: "POST",
                body: JSON.stringify(hero),
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "HeroesApp"
                }
            };

            await fetch(`${BASE_URL}/api/hero/create`, httpConfig);
        }

        const httpConfig: RequestInit = { method: "GET", headers: { "User-Agent": "HeroesApp" } };

        const response = await fetch(`${BASE_URL}/api/hero/heroes-list`, httpConfig);

        const data: HeroResponseType = await response.json();

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(data.response).toHaveLength(9);
        expect(data).toEqual({ response: [ { ...heroes[0], alter_ego: "vitest" }, ...heroes.slice(1) ] });
    });

    test("Should search a hero with endPoint /api/hero/search/:superhero -> GET", async () => {
        const hero: HeroEntity = heroes[5];

        const httpConfig: RequestInit = { method: "GET", headers: { "User-Agent": "HeroesApp" } };

        const response = await fetch(`${BASE_URL}/api/hero/search/${hero.superhero}`, httpConfig);

        const data: HeroResponseType = await response.json();

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(data).toEqual({ response: [ hero ] });
    });

    test("Should search a hero with endPoint /api/hero/search/:superhero -> GET", async () => {
        const hero: HeroEntity = heroes[0];

        const httpConfig: RequestInit = { method: "DELETE", headers: { "User-Agent": "HeroesApp" } };

        for (const hero of heroes.slice(1)) {
            await fetch(`${BASE_URL}/api/hero/delete/${hero.id}`, httpConfig);
        }

        const response = await fetch(`${BASE_URL}/api/hero/delete/${hero.id}`, httpConfig);

        const data: HeroResponseType = await response.json();

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(data).toEqual({ response: `Hero ${hero.id} were deleted.` });
    });
});