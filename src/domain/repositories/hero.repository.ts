import CreateHeroDto from "../dto/heroes/create-hero.dto";
import SearchHeroDto from "../dto/heroes/search-hero.dto";
import { HeroEntity } from "../entities/hero.entity";

abstract class HeroRepository {
    abstract createHero(hero: CreateHeroDto): Promise<HeroEntity>;
    abstract updateHero(hero: HeroEntity): Promise<HeroEntity>;
    abstract deleteHero(): Promise<string>;
    abstract getAllHeroes(): Promise<HeroEntity[]>;
    abstract getHeroById(id: number): Promise<HeroEntity>;
    abstract searchHero(dto: SearchHeroDto): Promise<HeroEntity[]>;
}

export default HeroRepository;