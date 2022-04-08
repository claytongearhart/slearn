import
  {
    Breadcrumbs,
    Card,
    Grid,
    Keyboard,
    Loading,
    Popover,
    Text
  } from "@geist-ui/core";
import * as Icon from "@geist-ui/icons";
import { useAtom } from "jotai";
import { atomWithHash } from "jotai/utils";
import * as React from "react";
import { useQuery } from "react-query";
import { animated, config, useSpring } from "react-spring";
import "react-toastify/dist/ReactToastify.min.css";
import "./app.css";
import GContext from "./context";
import problems from "./problems";

// const GContext = React.lazy(() => import('./context'))
// const problems = React.lazy(() => import('./problems'))

const topicPath = atomWithHash("عنوان", []);

function Number() {
  const [flip, set] = React.useState(false);
  const { number } = useSpring({
    reset: true,
    reverse: flip,
    from: { number: 0 },
    number: 1,
    delay: 100,
    config: config.molasses,
    onRest: () => set(!flip),
  });

  return <animated.div>{number.to((n) => n.toFixed(2))}</animated.div>;
}

async function fetchMath() {
  const res = await fetch("https://learn.sabinalobo.me/data/math.json");
  return res.json();
}

async function fetchChem() {
  const res = await fetch("https://learn.sabinalobo.me/data/chem.json");
  return res.json();
}
function QuestionScreen(props) {
  return (
    <div className="questionScreen">{props.children}</div>
    // <p>q</p>
  );
}

const deepSearch = (object, key, predicate) => {
  if (object.hasOwnProperty(key) && predicate(key, object[key]) === true)
    return object;

  for (let i = 0; i < Object.keys(object).length; i++) {
    let value = object[Object.keys(object)[i]];
    if (typeof value === "object" && value != null) {
      let o = deepSearch(object[Object.keys(object)[i]], key, predicate);
      if (o != null) return o;
    }
  }
  return null;
};

function MainHeader(props) {
  function toChem() {
    props.setSubject(["chem"]);
  }
  function toMath() {
    props.setSubject(["Mathematics"]);
  }

  return (
    <header className="mainHeader">
      <Grid.Container>
        <Grid xs={3}>
          <Text onClick={toChem}>Chemistry</Text>
        </Grid>
        <Grid xs={3}>
          <Text onClick={toMath}>Mathematics</Text>
        </Grid>
      </Grid.Container>
    </header>
  );
}

function SubSelector(props) {
  const [path, setPath] = props.topic;
  const [topics, setTopics] = React.useState(props.data);
  React.useEffect(() => {
    if (path.length <= 1) {
      setTopics(props.data);
    } else {
      setTopics(
        deepSearch(props.data, "topic", (k, v) => v === path[path.length - 1])
          .subtopics
      );
    }
  }, [topics, path, props.data]);
  const topicClick = (e) => {
    const ele = topics.find(
      (element) => element["topic"] === e.nativeEvent.target.innerText
    );
    if (ele.parent) {
      setTopics(ele.subtopics);
      setPath(path.concat([e.nativeEvent.target.innerText]));
    } else {
      props.cqTopic(ele.key);
    }
  };

  return (
    <div className="selector">
      <Card>
        <Text h3>
          <Breadcrumbs>
            {path.map((object, i) => (
              <Breadcrumbs.Item
                onClick={() => {
                  setPath(path.slice(0, i + 1));
                }}
              >
                {object}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
        </Text>
        {topics.map((object, i) => (
          <Text onClick={topicClick}> {object.topic} </Text>
        ))}
      </Card>
    </div>
    // <p>ss</p>
  );
}

function App() {
  const [subject, setSubject] = useAtom(topicPath);
  const [qTopic, setQTopic] = React.useState("blank");
  const math = useQuery("Mathematics", fetchMath, {
    enabled: subject[0] === "Mathematics",
  });
  const chem = useQuery("chem", fetchChem, { enabled: subject[0] === "chem" });
  const beanie = React.useContext(GContext)

  let data = subject[0] === "Mathematics" ? math.data : chem.data;

  return (
    <div className="index">
      <MainHeader setSubject={setSubject} />
      {math.status !== "success" ? (
        <Loading />
      ) : (
        <SubSelector
          topic={[subject, setSubject]}
          data={data}
          cqTopic={setQTopic}
        />
      )}
      <QuestionScreen>
        <section style={{ display: "grid", padding: "1rem" }}>
          {problems[qTopic]()}
          {(() => {
            const content = () => (
              <div>
                Subscript: <Keyboard shift>-</Keyboard>
              </div>
            );

            return (
              <Popover
                trigger="hover"
                content={content}
                style={{
                  justifySelf: "end",
                  display: "flex",
                  placeContent: "center",
                  paddingRight: ".25rem",
                }}
              >
                <Icon.QuestionCircle color="#666" />
              </Popover>
            );
          })()}
        </section>
        <section
          class="rightHelperBar"
          style={{
            height: "100%",
            borderLeft: "1px #E2E8F0 solid",
            gridColumn: "2/3",
            padding: "1rem",
          }}
        >
          <Number />
          {beanie.checkIter}
        </section>
      </QuestionScreen>
    </div>
  );
}

export default App;
