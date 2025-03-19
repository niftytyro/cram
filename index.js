// Things to think about:
// 1. node module resolution algorithm
// 2. .cjs & esm integration - if package is esm, code is cjs or vice versa, how will that work?
// 3. Same dependency for many files
// 4. node_modules
// 5. minification
//
// 1. Start executing Code
// 2. Encounter a dependency
// 3. Bring code from there and cram into the bundle

// function getCode(inputFile) {
//   const code = read(inputFile);

//   const dependencies = findDependencies(code);

//   dependencies.forEach((dependency) => {
//     const dependencyCode = getCode(dependency);
//     code.replaceRequireWithCode(dependency, dependencyCode);
//   });

//   return code;
// }

const fs = require("fs");
const path = require("path");

/**
 * @param {string} code
 */
async function generateDependencies(code, parentDir) {
  const dependencies = [];

  const requireStatements = code
    .split("\n")
    .filter((statement) => statement.includes("require("));

  for (let statement of requireStatements) {
    const requireExpression = statement.match(/require\(.+\)/)?.[0];
    if (requireExpression) {
      const start = requireExpression.indexOf("(") + 2;
      const end = requireExpression.indexOf(")") - 1;

      let inputFile = requireExpression.slice(start, end);
      if (
        (inputFile.includes("./") || inputFile.includes(".\\")) &&
        !inputFile.endsWith(".js")
      ) {
        inputFile += ".js";
      }
      inputFile = path.resolve(parentDir, inputFile);

      const code = await readCode(inputFile);

      dependencies.push({
        name: inputFile,
        code: code,
      });
    }
  }

  return dependencies;
}

async function readCode(inputFile, bundle = "") {
  // const moduleName = getModuleName(inputFile);
  const moduleName = inputFile;

  const code = await fs.promises.readFile(inputFile, "utf-8");

  const dependencies = await generateDependencies(
    code,
    path.dirname(inputFile)
  );

  dependencies.forEach((dependency) => {
    bundle += dependency.code;
  });

  bundle += `
  modules["${moduleName}"] = function () {
    ${code}
  }
  `;

  return bundle;
}

async function bundle(entryPoint, output) {
  const code = await readCode(entryPoint);

  const bundle = `
      const modules = {};

      function require(moduleName) {
        const module = {exports: {}}


        modules[moduleName](module); // someModuleExportsHereWhileRunningTheCodeInTheModule;
        
        return module.exports;
      }

      ${code}

      modules["${entryPoint}"]()
    `;

  console.log(bundle);

  // writeToFile(output, code);
}

const inputFile = process.argv[2];
const output = process.argv[3];

const entryPoint = path.resolve(inputFile);

bundle(entryPoint, output);
