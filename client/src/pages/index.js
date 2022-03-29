import
  {
    Card,
    CssBaseline,
    GeistProvider,
    Grid,
    Link,
    Loading,
    Text
  } from "@geist-ui/core";
import * as React from "react";
import
  {
    QueryClient,
    QueryClientProvider, useQuery
  } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

async function fetchMath() {
  const res = await fetch("http://localhost:3000/data/math.json");
  return res.json();
}

async function fetchChem()
{
  const res = await fetch("http://localhost:3000/data/chem.json");
  return res.json();
}

function QuestionScreen(props) {
  return (
    <div style={{ padding: "1rem", width: "100%" }}>
      <Card width={"100%"}>
        <Text h3>Q Screen</Text>
      </Card>
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

function Topic(props) {
  return <Text p>{props.data.topic}</Text>;
}

function SubSelector(props) {
  return (
    <div style={{ padding: "1rem", width: "100%" }}>
      <Card>
        {props.data.map((object, i) => (
          <Topic data={object} />
        ))}
      </Card>
    </div>
    // <p>ss</p>
  );
}

function Ok() {
  const [subject, setSubject] = React.useState("None");
  const math = useQuery(
    "math",
    fetchMath,
    { enabled: subject === "math" }
  );
  const chem = useQuery(
    "chem",
    fetchChem,
    {enabled: subject === 'chem'}
  )
  
  let data = subject === "math" ? math.data : chem.data
  const loading = math.loading && chem.loading

  return (
    <GeistProvider>
      <CssBaseline />

      <Grid.Container style={{ width: "100vw", height: "100vh" }}>
        <Grid xs={24} height={"4rem"}>
          <MainHeader setSubject={setSubject} />
        </Grid>
        <Grid xs={24} md={6} height={"calc(15vh - 2cm)"}>
          {math.status !== 'success' ?  <Loading /> : <SubSelector data={data} />}
        </Grid>
        <Grid xs={24} md={18} height={"85vh"}>
          <QuestionScreen />
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
}

export default IndexPage;
