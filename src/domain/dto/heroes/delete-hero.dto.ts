class DeleteHeroDto {
    private constructor(
        public readonly id: string
    ) {}

    public static create(id: string): [ DeleteHeroDto?, string? ] {
        if (!id) return [ undefined, "id is required." ];

        return [ new DeleteHeroDto(id), undefined ];
    }
}

export default DeleteHeroDto;