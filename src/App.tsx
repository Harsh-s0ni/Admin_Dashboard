import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../src/components/Login";
import Dashboard from "./components/Dashboard";
import Loading from "./components/Loading";
import { CookiesProvider, useCookies } from "react-cookie";
import ViewList from "./components/ViewList";
import Register from "./components/Register";
import { useEffect, useState } from "react";
import PageNotFound from "./components/PageNotFound";

function App() {
  const admin = { email: "h@gmail.com", password: "123456789" };
  const [cookies, setCookies, clearCookies] = useCookies([
    "userArr",
    "newUsers",
    "loggedInUser",
    "premiumRequests",
  ]);
  const [loggedIn, setLoggedIn] = useState(cookies.loggedInUser ? true : false);
  useEffect(() => {
    setLoggedIn(cookies.loggedInUser ? true : false);
  }, [cookies.loggedInUser]);
  function removeUser(userArr: any) {
    setCookies("userArr", JSON.stringify(userArr), { path: "/" });
  }
  function updateUser(userArr: any) {
    setCookies("userArr", JSON.stringify(userArr), { path: "/" });
  }
  function handleFormSubmit(userArr: any) {
    setCookies("userArr", JSON.stringify(userArr), { path: "/" });
  }
  function handleSignUp(newUser: any) {
    setCookies("userArr", JSON.stringify(newUser), { path: "/" });
  }
  function handleLogin(loggedInUser: any) {
    setCookies("loggedInUser", JSON.stringify(loggedInUser), { path: "/" });
  }
  function handleBuyPremium(premiumRequests: any) {
    setCookies("premiumRequests", JSON.stringify(premiumRequests), {
      path: "/",
    });
  }
  function updateNewUser(updatedNewUsers: any) {
    setCookies("newUsers", JSON.stringify(updatedNewUsers), { path: "/" });
  }
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                formSubmit={handleFormSubmit}
                adminCredentials={admin}
                loggedInUser={cookies.loggedInUser}
                logInStatus={loggedIn}
                prevCookies={cookies.userArr}
                clear={clearCookies}
                buyPremium={handleBuyPremium}
                premiumRequests={cookies.premiumRequests}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                user={cookies.userArr}
                adminCredentials={admin}
                setLogin={handleLogin}
              />
            }
          />
          <Route
            path="/"
            element={
              <Login
                user={cookies.userArr}
                adminCredentials={admin}
                setLogin={handleLogin}
              />
            }
          />
          <Route path="/loading" element={<Loading />} />
          <Route
            path="/register"
            element={
              <Register
                onSignUp={handleSignUp}
                registeredUserArr={cookies.userArr}
              />
            }
          />
          <Route
            path="/viewList"
            element={
              <ViewList
                remove={removeUser}
                adminCredentials={admin}
                loggedInUser={cookies.loggedInUser}
                user={cookies.userArr}
                clear={clearCookies}
                update={updateUser}
                premiumRequests={cookies.premiumRequests}
                registerdUsers={cookies.userArr}
                updateRegisterdUser={updateNewUser}
                updatePremiumRequests={handleBuyPremium}
              />
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
