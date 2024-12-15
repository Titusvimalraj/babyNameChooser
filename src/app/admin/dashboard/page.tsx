// app/admin/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NamesSelector from "@/components/shared/NamesSelector";
import ListItemText from "@mui/material/ListItemText";
import { List, ListItem } from "@mui/material";

const style = {
	py: 0,
	width: "100%",
	maxWidth: 360,
	borderRadius: 2,
	border: "1px solid",
	borderColor: "divider",
	backgroundColor: "background.paper",
};
export interface Name {
	_id?: string;
	name: string;
	type: "boy" | "girl";
}

export interface Submission {
	userName: string;
	selectedNames: Name[];
}

export default function AdminDashboard() {
	const adminToken = localStorage.getItem("adminToken");
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [newUserToken, setNewUserToken] = useState<string>("");
	const [girlNames, setGirlNames] = useState<Name[]>([]);
	const [boyNames, setBoyNames] = useState<Name[]>([]);
	const [selectedNames, setSelectedNames] = useState<Name[]>([]);
	const [newNames, setNewNames] = useState<string>("");
	const [newNameType, setNewNameType] = useState<"boy" | "girl">("boy");
	const router = useRouter();

	useEffect(() => {
		fetch("/api/submissions", {
			headers: {
				Authorization: `Bearer ${adminToken}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("🚀 ~ useEffect ~ data:", data);
				setSubmissions(data ? data : null);
			});

		fetch("/api/names", {
			headers: {
				Authorization: `Bearer ${adminToken}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setGirlNames(data.girlNames);
				setBoyNames(data.boyNames);
			});
	}, []);

	const nameCounts = submissions.length
		? submissions.reduce((acc, submission) => {
				submission.selectedNames.forEach((name) => {
					acc[name.name] = (acc[name.name] || 0) + 1;
				});
				return acc;
		  }, {} as { [name: string]: number })
		: null;

	const generateToken = async () => {
		if (!adminToken) {
			router.push("/admin");
			return;
		}
		const res = await fetch("/api/admin/generate-token", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${adminToken}`,
			},
		});
		if (res.status === 200) {
			const data = await res.json();
			setNewUserToken(data.token);
		} else {
			alert("Failed to generate token");
		}
	};

	const handleSelectName = (name: Name) => {
		if (
			selectedNames.length < 10 &&
			!selectedNames.some((n) => n._id === name._id)
		) {
			if (
				name.type == "boy" &&
				selectedNames.filter((name) => name.type == "boy").length < 5
			) {
				console.log("boy");
				setSelectedNames([...selectedNames, name]);
			} else if (name.type == "boy") {
				alert("only 5 boy names can be selected");
			}

			if (
				name.type == "girl" &&
				selectedNames.filter((name) => name.type == "girl").length < 5
			) {
				console.log("girl");
				setSelectedNames([...selectedNames, name]);
			} else if (name.type == "girl") {
				alert("only 5 girl names can be selected");
			}
		}
	};

	const handleSubmit = async () => {
		const res = await fetch("/api/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminToken}`,
			},
			body: JSON.stringify({
				userName: "Admin",
				token: adminToken,
				selectedNames: [...selectedNames.map((name) => name._id)],
			}),
		});
		if (res.status === 200) {
			alert("Submission done successfully");
			setNewNames("");
			setNewNameType("boy");
			fetch("/api/submissions", {
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("🚀 ~ useEffect ~ data:", data);
					setSubmissions(data ? data : null);
				});
		} else {
			alert("Failed to Submit names");
		}
	};

	const handleAddNames = async () => {
		if (!adminToken) {
			router.push("/admin");
			return;
		}
		const namesArray = newNames.split(",").map((name) => name.trim());
		const res = await fetch("/api/admin/add-names", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminToken}`,
			},
			body: JSON.stringify({ names: namesArray, type: newNameType }),
		});
		if (res.status === 200) {
			alert("Names added successfully");
			setNewNames("");
			setNewNameType("boy");
		} else {
			alert("Failed to add names");
		}
	};

	return (
		<div>
			<h1>Admin Dashboard</h1>
			<button onClick={generateToken}>Generate User Token</button>
			{newUserToken && (
				<div>
					<h2>New User Token</h2>
					<p>{newUserToken}</p>
				</div>
			)}
			<h2>Name Counts</h2>
			<ul>
				{nameCounts &&
					Object.entries(nameCounts).map(([name, count]) => (
						<li key={name}>
							{name}: {count}
						</li>
					))}
			</ul>
			<div>
				<h2>Add Names</h2>
				<textarea
					value={newNames}
					onChange={(e) => setNewNames(e.target.value)}
					placeholder="Enter names separated by commas"
				/>
				<select
					title="addBabyNamesToList"
					value={newNameType}
					onChange={(e) => setNewNameType(e.target.value as "boy" | "girl")}
				>
					<option value="boy">Boy</option>
					<option value="girl">Girl</option>
				</select>
				<button onClick={handleAddNames}>Add Names</button>
			</div>
			<NamesSelector
				NameType={"girl"}
				titleHeading={"Girl Names"}
				Names={girlNames}
				selectedNames={selectedNames}
				handleSelectName={handleSelectName}
			/>
			<NamesSelector
				NameType={"boy"}
				titleHeading={"Boy Names"}
				Names={boyNames}
				selectedNames={selectedNames}
				handleSelectName={handleSelectName}
			/>
			<div>
				<h2>Selected Names</h2>
				<List sx={style}>
					{selectedNames.map((name) => (
						<ListItem divider key={name._id}>
							<ListItemText primary={name.name} />
						</ListItem>
					))}
				</List>
			</div>
			<button disabled={selectedNames.length < 10} onClick={handleSubmit}>
				Submit
			</button>
		</div>
	);
}
