class SearchHeroDto {
    private constructor(
        public superhero: string
    ) {}

    public static create(superhero: string): [ SearchHeroDto?, string? ] {

        if (!superhero) return [ undefined, "Superhero property is required." ];

        return [ new SearchHeroDto(superhero.toLowerCase()), undefined ];
    }
}

export default SearchHeroDto;