import React, {
    useState,
    useReducer,
    useMemo,
    useCallback,
    useEffect,
    useContext,
  } from "react";
  import { Text, Input, Spacer, Button } from "@geist-ui/core";
  import "katex/dist/katex.min.css";
  import TeX from "@matejmazur/react-katex";
  import * as Icon from "@geist-ui/icons";
  import { round, log, random } from "mathjs";
  import memoize from "fast-memoize";
  import { addStyles, EditableMathField } from "react-mathquill";
  import { latexEqual } from "./utils";
  import {toast } from 'react-toastify';
  import GContext from './context';

  

  addStyles();
  
  function logSolver(base, ofB, equals) {
    if (typeof base == "string") {
      return ofB ** (1 / equals);
    } else if (typeof ofB == "string") {
      return base ** equals;
    } else {
      return log(ofB, base);
    }
  }
  
  Array.prototype.random = function () {
    return this[(this.length * Math.random()) | 0];
  };
  
  Array.prototype.typeSort = function () {
    let returnValue = {};
    this.forEach((item) => {
      returnValue[typeof item] = Array(returnValue[typeof item], item)
        .flat()
        .filter((ele) => ele);
    });
    return returnValue;
  };
  
  function genRandChar() {
    var characters = "abcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    return characters.charAt(Math.floor(random(charactersLength)));
  }
  
  const randPermutation = (inputArr) => {
    // O(nlog(n))
    return inputArr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
  
  function genRandInt(max) {
    return (Math.random() * max) | 0;
  }
  
  function genNumArr(nums, vars) {
    let seedArr = [];
    for (let i = 0; i < vars; i++) {
      seedArr.push(genRandChar());
    }
    for (let i = 0; i < nums; i++) {
      seedArr.push(genRandInt(10) + 1);
    }
  
    return randPermutation(seedArr);
    //return permutator(seedArr); // Maybe instead of generating every possible permutation (n!) generate a single random permutation (n)
  }
  
  function SubmitBox(props) {
    const [inVal, setInVal] = React.useState("");
    const submit = () => {
      props.submitCall(inVal);
    };
    const handInChange = (e) => {
      setInVal(e.target.value);
    };
    const handKey = (e) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          props.cont();
        } else {
          submit();
        }
      }
    };
  
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Input
          onChange={handInChange}
          onKeyDown={handKey}
          onKeyUp={handKey}
          type={props.status}
        ></Input>
        <Spacer w={0} />
        <Button
          onClick={submit}
          type={props.status}
          style={{ height: "36px" }}
          icon={
            props.status === "error" ? (
              <Icon.X />
            ) : props.status === "success" ? (
              <Icon.Check />
            ) : (
              <Icon.CornerDownLeft />
            )
          }
          auto
        ></Button>
      </div>
    );
  }
  
  const DefLog = (props) => {
    // const { setToast } = useToasts()
    // const enterContToast = () => setToast({ text: 'Press enter to continue to the next problem', delay: 2000 })
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [status, setStatus] = useState("secondary");
    // const [arr, setArr] = useState(genNumArrs(3));
    // const [unknown, setUnknown] = useState(arr.typeSort().string);
    // const [ans, setAns] = useState(logSolver(arr[0], arr[1], arr[2]));
  
    const arr = genNumArr(3, 1);
    const unknown = arr.typeSort().string;
    const ans = logSolver(arr[0], arr[1], arr[2]);
  
    const check = useMemo(
      () =>
        memoize((a) => {
          console.table({ aVal: a });
          a = Number(a);
          if (round(a, 2) === round(ans, 2)) {
            console.log("correct");
            setStatus("success"); // SetStatus state updates and mofifies other things ?
          } else {
            console.log("wrong, ans is" + ans);
            setStatus("error");
          }
        }),
      [ans]
    );
  
    const cont = useCallback(() => {
      forceUpdate();
    }, []);
  
    return (
      <div style={{ display: "grid" }}>
        <Text h3>
          Solve for <TeX>{`${unknown}`}</TeX>
        </Text>
        <TeX>{`\\log_{${arr[0]}}(${arr[1]}) = ${arr[2]}`}</TeX>
        <Spacer h={2} />
        <SubmitBox cont={cont} submitCall={check} status={status} />
  
        <Button
          type="secondary"
          icon={<Icon.ArrowRight />}
          auto
          style={{ placeSelf: "end end" }}
          onClick={cont}
        ></Button>
      </div>
    );
  };
  
  const MathInput = (props) => {
    return (
      <div
        style={{
          borderRadius: "6px",
          border: "1px solid #666",
          alignItems: "center",
          display: "inline-flex",
          transition: "border 0.2s ease 0s,color 0.2s ease 0s",
        }}
      >
        <EditableMathField
          latex={props.latex}
          onChange={props.onChange}
          style={{
            border: "0px none",
            margin: "0.25em 0.635em",
            outline: "none",
            boxShadow: "none",
            minWidth: "3rem",
          }}
          onKeyDown={props.onKeyDown}
        />
        
      </div>
    );
  };
  
  const LatexProblem = (props) => {
    const [problem, updateProblem] = useState(props.generator);
    const [ans, updateAns] = useState("");
    const globalContext = useContext(GContext)
    useEffect(() => {
      updateProblem(props.generator);
    }, [props.generator]);
    const notifyAnsValidity = (good) =>
    {
        const toastProps = {
            position: toast.POSITION.BOTTOM_RIGHT,
            theme: "colored"
        }
        if (good)
        {
            toastProps.icon = <Icon.Check/>
        toast.success("Correct", (toastProps))
        }
        else
        {
            toastProps.icon = <Icon.X/>
            toast.error("Incorrect", toastProps)
        }
    }
    const change = (e) => {
      updateAns(e.latex());
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          updateProblem(props.generator);
          updateAns("");
        } else {
            notifyAnsValidity(problem.ansChecker(ans.replace(/\\left|\\right/g, ""), globalContext.checkIter))   
        }
      }
    };
  
    return (
      <div>
        <Text h4>{problem.question}</Text>
        <Spacer h={1} />
        <TeX>{problem.expression}</TeX>
        <Spacer h={1} />
        <MathInput latex={ans} onChange={change} onKeyDown={handleKeyDown} />
        {/* latex={ans} onChange={change} */}
      </div>
    );
  };
  
  function Blank() {
    return (
      <div>
        <Text h3>No topic selected yet.</Text>
        <Text>
          You can get started by selecting a subject from the header, then select
          a topic in the sidebar on the left.
        </Text>
      </div>
    );
  }
  
  function DefLogGen() {}
  
  function LogProdQuotPropGen() {
    const unknownCount = genRandInt(3);
    const vars = genNumArr(unknownCount, 3 - unknownCount);
    const centOp = ["+", "-"][round(random(1))];
    const ques = `\\log_{${vars[0]}}(${vars[1]}) ${centOp} \\log_{${vars[0]}}(${vars[2]})`;
    const cVars = vars.typeSort()["string"];
  
    return {
      question: "Simplify Into a Single Logarithm",
      expression: ques,
      ansChecker: (uAns, it) =>
        (uAns.match(/log/g) || []).length === 1
          ? latexEqual(uAns, ques, cVars, it)
          : false,
    };
  }
  
  function LogPowPropGen() {
    const unknownCount = genRandInt(3);
    const vars = genNumArr(unknownCount, 3 - unknownCount);
    const ques = `${vars[0]} \\log_{${vars[1]}}(${vars[2]})`;
    const cVars = vars.typeSort()["string"];
  
    return {
      question: "Simplify Into a Single Logarithm",
      expression: ques,
      ansChecker: (uAns, it) => latexEqual(uAns, ques, cVars, it),
    };
  }
  
  function LogChangeBaseGen() {
    const unknownCount = genRandInt(3);
    const vars = genNumArr(unknownCount, 3 - unknownCount);
    const ques = `\\log_{${vars[1]}}(${vars[2]})`;
    const cVars = vars.typeSort()["string"];
  
    return {
      question: `Change to base ${vars[0]}`,
      expression: ques,
      ansChecker: (uAns, it) => latexEqual(uAns, ques, cVars, it),
    };
  }
  
  const problems = {
    logDef: () => {
      return <DefLog />;
    },
    logProdQuotProp: () => <LatexProblem generator={LogProdQuotPropGen} />,
    logPowProp: () => <LatexProblem generator={LogPowPropGen} />,
    logCOB: () => <LatexProblem generator={LogChangeBaseGen} />,
    blank: Blank,
  };
  
  export default problems;
  