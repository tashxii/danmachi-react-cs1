import { ConfigProvider } from "antd";
import ja_JP from "antd/locale/ja_JP"
import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import "./App.css"
import TestTab from "./components/pages/TestTab"
const queryClient = new QueryClient();

const App = () => {
  return (
    <ConfigProvider locale={ja_JP}>
      <React.Fragment>
        <QueryClientProvider client={queryClient}>
          <TestTab />
        </QueryClientProvider>
      </React.Fragment>
    </ConfigProvider>
  );
};

export default App;
