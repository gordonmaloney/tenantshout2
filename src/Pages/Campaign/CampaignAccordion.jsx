import React, { useState } from "react";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DOMPurify from 'dompurify';


//this is for the FAQ accordion for the campaign


const CampaignAccordion = ({ campaign }) => {
	const [expanded, setExpanded] = useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const scrollToPanel = (panel) => {
		const el = document.getElementById(`panel-${panel}`);
		if (el) {
			const top = el.getBoundingClientRect().top + window.pageYOffset - 20;
			window.scrollTo({ top, behavior: "smooth" });
		}
	};

	if (!campaign || !Array.isArray(campaign.accordion)) {
		return "";
	}

	return (
		<div>
			{campaign.accordion.map((item, i) => (
				<Accordion
					key={i}
					expanded={expanded === i}
					onChange={handleChange(i)}
					id={`panel-${i}`}
					TransitionProps={{
						onEntered: () => scrollToPanel(i),
					}}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						{item.q}
					</AccordionSummary>
					<AccordionDetails>
					<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.a) }} />
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default CampaignAccordion;
