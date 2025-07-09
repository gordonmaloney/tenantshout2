import React, { useState, useEffect } from "react";
import { useMediaQuery, Button, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CampaignBlurbs = ({ campaign, stage }) => {
	// Use 600px as the breakpoint for "sm" without needing the theme provider
	const isSmallScreen = useMediaQuery("(max-width:600px)");

	const [expanded, setExpanded] = useState(isSmallScreen);

	const handleToggle = () => {
		setExpanded((prevExpanded) => !prevExpanded);
	};

	useEffect(() => {
		stage == 1 && setExpanded(false);
	}, [stage]);

	return (
		<>
			{isSmallScreen ? (
				<>
					<div
						style={{
							whiteSpace: "pre-line",
							marginBottom: "0",
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: expanded || !isSmallScreen ? "none" : 1,
							WebkitBoxOrient: "vertical",
						}}
					>
						{campaign.blurb}

						<br />
						<br />

						<a href={campaign.link} target="_blank" rel="noopener noreferrer">
							<LinkIcon fontSize="small" /> {campaign.host}
						</a>
					</div>

					<center>
						<Typography
							onClick={handleToggle}
							style={{ marginBottom: "-15px", cursor: "pointer" }}
						>
							{expanded ? (
								<ExpandLessIcon fontSize="small" />
							) : (
								<ExpandMoreIcon fontSize="small" />
							)}
						</Typography>
					</center>
				</>
			) : (
				<div
					style={{
						whiteSpace: "pre-line",
						marginBottom: "0",
						overflow: "hidden",
						display: "-webkit-box",
						WebkitLineClamp: expanded || !isSmallScreen ? "none" : 3,
						WebkitBoxOrient: "vertical",
					}}
				>
					{campaign.blurb}

					<br />
					<br />

					<a href={campaign.link} target="_blank" rel="noopener noreferrer">
						<LinkIcon fontSize="small" /> {campaign.host}
					</a>
				</div>
			)}
		</>
	);
};

export default CampaignBlurbs;
