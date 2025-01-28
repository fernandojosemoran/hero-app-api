import { HeroEntity } from "../../../domain/entities/hero.entity";

import CreateHeroDto from "../../../domain/dto/heroes/create-hero.dto";
import HeroRepositoryImpl from "../../../infrastructure/repositories/hero.repository.impl";
import UpdateHeroDto from "../../../domain/dto/heroes/update-hero.dto";
import DeleteHeroDto from "../../../domain/dto/heroes/delete-hero.dto";
import GetHeroByIdDto from "../../../../src/domain/dto/heroes/get-hero-by-id.dto";
import SearchHeroDto from "../../../../src/domain/dto/heroes/search-hero.dto";

class HeroService {
    public constructor(
        private readonly heroRepository: HeroRepositoryImpl
    ) {}

    public createHero(dto: CreateHeroDto): Promise<HeroEntity> {
        return this.heroRepository.createHero(dto);
    }

    public updateHero(dto: UpdateHeroDto): Promise<HeroEntity> {
        return this.heroRepository.updateHero(dto);
    }

    public deleteHero(dto: DeleteHeroDto): Promise<string> {
        return this.heroRepository.deleteHero(dto);
    }

    public getAllHeroes(): Promise<HeroEntity[]> {
        return this.heroRepository.getAllHeroes();
    }

    public getHeroById(dto: GetHeroByIdDto): Promise<HeroEntity> {
        return this.heroRepository.getHeroById(dto.id);
    }

    public searchHero(dto: SearchHeroDto): Promise<HeroEntity[]>{
        return this.heroRepository.searchHero(dto);
    }
}

export default HeroService;