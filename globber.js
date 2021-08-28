const fs = require("fs");

async function listFilesByPattern(pattern, dir) {
  if (typeof pattern === "string") {
    pattern = new RegExp(pattern);
  }

  const files = await fs.promises.readdir(dir);
  return files.filter((f) => f.match(pattern));
}

function getMonth() {
  return new Date().getMonth() + 1;
}

function getYear() {
  return new Date().getFullYear();
}

function getYearMonths(numberOfSkipped) {
  console.log(numberOfSkipped);
  const out = [];
  let month = getMonth();
  while (month > 0) {
    out.push(month--);
  }

  return out.slice(numberOfSkipped);
}

function toRegex(str) {
  return new RegExp(str);
}

/**
 * @param {string} path
 * @returns {(obj:import("./types").IGlobObject)=>boolean}
 */
function removeEmpty(path) {
  return function ({ pattern }) {
    const files = fs.readdirSync(path);
    return files.filter((f) => f.match(toRegex(pattern))).length > 0;
  };
}

function getKey(month, year) {
  return month.length === 2 ? `${month}-${year}` : `0${month}-${year}`;
}

function patternFormer(base, suffix) {
  return function (pattern) {
    return `${base}${pattern}${suffix}`;
  };
}

/**
 *
 * @param {import('./types').BasicOpts} config
 * @returns {import("./types").IGlobObject[]}
 */
function getGlobByMonthObjects({
  numberOfSkipped,
  basePattern,
  suffix,
  baseDir,
}) {
  let months = getYearMonths(numberOfSkipped);
  const year = getYear();
  const formPattern = patternFormer(basePattern + year + "-[0-1]", suffix);
  return months
    .map((month) => ({
      name: getKey(month, year),
      pattern: formPattern(month),
    }))
    .filter(removeEmpty(baseDir));
}

module.exports = { getGlobByMonthObjects, listFilesByPattern };
