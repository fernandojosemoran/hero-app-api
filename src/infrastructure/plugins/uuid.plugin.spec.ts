import UUID from './uuid.plugin';

describe('./src/infrastructure/plugins/uuid.plugin.ts', () => {
    const uuidPlugin: UUID = new UUID();

    test('Should have a property called generateV4UUID', () => {
        expect(uuidPlugin).toHaveProperty("generateV4UUID");
    });

    test('Should have a generateV4UUID as method', () => {
        expect(typeof uuidPlugin.generateV4UUID).toBe("function");
    });

    test('Should generate a random ID with generateV4UUID method', () => {
        const uuid: string = uuidPlugin.generateV4UUID();

        expect(uuid).not.toBeUndefined();
        expect(typeof uuid).toBe("string");
    });
});