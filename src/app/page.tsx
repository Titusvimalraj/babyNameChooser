// app/user/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Ensure you import the NameChip component
import { Name } from "./admin/dashboard/page";
import NameSelection from "@/components/NameSelection";
import { TextField } from "@mui/material";

const UserPage = () => {
	const storedToken = localStorage.getItem("userToken");
	const [girlNames, setGirlNames] = useState<Name[]>([]);
	const [boyNames, setBoyNames] = useState<Name[]>([]);
	const [selectedNames, setSelectedNames] = useState<Name[]>([]);
	const [userName, setUserName] = useState<string>("");
	const [token, setToken] = useState<string | null>(null);
	const [submittingNames, setSubmittingNames] = useState<boolean>(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const urlToken = searchParams.get("token");
		if (urlToken) {
			setToken(urlToken);
			localStorage.setItem("userToken", urlToken);
		} else {
			const storedToken = localStorage.getItem("userToken");
			if (!storedToken) {
				router.push("/user/login");
			} else {
				setToken(storedToken);
			}
		}
	}, []);

	useEffect(() => {
		if (token) {
			fetch("/api/user/auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.valid) {
						const storedUserName = localStorage.getItem("userName");
						setUserName(storedUserName ? storedUserName : "");
					}
					if (!data.valid) {
						router.push("/user/login");
					}
				});
		}
	}, [token, router]);

	useEffect(() => {
		fetch("/api/names")
			.then((res) => res.json())
			.then((data) => {
				setGirlNames(data.girlNames);
				setBoyNames(data.boyNames);
			});
	}, []);

	const handleSelectName = (name: Name) => {
		if (
			selectedNames.length < 10 &&
			!selectedNames.some((n) => n._id === name._id)
		) {
			if (
				name.type == "boy" &&
				selectedNames.filter((name) => name.type == "boy").length < 5
			) {
	
				setSelectedNames([...selectedNames, name]);
			} else if (name.type == "boy") {
				alert("only 5 boy names can be selected");
			}

			if (
				name.type == "girl" &&
				selectedNames.filter((name) => name.type == "girl").length < 5
			) {
	
				setSelectedNames([...selectedNames, name]);
			} else if (name.type == "girl") {
				alert("only 5 girl names can be selected");
			}
		} else if (
			selectedNames.length >= 10 &&
			!selectedNames.some((n) => n._id === name._id)
		) {
			alert("only 10 names can be selected");
		} else {
			const filteredNames = selectedNames.filter((val) => val._id != name._id);
			setSelectedNames([...filteredNames]);
		}
	};

	const handleNameDeselect = (name: Name) => {
		setSelectedNames(selectedNames.filter((n) => n._id !== name._id));
	};

	const handleSubmit = async () => {
		if (selectedNames.length < 10) {
			alert("10 names should be selected");
		}
		setSubmittingNames(true);
		const res = await fetch("/api/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userName: userName,
				token: token,
				selectedNames: [...selectedNames.map((name) => name._id)],
			}),
		});
		if (res.status === 200) {
			alert("Submission done successfully");
			setSubmittingNames(false);
      setTimeout(()=>{
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
        router.push(`/thank-you?username=${userName}`);
      },1000)
		} else {
			setSubmittingNames(false);
			alert("Failed to Submit names");
		}
	};

	return (
		<>
			{token && (
				<div className="p-2">
					{userName && (
						<TextField
							sx={{
								backgroundColor: "white",
							}}
							label="Your Name"
							variant="outlined"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							fullWidth
							margin="normal"
						/>
					)}
					<NameSelection
						selectedNames={selectedNames}
						handleNameDeselect={handleNameDeselect}
						handleSubmit={handleSubmit}
						girlNames={girlNames}
						boyNames={boyNames}
						handleSelectName={handleSelectName}
						submittingNames={submittingNames}
					/>
				</div>
			)}
		</>
	);
};

export default UserPage;
