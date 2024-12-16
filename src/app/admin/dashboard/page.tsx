// app/admin/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { useRouter } from "next/navigation";
import NamesSelector from "@/components/shared/NamesSelector";
import {
	Box,
	Button,
	createTheme,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	ThemeProvider,
	Typography,
} from "@mui/material";
import NameChip from "../../../components/shared/NameChip";
import SendIcon from "@mui/icons-material/Send";
import Grid from "@mui/material/Grid2";
import NameSelection from "@/components/NameSelection";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		text: {
			primary: "rgba(255, 255, 255, 0.87)",
			secondary: "rgba(255, 255, 255, 0.6)",
			disabled: "rgba(255, 255, 255, 0.38)",
		},
		background: { default: "#121212", paper: "#1f1f1f" },
	},
});

const style = {
	py: 0,
	width: "100%",
	borderRadius: 2,
	border: "1px solid",
	borderColor: "divider",
	backgroundColor: "background.paper",
	padding: "5px",
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
	const [newUserTokenLink, setNewUserTokenLink] = useState<string>("");
	const [newUserToken, setNewUserToken] = useState<string>("");
	const [girlNames, setGirlNames] = useState<Name[]>([]);
	const [boyNames, setBoyNames] = useState<Name[]>([]);
	const [selectedNames, setSelectedNames] = useState<Name[]>([]);
	const [newNames, setNewNames] = useState<string>("");
	const [newNameType, setNewNameType] = useState<"boy" | "girl">("boy");
	const [submittingNames, setSubmittingNames] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [randomBoyName, setRandomBoyName] = useState<string>("");
	const [randomGirlName, setRandomGirlName] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		if (!adminToken) {
			router.push("/admin");
			return;
		}
		fetch("/api/submissions", {
			headers: {
				Authorization: `Bearer ${adminToken}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
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

	const logoutToLoginPage = (res: { status: number }) => {
		if (res.status === 401) router.push("/admin/login");
		return;
	};

	const fetchRandomNames = async () => {
		if (!adminToken) {
			alert("Admin token not found");
			return;
		}
		const res = await fetch("/api/admin/random-names", {
			headers: { Authorization: `Bearer ${adminToken}` },
		});
		logoutToLoginPage(res);
		if (res.status === 200) {
			const data = await res.json();
			setRandomBoyName(data.randomBoyName);
			setRandomGirlName(data.randomGirlName);
		} else {
			alert("Failed to fetch random names");
		}
	};

	const generateToken = async () => {
		setLoading(true);
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

		logoutToLoginPage(res);

		if (res.status === 200) {
			const data = await res.json();
			setNewUserToken(data.token);
			setNewUserTokenLink(data.link);
			setLoading(false);
		} else {
			setLoading(false);
			alert("Failed to generate token");
		}
	};

	const handleNameDeselect = (name: Name) => {
		const filteredNames = selectedNames.filter((val) => val._id != name._id);
		setSelectedNames(filteredNames);
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

	const handleSubmit = async () => {
		if (selectedNames.length < 10) {
			alert("10 names should be selected");
		}
		setSubmittingNames(true);
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
		logoutToLoginPage(res);
		if (res.status === 200) {
			alert("Submission done successfully");
			setNewNames("");
			setNewNameType("boy");
			setSubmittingNames(false);
			fetch("/api/submissions", {
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					setSubmissions(data ? data : null);
				})
				.catch((error) => {
					alert(error);
				});
		} else {
			setSubmittingNames(false);
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
		logoutToLoginPage(res);
		if (res.status === 200) {
			alert("Names added successfully");
			setNewNames("");
			setNewNameType("boy");
		} else {
			alert("Failed to add names");
		}
	};

	return (
		<ThemeProvider theme={darkTheme}>
			{adminToken && (
				<div className="p-3">
					<Typography className="pt-1 pb-0" variant="h5" gutterBottom>
						Admin Dashboard
					</Typography>
					<LoadingButton
						onClick={generateToken}
						endIcon={<SettingsSuggestIcon />}
						loading={loading}
						loadingPosition="end"
						variant="contained"
					>
						Generate User Token
					</LoadingButton>
					{newUserTokenLink && (
						<div>
							<div style={{ wordWrap: "break-word" }}>{newUserToken}</div>
							<Button
								variant="contained"
								color="success"
								endIcon={<WhatsAppIcon sx={{ color: "white" }} />}
								href={`https://wa.me/?text=${encodeURIComponent(
									`Here is your access link: ${newUserTokenLink}`
								)}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								Share on WhatsApp
							</Button>
						</div>
					)}
					<div className="pt-2">
						<Button
							color="primary"
							variant="contained"
							onClick={fetchRandomNames}
						>
							Get Random Names
						</Button>
						{randomBoyName && <div>Random Boy Name: {randomBoyName}</div>}
						{randomGirlName && <div>Random Girl Name: {randomGirlName}</div>}
					</div>
					<Typography className="p-3 pt-1 pb-0" variant="h6" gutterBottom>
						Name Counts
					</Typography>
					<ul className="pt-0 pb-2 p-3">
						{nameCounts &&
							Object.entries(nameCounts).map(([name, count]) => (
								<li key={name}>
									{name}: {count}
								</li>
							))}
					</ul>
					<div className="p-3 pt-0">
						<Typography className="p-3 pt-0 pb-0" variant="h6" gutterBottom>
							Add Names
						</Typography>
						<Box
							component="form"
							sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
							noValidate
							autoComplete="off"
						>
							<div>
								<TextField
									id="new-names-adding-text-area"
									value={newNames}
									onChange={(e) => setNewNames(e.target.value)}
									label="Enter names separated by commas"
									multiline
									maxRows={10}
								/>
							</div>
						</Box>
						<div style={{ display: "flex", justifyContent: "start" }}>
							<div className="p-2">
								<FormControl fullWidth>
									<InputLabel id="genderType">Gender</InputLabel>
									<Select
										labelId="genderType-select-label"
										id="genderType-select"
										value={newNameType}
										label="Age"
										onChange={(e) =>
											setNewNameType(e.target.value as "boy" | "girl")
										}
									>
										<MenuItem value={"boy"}>Boy</MenuItem>
										<MenuItem value={"girl"}>Girl</MenuItem>
									</Select>
								</FormControl>
							</div>

							<div className="p-2 flex justify-content-center">
								<Button
									color="primary"
									variant="contained"
									onClick={handleAddNames}
								>
									Add Names
								</Button>
							</div>
						</div>
					</div>
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
		</ThemeProvider>
	);
}
