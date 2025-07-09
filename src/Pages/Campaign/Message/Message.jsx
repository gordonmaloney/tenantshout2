import React, { useState, useEffect, useMemo } from "react";
import {
	TextField,
	Chip,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Button,
	useMediaQuery,
	Tooltip,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { SendModal } from "../SendModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { BtnStyleSmall, BtnStyle, CheckBoxStyle } from "../../../MUIStyles";
import { TextFieldStyle } from "../../../MUIStyles";
import EditableDiv from "../../../Components/EditableDiv";

import { useDefaultTargetting } from "./useDefaultTargetting";
import { useCustomTargetting } from "./useCustomTargetting";

const Message = ({
	campaign,
	prompts,
	adminDivisions,
	postcode,
	setStage,
	emailClient,
}) => {
	const [Loading, setLoading] = useState(true);
	const [messaging, setMessaging] = useState([]);
	const [notMessaging, setNotMessaging] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");

	const [newSubject, setNewSubject] = useState(campaign.subject);

	//SET TARGET via default hook
	useDefaultTargetting(campaign, adminDivisions, {
		setLoading,
		setMessaging,
		setNotMessaging,
		setErrorMsg,
	});

	//SET TARGET via custom hook if present
	useCustomTargetting(campaign.customTargetting, {
		setLoading,
		setMessaging,
		setNotMessaging,
		setErrorMsg,
	});

	console.log(errorMsg)


	const promptsChanged = false;
	const { template } = campaign;
	const [newTemplate, setNewTemplate] = useState(
		campaign.template + `\n${postcode.trim().toUpperCase()}`
	);

	useEffect(() => {
		if (
			messaging.length > 0 &&
			newTemplate &&
			!newTemplate.startsWith("Dear")
		) {
			setNewTemplate(
				`Dear${messaging.map(
					(recipient) => ` ` + recipient.name
				)},\n\n${newTemplate}`
			);
		} else if (
			messaging.length > 0 &&
			newTemplate &&
			newTemplate.startsWith("Dear")
		) {
		}
	}, [messaging]);

	const createPromptAnswers = (prompts) => {
		return prompts.reduce((acc, prompt) => {
			acc[prompt.id] = prompt.answer;
			return acc;
		}, {});
	};
	const promptAnswers = createPromptAnswers(prompts);

	//PROMPT LOGIC
	const addPrompt = (prompt) => {
		if (promptAnswers[prompt.id] !== "") {
			setNewTemplate((old) =>
				old.replace(`<<${prompt.id}>>`, `${promptAnswers[prompt.id]}`)
			);
		} else {
			setNewTemplate((old) => old.replace(`\n<<${prompt.id}>>\n`, ""));
		}
	};

	const [extractedStringArray, setExtractedStringArray] = useState([]);

	const addCondition = (prompt) => {
		console.log("Processing condition: " + prompt.id);

		const promptId = prompt.id;

		// Case for undefined (no answer)
		if (typeof promptAnswers[promptId] == "string") {
			console.log("No answer, removing all placeholders for this prompt.");

			// Remove all "no" and "yes" placeholders
			let frameExtractionRegexNo = new RegExp(
				String.raw`<<${promptId}=no:.*?>>`,
				"gs"
			);
			let frameExtractionRegexYes = new RegExp(
				String.raw`<<${promptId}=yes:.*?>>`,
				"gs"
			);

			setNewTemplate((old) => old.replace(frameExtractionRegexNo, ""));
			setNewTemplate((old) => old.replace(frameExtractionRegexYes, ""));
			return;
		}

		// Case for "yes" condition
		if (promptAnswers[promptId]) {
			try {
				console.log("Processing positive answer (yes)...");

				// Get all matches for "yes" and replace each individually
				const yesMatches = Array.from(
					template.matchAll(new RegExp(`<<${promptId}=yes:(.*?)>>`, "gs"))
				);

				yesMatches.forEach((match) => {
					const extractedString = match[1]; // The captured text in the placeholder
					const fullMatch = match[0]; // The full placeholder (e.g., "<<promptId=yes:...>>")

					setNewTemplate((old) => old.replace(fullMatch, extractedString));
					setExtractedStringArray((old) => [...old, extractedString]);
				});

				// Remove all "no" placeholders for this prompt ID
				let frameExtractionRegexNo = new RegExp(
					String.raw`<<${promptId}=no:.*?>>`,
					"gs"
				);
				setNewTemplate((old) => old.replace(frameExtractionRegexNo, ""));
			} catch {
				// Remove all "no" placeholders if there's an error in processing
				let frameExtractionRegexNo = new RegExp(
					String.raw`<<${promptId}=no:.*?>>`,
					"gs"
				);
				setNewTemplate((old) => old.replace(frameExtractionRegexNo, ""));
			}
		}

		// Case for "no" condition
		if (!promptAnswers[promptId]) {
			console.log("Processing negative answer (no)...");

			try {
				// Get all matches for "no" and replace each individually
				const noMatches = Array.from(
					template.matchAll(new RegExp(`<<${promptId}=no:(.*?)>>`, "gs"))
				);

				noMatches.forEach((match) => {
					const extractedString = match[1]; // The captured text in the placeholder
					const fullMatch = match[0]; // The full placeholder (e.g., "<<promptId=no:...>>")

					setNewTemplate((old) => old.replace(fullMatch, extractedString));
					setExtractedStringArray((old) => [...old, extractedString]);
				});

				// Remove all "yes" placeholders for this prompt ID
				let frameExtractionRegexYes = new RegExp(
					String.raw`<<${promptId}=yes:.*?>>`,
					"gs"
				);
				setNewTemplate((old) => old.replace(frameExtractionRegexYes, ""));
			} catch {
				// Remove all "yes" placeholders if there's an error in processing
				let frameExtractionRegexYes = new RegExp(
					String.raw`<<${promptId}=yes:.*?>>`,
					"gs"
				);
				setNewTemplate((old) => old.replace(frameExtractionRegexYes, ""));
			}
		}
	};

	useEffect(() => {
		campaign.prompts
			.filter((prompt) => prompt.answerType == "text")
			.map((prompt) => {
				addPrompt(prompt);
			});
		campaign.prompts
			.filter((prompt) => prompt.answerType == "yesno")
			.map((prompt) => {
				addCondition(prompt);
			});
	}, [campaign.prompts]);

	const [sent, setSent] = useState(false);
	const [noClient, setNoClient] = useState(false);
	const [isSendOpen, setIsSendOpen] = useState(false);
	const onSendClose = () => {
		setIsSendOpen(false);
		setSent(false);
	};
	const Mobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

	const [copyIn, setCopyIn] = useState(false);

	const editableDivProps = useMemo(
		() => ({
			label: campaign.channel === "email" ? "Body" : "Your Tweet",
			body: newTemplate,
			onBodyChange: setNewTemplate,
			substrings: [
				...Object.values(promptAnswers),
				...extractedStringArray,
			].filter((str) => str !== String),
			promptsChanged,
		}),
		[
			campaign.channel,
			newTemplate,
			promptAnswers,
			extractedStringArray,
			promptsChanged,
		]
	);

	useEffect(() => {
		if (campaign.customTarget) {
			setMessaging(campaign.customTarget);
			setLoading(false);
		}
	}, [campaign]);



	console.log("messaging: " + messaging);


	if (Loading) {
		return <></>;
	}

	if (errorMsg !== "") {
		return (
			<>
				Sorry - something has gone wrong while looking up your representative's
				data. If you could let us know your postcode, we'll try to get it fixed!
			</>
		);
	}


	return (
		<div>
			{campaign.channel == "email" && (
				<>
					<Box
						sx={{
							position: "relative",
							marginTop: 2,
							marginBottom: "14px",

							width: "100%",
							"&:focus-within .paperBorder": {
								outline: "2px solid #3f51b5", // Color for focus state
								outlineOffset: "-2px",
							},
						}}
					>
						<label
							style={{
								fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

								position: "absolute",
								top: "-9px",
								left: "8px",
								fontSize: "0.78rem",
								fontWeight: "320",
								color: "rgba(0,0,0,0.6)",
								backgroundColor: "rgba(246, 243, 246, 1)",
								padding: "0 5px",
								transition: "top 0.2s, font-size 0.2s, color 0.2s",
							}}
						>
							To
						</label>

						<Paper
							sx={{
								...TextFieldStyle,
								margin: "1px 0 7px 0",
								padding: "5px",
								paddingY: "15px",
								border: "1px solid lightgray",
							}}
						>
							{messaging.map((msp) => (
								<Chip
									label={`${msp.name} ${
										campaign.customTarget ? "" : ` - ${msp.party}`
									}`}
									variant="outlined"
									sx={{ margin: "2px" }}
									onClick={
										campaign.target !== "custom"
											? () => {
													setMessaging((prev) =>
														prev.filter(
															(prevTarget) => prevTarget.name !== msp.name
														)
													);
													setNotMessaging((prev) => [...prev, msp]);
											  }
											: undefined
									}
									onDelete={
										campaign.target !== "custom"
											? () => {
													setMessaging((prev) =>
														prev.filter(
															(prevTarget) => prevTarget.name !== msp.name
														)
													);
													setNotMessaging((prev) => [...prev, msp]);
											  }
											: undefined
									}
								></Chip>
							))}

							{messaging.length == 0 && (
								<div style={{ color: "red", marginLeft: "10px" }}>
									You need to pick at least one recipient!
								</div>
							)}
						</Paper>

						{notMessaging.length > 0 && (
							<>
								<div
									style={{
										marginBottom: "5px",
									}}
								>
									<Accordion
										className="notMessaging"
										sx={{
											backgroundColor: "rgba(246, 243, 246, 1)",
											borderRadius: "5px !important",
										}}
									>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls="panel1a-content"
											id="details"
											sx={{
												backgroundColor: "rgba(246, 243, 246, 1)",
												borderRadius: "5px 5px 0 0",
												border: "1px solid lightgray",
												borderBottom: "0",
											}}
										>
											<div
												style={{
													color: "black",
												}}
											>
												You aren't messaging:
											</div>
										</AccordionSummary>
										<AccordionDetails
											sx={{
												paddingY: "10px",
												paddingX: "10px",
												marginTop: "-10px",
												backgroundColor: "rgba(246, 243, 246, 1)",
												borderRadius: "0 0 5px 5px",
												border: "1px solid lightgray",
											}}
										>
											<div style={{ marginLeft: "5px" }}>
												These are the recipients not included in your message.
												If you'd like to include them, just tap their name.
											</div>
											<br />
											{notMessaging.map((msp) => (
												<Chip
													size="small"
													label={`${msp.name} ${
														campaign.customTarget ? "" : ` - ${msp.party}`
													}`}
													variant="outlined"
													sx={{ backgroundColor: "white", margin: "2px" }}
													deleteIcon={
														<AddCircleIcon style={{ fontSize: "large" }} />
													}
													onDelete={() => {
														setNotMessaging((prev) =>
															prev.filter(
																(prevTarget) => prevTarget.name !== msp.name
															)
														);
														setMessaging((prev) => [...prev, msp]);
													}}
													onClick={() => {
														setNotMessaging((prev) =>
															prev.filter(
																(prevTarget) => prevTarget.name !== msp.name
															)
														);
														setMessaging((prev) => [...prev, msp]);
													}}
												></Chip>
											))}
										</AccordionDetails>
									</Accordion>
								</div>
							</>
						)}
					</Box>
					<TextField
						label="Subject Line"
						id="subject"
						fullWidth
						value={newSubject}
						sx={TextFieldStyle}
						onChange={(e) => setNewSubject(e.target.value)}
					/>
				</>
			)}

			<div style={{ position: "relative" }}>
				<div style={{}}>
					<EditableDiv {...editableDivProps} />
				</div>
			</div>
			{Object.values(promptAnswers).filter((str) => str !== "noOptionSelected")
				.length > 0 && (
				<div
					style={{
						marginTop: "-10px",
						marginBottom: "10px",
						marginLeft: "auto",
						marginRight: "auto",
						width: "90%",
						fontSize: "small",
						textAlign: "center",
					}}
				>
					<em>
						Your answers have been incorporated into the template message,
						highlighted for you in yellow - check to make sure they still look
						okay!{" "}
					</em>
				</div>
			)}
			<TextField
				id="template"
				fullWidth
				label={campaign.channel == "email" ? "Body" : "Your Tweet"}
				value={newTemplate || ""}
				multiline
				sx={{ ...TextFieldStyle, opacity: 1, display: "none" }}
				rows={10}
				onChange={(e) => setNewTemplate(e.target.value)}
				inputProps={
					campaign.channel == "twitter" && {
						maxLength: campaign.channel == "twitter" && 280,
					}
				}
			/>

			<FormControlLabel
				sx={{ marginTop: "-10px", display: campaign.bcc ? "" : "none" }}
				control={
					<Checkbox
						style={CheckBoxStyle}
						onChange={(e) => setCopyIn(e.target.checked)}
					/>
				}
				label={
					<p
						style={{
							fontSize: "0.9rem",
							lineHeight: "0.9rem",
							fontWeight: 500,
						}}
					>
						Tick here to copy in <b>{campaign.host}</b> to your email if you are
						happy to share your contact details and message with them.
					</p>
				}
			/>

			<div
				style={{
					display: "flex",
					width: "100%",
					justifyContent: "space-between",
				}}
			>
				<Button sx={BtnStyleSmall} onClick={() => setStage((old) => old - 1)}>
					Back
				</Button>

				<Button sx={BtnStyleSmall} onClick={() => setIsSendOpen(true)}>
					Send
				</Button>
			</div>

			<SendModal
				isOpen={isSendOpen}
				onClose={() => {
					onSendClose();
					setNoClient(false);
				}}
				noClient={noClient}
				setNoClient={setNoClient}
				messaging={messaging}
				bcc={campaign.bcc}
				campaign={campaign}
				newSubject={newSubject}
				newTemplate={newTemplate}
				Mobile={Mobile}
				sent={sent}
				setSent={setSent}
				copyIn={copyIn}
				emailClient={emailClient}
			/>
		</div>
	);
};

export default Message;
