import { HeroEntity } from "../../domain/entities/hero.entity";

import HeroRepository from "../../domain/datasources/hero.datasource";
import HeroDatasourceImpl from "../datasources/hero.datasource.impl";
import CreateHeroDto from "../../domain/dto/heroes/create-hero.dto";
import UpdateHeroDto from "../../domain/dto/heroes/update-hero.dto";
import DeleteHeroDto from "../../domain/dto/heroes/delete-hero.dto";
import SearchHeroDto from "../../../src/domain/dto/heroes/search-hero.dto";

class HeroRepositoryImpl implements HeroRepository {
    public constructor(
        private readonly datasource: HeroDatasourceImpl
    ){}

    public createHero(dto: CreateHeroDto): Promise<HeroEntity> {
        return this.datasource.createHero(dto);
    }
    public updateHero(dto: UpdateHeroDto): Promise<HeroEntity> {
        return this.datasource.updateHero(dto);
    }
    public deleteHero(dto: DeleteHeroDto): Promise<string> {
        return this.datasource.deleteHero(dto);
    }
    public getAllHeroes(): Promise<HeroEntity[]> {
        return this.datasource.getAllHeroes();
    }
    public getHeroById(id: string): Promise<HeroEntity> {
        return this.datasource.getHeroById(id);
    }
    public searchHero(dto: SearchHeroDto): Promise<HeroEntity[]> {
        return this.datasource.searchHero(dto);
    }
}

export default HeroRepositoryImpl;