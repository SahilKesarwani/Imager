import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = memo(({ isAuthenticated, authenticate }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState({
		name: "",
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

	const register = async e => {
		e.preventDefault();

		try {
			const res = await axios.post("/api/users", user, {
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
			setUser({ name: "", email: "", password: "" });
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div id="register">
			<form method="POST" className="details-form">
				<div className="container">
					<div className="field">
						<label htmlFor="name" className="label">
							Name *
						</label>
						<input type="text" id="name" className="input-details" autoComplete="off" value={user.name} onChange={onInputChange} name="name" placeholder="Name" />
					</div>
					<div className="field">
						<label htmlFor="email" className="label">
							Email *
						</label>
						<input type="email" id="email" className="input-details" autoComplete="off" value={user.email} onChange={onInputChange} name="email" placeholder="abc@mail.com" />
					</div>
					<div className="field">
						<label htmlFor="password" className="label">
							Password *
						</label>
						<input type="password" id="password" className="input-details" autoComplete="off" value={user.password} onChange={onInputChange} name="password" />
					</div>
					<button type="button" className="submit-btn" name="register" onClick={register}>
						Register
					</button>
				</div>
			</form>
		</div>
	);
});

export default Register;
