import fs from "fs";

const dataPath: string = "./dist/src/presentation/data";

if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

fs.cpSync("./src/presentation/data/heroes.json", "./dist/src/presentation/data/heroes.json", { recursive: true });
fs.cpSync("./src/presentation/data/user.json", "./dist/src/presentation/data/user.json", { recursive: true });
