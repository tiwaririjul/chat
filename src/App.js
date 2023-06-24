import "./App.css";
import DashBoard from "./modules/Dashboard";
import Form from "./modules/Form";
import { Routes, Route, Navigate } from "react-router-dom";
const ProtectedRoutes = ({ children }) => {
  const isLoggedIn = localStorage.getItem("user : token") !== null || true;
  if (!isLoggedIn && window.location.pathname === "/") {
    return <Navigate to={`/users/sign_in`} />;
  } else if (
    isLoggedIn &&
    ["/users/sign_in", "/users/sign_up"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }

  // if (!isLoggedIn) {
  //   return <Navigate to={"/users/sign_in"} />;
  // }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <DashBoard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/users/sign_in"
        element={
          <ProtectedRoutes>
            <Form isSignInPage={true} />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/users/sign_up"
        element={
          <ProtectedRoutes>
            <Form isSignInPage={false} />
          </ProtectedRoutes>
        }
      />
    </Routes>

    // <div className="bg-[#e1edff] h-screen flex justify-center items-center">
    //   {/* <Form /> */}
    //   <DashBoard />
    // </div>
  );
}

export default App;
