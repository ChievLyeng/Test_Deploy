import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import SignUp from "../pages/Signup";
import LogIn from "../pages/Login";
import Homepage from "../pages/Homepage";
import TopAppBar from "../components/TopAppBar";
import ForgotPassword from "../pages/Forgotpassword";
import EmailVerify from "../pages/EmailVerify";
import CheckEmail from "../pages/CheckEmail";
import ResetPassword from "../pages/ResetPassword";

function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={!user ? <LogIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignUp /> } />
        <Route path="/checkemail" element={<CheckEmail /> } />
        <Route path="/users/:id/verify/:token" element={<EmailVerify /> } />
        <Route path="/forgotpassword" element={!user ? <ForgotPassword />: <Navigate to="/signup" />} />
        {/* <Route path="/resetpassword/:token" element={!user ? <ResetPassword />: <Navigate to="/signup" />} /> */}
        <Route path="/resetpassword/:token" element={ <ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
