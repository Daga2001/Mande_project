import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/landingPage/LandingPage";
import Login from "./pages/login/Login";
import Registration from "./pages/registration/Registration";
import ResgistrationPage2 from "./pages/registrationPage2/ResgistrationPage2";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import ServicesProvided from "./pages/servicesProvided/ServicesProvided";
import Orders from "./pages/orders/Orders";
import Sidebar from "./components/sidebar/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./style/theme";
import { ProSidebarProvider } from "./components/react-pro-sidebar";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <div className="App">
      <ProSidebarProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="registration">
                  <Route path="page1" element={<Registration />} />
                  <Route path="page2" element={<ResgistrationPage2 />} />
                </Route>
                <Route path="client">
                  <Route path="home" element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="services" element={<ServicesProvided />} />
                  <Route path="orders" element={<Orders />} />
                </Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </ProSidebarProvider>
    </div>
  );
}

export default App;
