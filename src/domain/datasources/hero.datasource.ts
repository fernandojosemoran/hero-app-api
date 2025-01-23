import CreateHeroDto from "../dto/heroes/create-hero.dto";
import DeleteHeroDto from "../dto/heroes/delete-hero.dto";
import SearchHeroDto from "../dto/heroes/search-hero.dto";
import UpdateHeroDto from "../dto/heroes/update-hero.dto";
import { HeroEntity } from "../entities/hero.entity";

abstract class HeroDataSource {
    abstract createHero(dto: CreateHeroDto): Promise<HeroEntity>;
    abstract updateHero(dto: UpdateHeroDto): Promise<HeroEntity>;
    abstract deleteHero(dto: DeleteHeroDto): Promise<string>;
    abstract getAllHeroes(): Promise<HeroEntity[]>;
    abstract getHeroById(dto: string): Promise<HeroEntity>;
    abstract searchHero(dto: SearchHeroDto): Promise<HeroEntity[]>;
}

export default HeroDataSource;