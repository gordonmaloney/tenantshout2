import React, { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { TextFieldStyle } from "../../MUIStyles";
import FetchTarget from "./FetchTarget";

//this component just _renders_ the prompt questions, it doesn't handle replacing the prompts in the message with the  user's answers

const Prompts = ({ prompts, setPrompts }) => {
	const handlePromptAnswerChange = (e, prompt) => {
		setPrompts((prevPrompts) =>
			prevPrompts.map((p) =>
				p.id === prompt.id ? { ...p, answer: e.target.value } : p
			)
		);
	};

	//logic to stop prompts being highlighted every time they're saved
	const [promptsChanged, setPromptsChanged] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setPromptsChanged(true), 300);
		return () => clearTimeout(timer);
	}, [prompts]);

	return (
		<div>
			{prompts.map((prompt) => {
				return (
					<div key={prompt.id}>
						<div className="promptQ">
							{prompt.question} {prompt.required && "*"}
						</div>
						{
							//textfield for text type questions
							prompt.answerType == "text" && (
								<TextField
									placeholder="Your answer here..."
									sx={TextFieldStyle}
									fullWidth
									value={prompt.answer || ""}
									required
									onChange={(e) => handlePromptAnswerChange(e, prompt)}
								/>
							)
						}
												{
							//textfield for text type questions
							prompt.answerType == "text-multiline" && (
								<TextField
									placeholder="Your answer here..."
									sx={TextFieldStyle}
									fullWidth
									rows={3}
									multiline
									value={prompt.answer || ""}
									required
									onChange={(e) => handlePromptAnswerChange(e, prompt)}
								/>
							)
						}
						{
							//select field for yes/no questions
							prompt.answerType == "yesno" && (
								<TextField
									select
									fullWidth
									sx={TextFieldStyle}
									id="yes-no-select"
									value={prompt.answer}
									onChange={(e) => handlePromptAnswerChange(e, prompt)}
								>
									<MenuItem value={null}>Select...</MenuItem>
									<MenuItem value={true}>Yes</MenuItem>
									<MenuItem value={false}>No</MenuItem>
								</TextField>
							)
						}
					</div>
				);
			})}
		</div>
	);
};

export default Prompts;
