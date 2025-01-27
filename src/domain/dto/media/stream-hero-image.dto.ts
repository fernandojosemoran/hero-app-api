class StreamHeroImageDto {
    private constructor(
        public readonly image: string
    ) {}

    public static create(image: string): [ StreamHeroImageDto?, string? ] {
        if (!image) return [undefined, "image is required."];

        return [new StreamHeroImageDto(image), undefined];
    }
}

export default StreamHeroImageDto;