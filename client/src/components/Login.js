import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = memo(({ isAuthenticated, authenticate }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	if (isAuthenticated) {
		return navigate("/");
	}

	const onInputChange = e => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const login = async e => {
		e.preventDefault();

		try {
			const res = await axios.post("http://localhost:8000/api/auth", user, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			const { data } = res;
			if (res.status === 200) {
				localStorage.setItem("token", data.token);
				authenticate();
				navigate("/");
			}
			setUser({ email: "", password: "" });
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div id="login">
			<form method="POST" className="details-form">
				<div className="container">
					<div className="field">
						<label htmlFor="email" className="label">
							Email *
						</label>
						<input type="email" id="email" className="input-details" autoComplete="off" value={user.email} onChange={onInputChange} name="email" placeholder="abc@mail.com" required />
					</div>
					<div className="field">
						<label htmlFor="password" className="label">
							Password *
						</label>
						<input type="password" id="password" className="input-details" autoComplete="off" value={user.password} onChange={onInputChange} name="password" required />
					</div>
					<button type="button" className="submit-btn" name="login" onClick={login}>
						Login
					</button>
				</div>
			</form>
		</div>
	);
});

export default Login;
