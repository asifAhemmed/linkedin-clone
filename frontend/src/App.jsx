import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/Home";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	if (isLoading) return null;

  return <Layout>
    <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/signup" element={<SignUpPage/>}/>
       <Route path="/login" element={<LoginPage/>}/>
    </Routes>
    <Toaster/>
  </Layout>;
};

export default App;
