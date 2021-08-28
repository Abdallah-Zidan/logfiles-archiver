const fs = require("fs");
let data = "d   ta\n".repeat(10000000);
for (let i = 0; i < 30; i++) {
  fs.appendFileSync("./logs/feo_1-out.log", data);
}

for (let i = 0; i < 30; i++) {
  fs.appendFileSync("./logs/feo_2-out.log", data);
}
