import React, { memo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = memo(({ user }) => {
	const navigate = useNavigate();
	const [file, setFile] = useState();
	const [allImages, setAllImages] = useState();

	const handleUpload = async e => {
		e.preventDefault();

		if (!file) {
			return;
		}
		const formData = new FormData();
		formData.append("file", file);
		formData.append("userId", user._id);

		const res = await axios.post("/api/items", formData, {
			headers: {
				Accept: "multipart/form-data",
				"Content-Type": "multipart/form-data",
				"x-auth-token": localStorage.getItem("token"),
			},
		});

		const { data } = res;
		if (data) {
			alert("Image uploaded");
			getAllImages();
		}
	};

	const getAllImages = useCallback(async () => {
		if (!user._id) {
			return [];
		}

		const res = await axios.get(`/api/items/${user._id}`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"x-auth-token": localStorage.getItem("token"),
			},
		});

		setAllImages(res.data);
	}, [user._id]);

	useEffect(() => {
		getAllImages();
	}, [getAllImages]);

	if (user._id === "") {
		return navigate("/login");
	}

	return (
		<div className="container">
			<form onSubmit={handleUpload}>
				<div className="my-3">
					<label for="image" className="form-label">
						Upload an Image
					</label>
					<input className="form-control" type="file" id="image" onChange={e => setFile(e.target.files[0])} />
				</div>
				<button type="submit" className="btn btn-primary">
					Upload
				</button>
			</form>
			<div>
				{allImages && allImages instanceof Array && (
					<>
						<h2 className="mt-5">Your Uploaded Images</h2>
						{allImages.map(image => {
							return <img src={`/images/${image.img}`} width={200} height={200} class="rounded img-thumbnail m-2" alt="..." />;
						})}
					</>
				)}
			</div>
		</div>
	);
});

export default Home;
