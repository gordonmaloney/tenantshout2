import React from "react";

import { Link } from "react-router-dom";
import { BtnStyleSmall } from "../MUIStyles";
import {Button} from "@mui/material";

const Header = () => {
	return (
		<div className="header"
		style={{display: 'flex', justifyContent: 'space-between'}}
		>
			<h1 style={{ paddingLeft: "1.5%" }}>
				<Link to="../" style={{ textDecoration: "none", color: "inherit" }}>
					
				Living Rent - TenantAct
				
				</Link>
			</h1>

			<Link to="../admin" style={{ paddingRight: "1%", textDecoration: "none", color: "inherit" }}>
			<Button sx={{...BtnStyleSmall, padding: "3px 0 0 0"}}>
			ADMIN</Button>
		</Link>
		</div>
	);
};

export default Header;
