import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import UploadPostPage from "./pages/UploadPostPage";
import PostDetailPage from "./pages/PostDetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="top-nav">
          <p className="brand">BlogNest</p>
          <nav>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/admin-profile">Admin Profile</NavLink>
            <NavLink to="/upload-post">Upload Post</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-profile" element={<AdminProfilePage />} />
          <Route path="/upload-post" element={<UploadPostPage />} />
          <Route path="/post/:slug" element={<PostDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
