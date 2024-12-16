// app/admin/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";

export default function Admin() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async () => {
		// router.push('/admin/dashboard');
		// return;
		const res = await fetch("/api/admin/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (res.status === 200) {
			const { token } = await res.json();
			localStorage.setItem("adminToken", token);
			router.push("/admin/dashboard");
		} else {
			alert("Invalid credentials");
		}
	};

	return (
		<div className="p-2">
			<h1>Admin Login</h1>
			<TextField
				sx={{
					backgroundColor: "white",
				}}
				label="Username"
				variant="outlined"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<TextField
				sx={{
					backgroundColor: "white",
				}}
				label="password"
				type="password"
				variant="outlined"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<Button
				variant="contained"
				onClick={handleLogin}
				fullWidth
				style={{ marginTop: "16px" }}
			>
				Login
			</Button>
		</div>
	);
}
