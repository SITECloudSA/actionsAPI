const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const package = require("../package.json");

const IGNORED_PATHS = ["examples", "scripts", ".git", "build"];

const dirs = fs.readdirSync(path.join(__dirname, ".."));
for (const dir of dirs) {
  !IGNORED_PATHS.includes(dir) && fs.cpSync(dir, `./build/${dir}`, { recursive: true, verbatimSymlinks: true });
}

// execSync(`cd ./build && npm unlink ${package.name}`, { stdio: "inherit" });
execSync(`cd ./build && npm link`, { stdio: "inherit" });
execSync(`npm link ${package.name}`, { stdio: "inherit" });
