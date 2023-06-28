import "./App.css";
import DashBoard from "./modules/Dashboard";
import Form from "./modules/Form";
import { Routes, Route, Navigate } from "react-router-dom";
const ProtectedRoutes = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("UserToken") !== null || false;
  console.log(isLoggedIn);
  if (!isLoggedIn && window.location.pathname === "/") {
    return <Navigate to="/users/sign_in" />;
  } else if (
    isLoggedIn && 
    ["/users/sign_in","/users/sign_up"].includes(window.location.pathname)
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes auth={true}>
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
  );
}

export default App;
