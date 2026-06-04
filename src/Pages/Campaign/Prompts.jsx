import React, { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { TextFieldStyle } from "../../MUIStyles";

//this component just _renders_ the prompt questions, it doesn't handle replacing the prompts in the message with the  user's answers

const Prompts = ({ prompts, setPrompts }) => {
	const handlePromptAnswerChange = (e, prompt, index) => {
		const nextValue =
			prompt.answerType === "yesno"
				? e.target.value === "yes"
					? true
					: e.target.value === "no"
					? false
					: ""
				: e.target.value;

		setPrompts((prevPrompts) =>
			prevPrompts.map((p, promptIndex) =>
				promptIndex === index ? { ...p, answer: nextValue } : p
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
			{prompts.map((prompt, index) => {
				return (
					<div key={`${prompt.id || "prompt"}-${index}`}>
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
									required={Boolean(prompt.required)}
									onChange={(e) => handlePromptAnswerChange(e, prompt, index)}
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
									required={Boolean(prompt.required)}
									onChange={(e) => handlePromptAnswerChange(e, prompt, index)}
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
									id={`yes-no-select-${prompt.id || index}`}
									value={
										prompt.answer === true
											? "yes"
											: prompt.answer === false
											? "no"
											: ""
									}
									required={Boolean(prompt.required)}
									onChange={(e) => handlePromptAnswerChange(e, prompt, index)}
								>
									<MenuItem value="">Select...</MenuItem>
									<MenuItem value="yes">Yes</MenuItem>
									<MenuItem value="no">No</MenuItem>
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
