const baseString = "\\log_{s}(q)"
const regPat = /log_{(.*?)}\((.*?)\)/g;
// const cosas = [...baseString.matchAll(regPat)]
// console.table(cosas)

console.table(baseString.replace(regPat, "(\\frac{\\log($2)}{\\log($1)})"))