import * as fs from "fs";
import * as path from "path";

interface Dependency {
  name: string;
  code: string;
}

async function generateDependencies(code: string, parentDir: string) {
  const dependencies: Array<Dependency> = [];

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

async function readCode(inputFile: string, bundle = "") {
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
  modules["${moduleName}"] = function (module) {
    function require(dependencyName) {
      return _require(path.join("${path.dirname(
        moduleName
      )}", dependencyName) + ( dependencyName.endsWith(".js")?"":".js" ))
    }

    ${code}
  }
  `;

  return bundle;
}

async function bundle(entryPoint: string) {
  const code = await readCode(entryPoint);

  const bundle = `
  const path = require('path')

      const modules = {};

      function _require(moduleName) {
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
// const output = process.argv[3];

const entryPoint = path.resolve(inputFile);

bundle(entryPoint);
