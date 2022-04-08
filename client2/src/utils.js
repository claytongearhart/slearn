import { round } from "mathjs";
import { evaluateTex } from "tex-math-parser"; // ES6 module


function getRandomNum(max = 100) {
  return Math.random() * max + 2;
}

function normalizeLatex(latex)
{
    const regPat = /\\log_{?(.*?)}?\((.*?)\)/g;
    return latex.replace(regPat, "(\\frac{\\log($2)}{\\log($1)})")
}

function latexEqual(exp1, exp2, vars = [], iter) {
  console.log([exp1, exp2])

    exp1 = normalizeLatex(exp1)
    exp2 = normalizeLatex(exp2)
    console.table({"vars": vars})
    console.table([exp1, exp2])

    if (!exp1 || !exp2)
    {
        return false
    }
  const varObject = {};
  if (vars.length > 0) {
    for (let i = 0; i < iter; i++) {
      for (let j = 0; j < vars.length; j++) {
        varObject[vars[j]] = getRandomNum();
      }

      console.log(23);
      if (round(evaluateTex(exp1, varObject).evaluated, 3) !== round(evaluateTex(exp2, varObject).evaluated,3)) {
        console.table([evaluateTex(exp1, varObject), evaluateTex(exp2, varObject)])
        return false;
      }
    }
    return true;
  } else {
    console.warn("Empty input")
    if (evaluateTex(exp1) === evaluateTex(exp2)) {
      return true;
    } else {
      return false;
    }
  }
}

export { latexEqual };
