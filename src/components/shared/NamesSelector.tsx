"use client";
import { Name } from "@/app/admin/dashboard/page";
import React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
	components: {
		// Name of the component
		MuiListItemButton: {
			styleOverrides: {
				root: {
					"&.Mui-selected": {
						backgroundColor: "#3e51eb",
						color: "white"
					},
				},
			},
		},
	},
});

const style = {
	py: 0,
	color: 'black',
	width: "100%",
	maxWidth: 360,
	borderRadius: 2,
	border: "1px solid",
	borderColor: "divider",
	backgroundColor: "background.paper",
};

const NamesSelector = ({
	titleHeading,
	Names,
	selectedNames,
	handleSelectName,
  NameType,
}: {
	titleHeading: string;
	Names: Name[];
	selectedNames: Name[];
	handleSelectName: (name: Name) => void;
  NameType: 'boy' | 'girl';
}) => {
	return (
		<ThemeProvider theme={theme}>
			<div>
				<h2>{titleHeading}</h2>
				<List sx={style}>
					{Names.map((name) => (
						<ListItemButton
							divider
							selected={!!selectedNames.find((val) => val._id == name._id)}
							key={name._id}
							onClick={() =>
								handleSelectName({
									_id: name._id,
									name: name.name,
									type: NameType,
								})
							}
						>
							<ListItemText primary={name.name} />
						</ListItemButton>
					))}
				</List>
			</div>
		</ThemeProvider>
	);
};
export default NamesSelector;
