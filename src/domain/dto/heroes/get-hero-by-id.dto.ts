class GetHeroByIdDto {
    private constructor(public readonly id: string) {}

    public static create(id: string): [GetHeroByIdDto?, string?] {

        if (!id) return [ undefined, "Id is required." ];

        return [ new GetHeroByIdDto(id), undefined ];
    }
}

export default GetHeroByIdDto;