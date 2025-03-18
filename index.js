const fs = require("fs");

async function readCode(inputFile) {
  const code = await fs.promises.readFile(inputFile, "utf-8");

  return code;
}

async function bundle(inputFile, output) {
  const code = await readCode(inputFile);

  console.log(code);
}

const inputFile = process.argv[2];
const output = process.argv[3];

bundle(inputFile, output);
