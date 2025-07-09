import React, {useState} from "react";
import { Modal, Button, Box, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BtnStyle, BtnStyleSmall, BtnStyleTiny } from "../../MUIStyles";
import Grid from "@mui/material/Grid2";
import { webmailProviders } from "./webmailProviders";

const ModalStyle = {
	position: "absolute",
	fontFamily: "var(--font)",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "500px",
	height: "auto",
	maxWidth: "90vw",
	margin: "0 auto",
	padding: "15px",
	backgroundColor: "#F6F3F6",
	borderRadius: "15px",
	backdropFilter: "blur(5px)",
};

export const SendModal = ({
	isOpen,
	onClose,
	title,
	body,
	campaign,
	messaging,
	newTemplate,
	newSubject,
	Mobile,
	noClient,
	setNoClient,
	setSent,
	sent,
	copyIn,
	emailClient,
}) => {
	const generateLink = (forceMailto) => {
		// 1) Build the to-list
		const toList = messaging.map((t) => t.email).join(",");

		// 2) Only include bcc if copyIn is true
		const effectiveBcc = copyIn ? campaign.bcc : "";

		// 3) Pick a provider (or undefined)
		const providerConfig = webmailProviders.find((p) => p.name === emailClient);

		let sendLink;

		if (!forceMailto && providerConfig) {
			// 4a) Web-mail URL builder handles encoding + optional bcc
			sendLink = providerConfig.composeUrl(
				toList,
				newSubject,
				newTemplate,
				effectiveBcc
			);
		} else {
			// 4b) mailto: fallback
			const params = new URLSearchParams();
			if (newSubject) params.set("subject", newSubject);
			if (newTemplate) params.set("body", newTemplate);
			if (effectiveBcc) params.set("bcc", effectiveBcc);

			sendLink = `mailto:${toList}?${params.toString()}`;
		}

		// 5) return link
		return sendLink;
	};

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			// Copy the current page URL to the clipboard
			await navigator.clipboard.writeText(window.location.href);
			// Show the tooltip with "Copied" message
			setCopied(true);
			// Hide the tooltip after 3 seconds
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box style={ModalStyle}>
				<span style={{ float: "right", cursor: "pointer" }} onClick={onClose}>
					<CloseIcon />
				</span>

				<h1 style={{ margin: "0 0 12px 0" }}>
					{sent ? "What now?" : "Send your message"}
				</h1>

				{noClient ? (
					<>
						<p>
							If you don't use an email app, or the buttons on the last page
							didn't work, you can use these buttons to copy and paste the
							recipients, subject, and body of your email to whatever client you
							use:
						</p>
						<Grid
							container
							spacing={1}
							justifyContent={"center"}
							alignContent={"center"}
						>
							<Grid item sm={4} xs={12}>
								<center>
									<Button
										sx={BtnStyleSmall}
										onClick={() =>
											navigator.clipboard.writeText(
												`${messaging.map((targ) => targ.email + `,`)}  ${
													campaign.bcc
												}`
											)
										}
									>
										Copy recipients
									</Button>
								</center>
							</Grid>

							<Grid item sm={4} xs={12}>
								<center>
									<Button
										sx={BtnStyleSmall}
										onClick={() => navigator.clipboard.writeText(newSubject)}
									>
										Copy subject
									</Button>
								</center>
							</Grid>
							<Grid item sm={4} xs={12}>
								<center>
									<Button
										sx={BtnStyleSmall}
										onClick={() => navigator.clipboard.writeText(newTemplate)}
									>
										Copy email body
									</Button>
								</center>
							</Grid>
						</Grid>
					</>
				) : !sent ? (
					<>
						<p>
							You're almost there. Press the button below to open your{" "}
							{campaign.channel === "email" ? "email" : "Twitter"} client, and
							the message will be pre-filled in there for you. Then just hit
							send in there to fire it off.
						</p>
						<center>
							<Button
								href={generateLink()}
								target="_blank"
								rel="noopener noreferrer"
								//onClick={() => handleSend()}
								style={{ ...BtnStyle, marginTop: "5px" }}
							>
								Send{" "}
								{campaign.channel === "email"
									? `email${
											emailClient !== null && emailClient !== "mobile"
												? ` with ${emailClient}`
												: ""
									  }`
									: "tweet"}
							</Button>
							{!Mobile &&
								campaign.channel === "email" &&
								emailClient !== null && (
									<div>
										<Button
											href={generateLink(true)}
											target="_blank"
											rel="noopener noreferrer"
											//onClick={() => handleSend()}
											style={{ ...BtnStyleTiny, marginTop: "5px" }}
										>
											Send with your native email app
										</Button>
									</div>
								)}
						</center>
						{/*
						{!Mobile && campaign.channel === "email" && (
							<>
								<br />
								<p>
									If you use Gmail or Yahoo Mail, you can use these buttons to
									send the message from your browser:
								</p>
								<div
									style={{ display: "flex", justifyContent: "space-around" }}
								>
									<Button
										href={generateLink()}
										//onClick={() => handleSend()}
										style={{ ...BtnStyleSmall, marginTop: "5px" }}
									>
										Send via Gmail
									</Button>
									<Button
										href={generateLink()}
										//onClick={() => handleSend()}
										style={{ ...BtnStyleSmall, marginTop: "5px" }}
									>
										Send via Yahoo
									</Button>
								</div>
							</>
						)}
							*/}
						<br />
						<span style={{ fontSize: "12px" }}>
							<em>
								Not working?{" "}
								<span onClick={() => setNoClient(true)}>
									<u>Copy & paste instead.</u>
								</span>
							</em>
						</span>
					</>
				) : (
					<>
						<p>
							Nice one! Will you now{" "}
							<b>take a moment to share the campaign with a few friends?</b> You
							can use the buttons below:
						</p>
						<div style={{ display: "flex", justifyContent: "space-around" }}>
							<Button
								sx={BtnStyle}
								target="_blank"
								href={`http://wa.me/?text=${encodeURI(
									"Hey! I've just taken part in this campaign - check it out here: " +
										campaign.title +
										" " +
										window.location.href
								)}`}
							>
								Share on WhatsApp
							</Button>
							<Button
								sx={BtnStyle}
								target="_blank"
								href={`https://bsky.app/intent/compose?text=${encodeURI(
									campaign.title + " " + window.location.href
								)}`}
							>
								Share on BlueSky
							</Button>
						</div>

						<p>
							You can also just{" "}
							<Tooltip
								open={copied}
								title="Copied"
								disableHoverListener
								disableFocusListener
								disableTouchListener
								placement="top"
								PopperProps={{
									modifiers: [
										{
											name: "offset",
											options: {
												offset: [0, -14], // Adjust the second value to move tooltip closer/further
											},
										},
									],
								}}
							>
								<span
									onClick={handleCopy}
									style={{
										cursor: "pointer",
										color: "inherit",
										textDecoration: "underline",
									}}
								>
									click here
								</span>
							</Tooltip>{" "}
							to copy the link and share it with your friends!
						</p>

						<span style={{ fontSize: "12px" }}>
							<em>
								Didn't work? If your email client didn't open, you can use{" "}
								<span onClick={() => setNoClient(true)}>
									<u>copy & paste instead.</u>
								</span>
							</em>
						</span>
					</>
				)}

				<center>
					<Button
						sx={{ ...BtnStyle, transform: "scale(0.8)", marginTop: "5px" }}
						onClick={onClose}
					>
						Close
					</Button>
				</center>
			</Box>
		</Modal>
	);
};