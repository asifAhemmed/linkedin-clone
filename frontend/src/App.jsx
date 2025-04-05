import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/Home";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";

const App = () => {
  return <Layout>
    <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/signup" element={<SignUpPage/>}/>
       <Route path="/login" element={<LoginPage/>}/>
    </Routes>
  </Layout>;
};

export default App;
