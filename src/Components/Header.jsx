import React from "react";

import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className="header"
		style={{display: 'flex', justifyContent: 'space-between'}}
		>
			<h2 style={{ paddingLeft: "1.5%" }}>
				<Link to="../" style={{ textDecoration: "none", color: "inherit" }}>
					
				Living Rent - TenantAct
				
				</Link>
			</h2>

			<Link to="../admin" style={{ paddingRight: "1.5%", textDecoration: "none", color: "inherit" }}>
			ADMIN</Link>
		</div>
	);
};

export default Header;
