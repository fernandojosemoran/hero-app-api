 
import StreamHeroImageDto from "./stream-hero-image.dto";

describe('./src/domain/dto/media/stream-hero-image.dto.ts', () => {

    test("Should contain a property create", () => {
        expect(StreamHeroImageDto).toHaveProperty("create");
    });

    test("Should return an error if image property is empty", () => {
        const [ , error ] = StreamHeroImageDto.create("");

        expect(error).toBe("image is required.");
    });

    test('Should return a valid login dto with correct properties when arguments are valid', () => {
        const [ dto ,  ] = StreamHeroImageDto.create("test-image.jpg");

        expect(dto).not.toBeUndefined();
        expect(dto).toHaveProperty("image");
    });
});