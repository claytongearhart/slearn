import { CssBaseline, GeistProvider } from "@geist-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { GProvider } from "./context";


const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GeistProvider>
        <CssBaseline />
        <GProvider value={{checkIter: 30}}>

        <App />

        <ToastContainer />
        </GProvider>




      </GeistProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
