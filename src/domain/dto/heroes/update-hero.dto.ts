import { Publisher } from "../../../domain/entities/hero.entity";

interface IUpdateHeroDtoParams {
    id: number;
    alter_ego: string;
    characters: string;
    first_appearance: string;
    publisher: Publisher | string;
    alt_image?: string;
    superhero: string;
}

function normalizeHeroId(publisher: Publisher, superhero: string): string {
    let superheroId: string = superhero.replace(" ", "-").toLowerCase();

    switch (publisher) {
        case Publisher.DCComics: 
            superheroId = `dc-${superheroId}`;
            break;
        case Publisher.MarvelComics: 
            superheroId = `marvel-${superheroId}`;
            break;
        default:

    }

    return superheroId;
}

class UpdateHeroDto {
    private constructor(
        public readonly id: string,
        public readonly alter_ego: string,
        public readonly characters: string,
        public readonly first_appearance: string,
        public readonly publisher: Publisher | string,
        public readonly superhero: string,
        public readonly alt_image?: string,
    ) {}

    public static create(hero: IUpdateHeroDtoParams): [UpdateHeroDto?, string?] {
        let publisherDetected: Publisher;

        const {
            id,
            alter_ego,
            characters,
            first_appearance,
            publisher,
            superhero,
            alt_image
        } = hero;

        if (!id) return [ undefined, "id param is required." ];
        if (!alter_ego) return [ undefined, "alter_ego is require." ];
        if (!characters) return [ undefined, "characters is require." ];
        if (!first_appearance) return [ undefined, "first_appearance is require." ];
        if (!publisher) return [ undefined, "publisher is require." ];
        if (!superhero) return [ undefined, "superhero is require." ];

        if (!(publisher === Publisher.DCComics || publisher === Publisher.MarvelComics)) return [ undefined, "publisher property is invalid." ];
        
        switch (publisher) {
            case Publisher.DCComics:
                publisherDetected = Publisher.DCComics;
                break;
            default: 
                publisherDetected = Publisher.MarvelComics;
                break;
        }

        const generateId: string = normalizeHeroId(publisher, superhero);

        return [
            new UpdateHeroDto(
                generateId, 
                alter_ego, 
                characters,
                first_appearance,
                publisherDetected,
                superhero, alt_image
            ), 
            undefined
        ];
    }
}

export default UpdateHeroDto;