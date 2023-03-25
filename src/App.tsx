import { ConfigProvider } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import ja_JP from "antd/locale/ja_JP"
import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import TestTab from "./components/pages/TestTab"
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
const queryClient = new QueryClient();

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ConfigProvider locale={ja_JP}>
        <QueryClientProvider client={queryClient}>
          <React.Fragment>
            <TestTab />
          </React.Fragment>
        </QueryClientProvider>
      </ConfigProvider>
    </LocalizationProvider>
  );
};

export default App;
