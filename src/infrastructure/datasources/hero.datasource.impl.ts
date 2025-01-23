import { HeroEntity, HeroEntityResponse, Publisher } from "../../domain/entities/hero.entity";

import heroesJsonDb from "../../presentation/data/heroes.json";
import HeroDataSource from "../../domain/datasources/hero.datasource";
import LogService from '../../presentation/services/log.service';
import CreateHeroDto from '../../domain/dto/heroes/create-hero.dto';
import UpdateHeroDto from '../../domain/dto/heroes/update-hero.dto';
import DeleteHeroDto from '../../domain/dto/heroes/delete-hero.dto';
import HttpError from '../errors/http-error';
import SearchHeroDto from '../../../src/domain/dto/heroes/search-hero.dto';
import path from 'path';
import fs from 'fs';
import ConfigApp from '../../../config-app';

class HeroDatasourceImpl implements HeroDataSource {
    private readonly jsonFile: string = path.join(ConfigApp.rootDirPath, "./src/presentation/data/heroes.json");
    private readonly contextPath: string = "./src/infrastructure/datasource/hero.datasource.impl.ts";

    public constructor(
        private readonly logService: LogService
    ) {}
    
    public searchHero({ superhero }: SearchHeroDto): Promise<HeroEntity[]> {
        
        const { heroes } = heroesJsonDb as HeroEntityResponse;
        
        const matches: HeroEntity[] = heroes.filter((hero) => hero.superhero.toLowerCase().match(superhero));

        return Promise.resolve(matches);
    }

    public async createHero(hero: CreateHeroDto): Promise<HeroEntity> {
        const { heroes }: HeroEntityResponse = heroesJsonDb as HeroEntityResponse;
        
        const findHero: HeroEntity | undefined = heroes.find((heroEntity) => heroEntity.id === hero.id);
        
        if (findHero) throw HttpError.conflict("hero already exist");

        const newHero: HeroEntity = { 
            id: hero.id,
            alter_ego: hero.alter_ego,
            first_appearance: hero.first_appearance,
            characters: hero.characters,
            publisher: hero.publisher as Publisher,
            superhero: hero.superhero,
            alt_image: hero.alt_image
        };

        heroes.push(newHero);

        fs.writeFileSync(this.jsonFile, JSON.stringify({ heroes: heroes }, null, 4), { encoding: "utf-8", flag: "w" });

        return Promise.resolve(newHero);
    }

    public async updateHero(hero: UpdateHeroDto): Promise<HeroEntity> {
        const heroesResponse: HeroEntityResponse = heroesJsonDb as HeroEntityResponse;

        const heroes: HeroEntity[] = [];
        let heroDeleted: HeroEntity | undefined = {} as HeroEntity;
        
        for(const heroEntity of heroesResponse.heroes) {
            if (heroEntity.id !== hero.id) heroes.push(heroEntity);

            if (heroEntity.id === hero.id) heroDeleted = heroEntity;
        }

        if (!heroDeleted) throw HttpError.notFound("hero not found");

        const heroUpdated: HeroEntity = {
            id: heroDeleted.id,
            alter_ego: hero.alter_ego,
            characters: hero.characters,
            first_appearance: hero.first_appearance,
            publisher: hero.publisher as Publisher,
            superhero: hero.superhero, 
            alt_image: hero.alt_image
        };

        heroes.push(heroUpdated);

        fs.writeFileSync(this.jsonFile, JSON.stringify({ heroes: heroes }, null, 4), { encoding: "utf-8", flag: "w" });

        return Promise.resolve(heroUpdated);
    }

    public async deleteHero({ id }: DeleteHeroDto): Promise<string> {
        let initialValuesCountFlag: number = 0;

        const heroesResponse = heroesJsonDb as HeroEntityResponse;
        initialValuesCountFlag = heroesResponse.heroes.length;

        const heroesUpdate: HeroEntityResponse = {
            heroes: heroesResponse.heroes.filter((hero) => hero.id !== id)
        };

        if (initialValuesCountFlag === heroesUpdate.heroes.length) throw HttpError.notFound("hero not found");

        fs.writeFileSync(this.jsonFile, JSON.stringify(heroesUpdate, null, 4), { encoding: "utf-8" });

        return Promise.resolve(`Hero ${id} were deleted.`);
    }

    public async getAllHeroes(): Promise<HeroEntity[]> {
        const heroesResponse = heroesJsonDb as HeroEntityResponse;

        return Promise.resolve(heroesResponse.heroes);
    }

    public async getHeroById(id: string): Promise<HeroEntity> {
        const heroesResponse = heroesJsonDb as HeroEntityResponse;
        const hero: HeroEntity | undefined = heroesResponse.heroes.find((hero) => hero.id === id);

        if (!hero) throw HttpError.notFound("hero not exist.");

        return Promise.resolve(hero);
    }
}

export default HeroDatasourceImpl;
