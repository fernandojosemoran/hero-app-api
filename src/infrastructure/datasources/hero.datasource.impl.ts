import { HeroEntity, HeroEntityResponse, Publisher } from "../../domain/entities/hero.entity";

import heroesJsonDb from "../../presentation/data/heroes.json";
import HeroDataSource from "../../domain/datasources/hero.datasource";
import CreateHeroDto from '../../domain/dto/heroes/create-hero.dto';
import UpdateHeroDto from '../../domain/dto/heroes/update-hero.dto';
import DeleteHeroDto from '../../domain/dto/heroes/delete-hero.dto';
import HttpError from '../errors/http-error';
import SearchHeroDto from '../../../src/domain/dto/heroes/search-hero.dto';
import path from 'path';
import fs from 'fs';
import configApp from "../../../config-app";

class HeroDatasourceImpl implements HeroDataSource {
    private jsonFile: string = path.join(configApp.rootDirPath, "src/presentation/data/heroes.json");

    public constructor() {}
    
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
        const rawData = fs.readFileSync(this.jsonFile, { encoding: "utf-8" });

        const { heroes }: HeroEntityResponse = JSON.parse(rawData) as HeroEntityResponse;
    
        const heroCount: number = heroes.length;
    
        const heroesFiltered = heroes.filter((heroEntity) => heroEntity.id !== hero.id);
    
        if (heroCount === heroesFiltered.length) throw HttpError.notFound("hero not found");

        heroesFiltered.push(hero as HeroEntity);
    
        fs.writeFileSync(this.jsonFile, JSON.stringify({ heroes: heroesFiltered }, null, 4), { encoding: "utf-8", flag: "w" });
    
        Object.assign(heroesJsonDb, { heroes: heroesFiltered });
    
        return Promise.resolve(hero as HeroEntity);
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
