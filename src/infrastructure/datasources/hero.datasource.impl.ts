import { HeroEntity, Publisher } from "../../domain/entities/hero.entity";
import { heroesOutputs } from "../../domain/outputs/heroes.out";

import HeroDataSource from "../../domain/datasources/hero.datasource";
import CreateHeroDto from '../../domain/dto/heroes/create-hero.dto';
import UpdateHeroDto from '../../domain/dto/heroes/update-hero.dto';
import DeleteHeroDto from '../../domain/dto/heroes/delete-hero.dto';
import HttpError from '../errors/http-error';
import SearchHeroDto from '../../../src/domain/dto/heroes/search-hero.dto';
import DbDatasourceImpl from "./db.datasource.impl";

// hidden dependencies
const { endpoint } = heroesOutputs;

class HeroDatasourceImpl implements HeroDataSource {

    public constructor(
        private readonly _dbDatasource: DbDatasourceImpl
    ) {}
    
    public async searchHero({ superhero }: SearchHeroDto): Promise<HeroEntity[]> {
    
        const heroes = await this._dbDatasource.findMany() as HeroEntity[];
        
        const matches: HeroEntity[] = heroes.filter((hero) => hero.superhero.toLowerCase().match(superhero));

        return Promise.resolve(matches);
    }

    public async createHero(hero: CreateHeroDto): Promise<HeroEntity> {
        const findHero = await this._dbDatasource.findOne(hero.id) as HeroEntity | undefined;
        
        if (findHero) throw HttpError.conflict(endpoint.HERO_ALREADY_EXISTS);

        const newHero: HeroEntity = { 
            id: hero.id,
            alter_ego: hero.alter_ego,
            first_appearance: hero.first_appearance,
            characters: hero.characters,
            publisher: hero.publisher as Publisher,
            superhero: hero.superhero,
            alt_image: hero.alt_image
        };

        const wentSaved: boolean = await this._dbDatasource.add(newHero);

        if (!wentSaved) throw HttpError.internalServerError(endpoint.SOMETHING_OCCURRED_WRONG);

        return Promise.resolve(newHero);
    }

    public async updateHero(hero: UpdateHeroDto): Promise<HeroEntity> {
        const existHero = await this._dbDatasource.findOne(hero.id) as HeroEntity | undefined;
    
        if (!existHero) throw HttpError.notFound(endpoint.HERO_NOT_FOUND);
        
        const updateHero = await this._dbDatasource.update(hero as HeroEntity) as HeroEntity | undefined ;
    
        if (!updateHero) throw HttpError.internalServerError(endpoint.SOMETHING_OCCURRED_WRONG);

        return Promise.resolve(hero as HeroEntity);
    }

    public async deleteHero({ id }: DeleteHeroDto): Promise<string> {
        const existHero = await this._dbDatasource.findOne(id) as HeroEntity | undefined;
    
        if (!existHero) throw HttpError.notFound(endpoint.HERO_NOT_FOUND);

        const wentDeleted = await this._dbDatasource.delete(id) as HeroEntity | undefined;

        if (!wentDeleted) throw HttpError.notFound(endpoint.HERO_NOT_FOUND);

        return Promise.resolve(`Hero ${id} were deleted.`);
    }

    public async getAllHeroes(): Promise<HeroEntity[]> {
        const heroes = await this._dbDatasource.findMany() as HeroEntity[];
        return Promise.resolve(heroes);
    }

    public async getHeroById(id: string): Promise<HeroEntity> {
        const hero = await this._dbDatasource.findOne(id) as HeroEntity | undefined;

        if (!hero) throw HttpError.notFound(endpoint.HERO_NOT_FOUND);

        return Promise.resolve(hero);
    }
}

export default HeroDatasourceImpl;
