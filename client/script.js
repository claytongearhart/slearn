const qElem = document.getElementById('questionArea')

function getVar(length) {
    var result           = '';
    var characters       = 'abcdfghjklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let input = document.getElementById("input");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.code === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submitBut").click();
  }
}); 

let ans = 0;

function chLogUKK()
{
    const solveFor = getVar(1)
    const ofN = getRandomInt(100)
    const eq = getRandomInt(100)
    const hText = document.createElement("h3");
    hText.append(document.createTextNode("Solve for "))
    hText.insertAdjacentHTML('beforeend', katex.renderToString(solveFor))
    qElem.append(hText) // `log_{${solveFor}}(ofN) = eq`
    const equation = document.createElement("span");
    equation.id = "eq"
    katex.render(`\\log_{${solveFor}}(${ofN}) = ${eq}`, equation, {
      throwOnError: false
  });
    qElem.append(equation)

  ans = ofN ** (1/eq)

}

function submit()
{
  const value = document.getElementById("input").value
  console.log({Inputted: math.round(value, 2), Expected: math.round(ans,2)})
  if (math.round(value, 2) === math.round(ans,2))
  {
    alert("right")
    location.reload()
    document.getElementById("input").value = ""
  }
  else
  {
    alert("wrong")
  }
}

window.onload = function() {
  chLogUKK()
}
