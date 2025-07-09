import React from "react";

import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className="header">
			<h2 style={{ paddingLeft: "1.5%" }}>
				<Link to="../" style={{ textDecoration: "none", color: "inherit" }}>
					
				Living Rent - TenantAct
				
				</Link>
			</h2>
		</div>
	);
};

export default Header;
