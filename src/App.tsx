import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import "./App.css"
import TestTab from "./components/pages/TestTab"
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <TestTab />
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default App;
