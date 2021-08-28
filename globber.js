const fs = require("fs");

function getMonth() {
  return new Date().getMonth() + 1;
}

function getYear() {
  return new Date().getFullYear();
}

function getYearMonths(numberOfSkipped) {
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

function removeEmpty(path) {
  return function ({ regex }) {
    const files = fs.readdirSync(path);
    return files.filter((f) => f.match(regex)).length > 0;
  };
}

function getKey(month, year) {
  return month.length === 2 ? `${month}-${year}` : `0${month}-${year}`;
}

function getPatterns({ numberOfSkipped, basePattern, suffix, baseDir }) {
  let months = getYearMonths(numberOfSkipped);
  const year = getYear();
  return months
    .map((month) => ({
      name: getKey(month, year),
      pattern: `${basePattern}${year}-[0-1]${month}${suffix}`,
      regex: toRegex(`${basePattern}${year}-[0-1]${month}${suffix}`),
    }))
    .filter(removeEmpty(baseDir));
}

module.exports = getPatterns;
