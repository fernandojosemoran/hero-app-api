import fs from "fs";

fs.cpSync("./statics", "./dist/statics", { recursive: true });

