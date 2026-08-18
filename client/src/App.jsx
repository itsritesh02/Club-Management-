import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing/Landing";

import Login from "./pages/Login/Login";

import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LANDING */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* OTP */}
        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;