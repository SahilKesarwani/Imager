import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

const App = () => {
	const [user, setUser] = useState({
		_id: "",
		name: "",
		email: "",
	});

	const authenticate = useCallback(async () => {
		if (localStorage.getItem("token") === null) {
			setUser({
				_id: "",
				name: "",
				email: "",
			});
			return;
		}
		try {
			const res = await axios.get("/api/auth/user", {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"x-auth-token": localStorage.getItem("token"),
				},
			});

			if (res.status === 200) {
				const { data } = res;
				const { _id, name, email } = data;
				setUser(prevState => ({ ...prevState, _id, name, email }));
			}
		} catch (e) {
			console.log(e);
		}
	}, []);

	const logout = useCallback(() => {
		setUser({
			_id: "",
			name: "",
			email: "",
		});
		localStorage.removeItem("token");
	}, []);

	useEffect(() => {
		authenticate();
	}, [authenticate]);

	return (
		<>
			<Navbar isAuthenticated={user._id !== ""} logout={logout} />

			<Routes>
				<Route exact path="/" element={<Home user={user} />} />
				<Route path="/login" element={<Login isAuthenticated={user._id !== ""} authenticate={authenticate} />} />
				<Route path="/register" element={<Register isAuthenticated={user._id !== ""} authenticate={authenticate} />} />
			</Routes>
		</>
	);
};

export default App;
