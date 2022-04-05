import
  {
    Card,
    CssBaseline,
    GeistProvider,
    Grid,
    Keyboard,
    Link,
    Loading,
    Popover,
    Text
  } from "@geist-ui/core";
import * as Icon from "@geist-ui/icons";
import * as React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import problems from "./problems";
import './styles.css';

const queryClient = new QueryClient();

async function fetchMath() {
  const res = await fetch("https://learn.sabinalobo.me/data/math.json");
  return res.json();
}

async function fetchChem() {
  const res = await fetch("https://learn.sabinalobo.me/data/chem.json");
  return res.json();
}

function Accordion(props) {
  const [open, setOpen] = React.useState(false);
  function changeState() {
    setOpen(!open);
  }
  return (
    <div>
      <Text h4 onClick={changeState}>
        {props.title}
      </Text>
      {open ? props.children : ""}
    </div>
  );
}

function QuestionScreen(props) {
  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <div
        style={{
          padding: "0",
          width: "100%",
          background: "#fff",
          transition: "all 0.2s ease",
          borderRadius: "6px",
          boxSizing: "border-box",
          border: "1px solid #eaeaea",
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
        }}
      >
        {props.children}
      </div>
    </div>
    // <p>q</p>
  );
}

function MainHeader(props) {
  function toChem() {
    props.setSubject("chem");
  }
  function toMath() {
    props.setSubject("math");
  }

  return (
    <header
      style={{
        borderBottom: "1px #E2E8F0 solid",
        width: "100vw",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Grid.Container>
        {/* <Grid xs={4}>
          <Text b >SLearn</Text>
        </Grid> */}
        <Grid xs={3}>
          <Link onClick={toChem} href="#">
            Chemistry
          </Link>
        </Grid>
        <Grid xs={3}>
          <Link href="#" onClick={toMath}>
            Mathematics
          </Link>
        </Grid>
      </Grid.Container>
    </header>
  );
}

function Subtopic(props) {
  function clickHand() {
    console.log(problems[props.object.key]);
    props.cqt(props.object.key);
  }
  return (
    <Text p onClick={clickHand}>
      {props.object.topic}
    </Text>
  );
}
function Topic(props) {
  return (
    <Accordion title={props.data.topic}>
      {props.data.subtopics.map((object, i) => (
        <Subtopic object={object} cqt={props.cqt} />
      ))}
    </Accordion>
  );
}

function SubSelector(props) {
  return (
    <div style={{ padding: "1rem", width: "100%" }}>
      <Card>
        {props.data.map((object, i) => (
          <Topic data={object} cqt={props.cqTopic} />
        ))}
      </Card>
    </div>
    // <p>ss</p>
  );
}

function Ok() {
  const [subject, setSubject] = React.useState("None");
  const [qTopic, setQTopic] = React.useState("blank");
  const math = useQuery("math", fetchMath, { enabled: subject === "math" });
  const chem = useQuery("chem", fetchChem, { enabled: subject === "chem" });

  let data = subject === "math" ? math.data : chem.data;

  return (
    <GeistProvider>
      <CssBaseline />

      <Grid.Container style={{ width: "100vw", height: "100vh" }}>
        <Grid xs={24} height={"4rem"}>
          <MainHeader setSubject={setSubject} />
        </Grid>
        <Grid xs={24} md={6} height={"calc(15vh - 2cm)"}>
          {math.status !== "success" ? (
            <Loading />
          ) : (
            <SubSelector data={data} cqTopic={setQTopic} />
          )}
        </Grid>
        <Grid xs={24} md={18} height={"85vh"}>
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
              style={{
                height: "100%",
                borderLeft: "1px #E2E8F0 solid",
                gridColumn: "2/3",
                padding: "1rem"
              }}
            >
              Men
            </section>
          </QuestionScreen>
        </Grid>
      </Grid.Container>
    </GeistProvider>
  );
}
const IndexPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Ok />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default IndexPage;
