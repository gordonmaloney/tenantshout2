import React from "react";

import { Link } from "react-router-dom";
import { BtnStyleSmall } from "../MUIStyles";
import { Box, Button } from "@mui/material";


const Header = () => {
	return (
		<div className="header"
		style={{display: 'flex', justifyContent: 'space-between'}}
		>

			<Box
				component="h1"
				sx={{
					pl: { xs: 1.5, sm: 2.5 },
					fontSize: { xs: "1.7rem", sm: "2.15rem" },
					lineHeight: 1,
					m: 0,
				}}
			>
				<Link to="../" style={{ textDecoration: "none", color: "inherit" }}>
					
				Living Rent - TenantShout
				
				</Link>
			</Box>

			<Link to="../admin" style={{ paddingRight: "1%", textDecoration: "none", color: "inherit" }}>
			<Button sx={{...BtnStyleSmall, padding: "3px 0 0 0"}}>
			ADMIN</Button>
		</Link>
		</div>
	);
};

export default Header;
