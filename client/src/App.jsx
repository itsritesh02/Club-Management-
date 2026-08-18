import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";
import Dashboard from "./pages/Dashboard/Dashboard";
import Members from "./pages/Members/Members";
import AddMember from "./pages/AddMember/AddMember";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/members"
          element={<Members />}
        />

        <Route
          path="/members/add"
          element={<AddMember />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;