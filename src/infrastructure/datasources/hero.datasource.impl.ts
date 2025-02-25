import { HeroEntity, Publisher } from "../../domain/entities/hero.entity";

import HeroDataSource from "../../domain/datasources/hero.datasource";
import CreateHeroDto from '../../domain/dto/heroes/create-hero.dto';
import UpdateHeroDto from '../../domain/dto/heroes/update-hero.dto';
import DeleteHeroDto from '../../domain/dto/heroes/delete-hero.dto';
import HttpError from '../errors/http-error';
import SearchHeroDto from '../../../src/domain/dto/heroes/search-hero.dto';
import DbDatasourceImpl from "./db.datasource.impl";

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

        const wentSaved: boolean = await this._dbDatasource.add(newHero);

        if (!wentSaved) throw HttpError.internalServerError("Sorry some occurred wrong");

        return Promise.resolve(newHero);
    }

    public async updateHero(hero: UpdateHeroDto): Promise<HeroEntity> {
        const existHero = await this._dbDatasource.findOne(hero.id) as HeroEntity | undefined;
    
        if (!existHero) throw HttpError.notFound("hero not found");
        
        const updateHero = await this._dbDatasource.update(hero as HeroEntity) as HeroEntity | undefined ;
    
        if (!updateHero) throw HttpError.internalServerError("sorry some occurred wrong");

        return Promise.resolve(hero as HeroEntity);
    }

    public async deleteHero({ id }: DeleteHeroDto): Promise<string> {
        const existHero = await this._dbDatasource.findOne(id) as HeroEntity | undefined;
    
        if (!existHero) throw HttpError.notFound("hero not found");

        const wentDeleted = await this._dbDatasource.delete(id) as HeroEntity | undefined;

        if (!wentDeleted) throw HttpError.notFound("hero not found");

        return Promise.resolve(`Hero ${id} were deleted.`);
    }

    public async getAllHeroes(): Promise<HeroEntity[]> {
        const heroes = await this._dbDatasource.findMany() as HeroEntity[];
        return Promise.resolve(heroes);
    }

    public async getHeroById(id: string): Promise<HeroEntity> {
        const hero = await this._dbDatasource.findOne(id) as HeroEntity | undefined;

        if (!hero) throw HttpError.notFound("hero not exist.");

        return Promise.resolve(hero);
    }
}

export default HeroDatasourceImpl;
