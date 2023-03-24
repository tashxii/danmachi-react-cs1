import { ConfigProvider } from "antd";
import ja_JP from "antd/locale/ja_JP"
import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import TestTab from "./components/pages/TestTab"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
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
