export const BtnStyle = {
	fontSize: "large",
	//textTransform: "none",
	fontWeight: "800",
	borderRadius: "10px",
	color: "var(--secondary-color)",
	backgroundColor: "var(--button-color)",
	border: "1px solid var(--button-color)",
	"&:hover, &:active": {
		backgroundColor: "var(--secondary-color)",
		color: "var(--button-color)",
	},
	"&:disabled": { color: "red" },
};

export const BtnStyleSmall = {
	fontSize: "medium",
	//textTransform: "none",
	fontWeight: "600",
	borderRadius: "10px",
	color: "var(--secondary-color)",
	backgroundColor: "var(--button-color)",
	border: "1px solid var(--button-color)",
	"&:hover, &:active": {
		backgroundColor: "var(--secondary-color)",
		color: "var(--button-color)",
	},
	"&:disabled": {
		color: "var(--button-disabled-color)",
		backgroundColor: "var(--button-disabled-background)",
	},
};

export const BtnStyleTiny = {
	fontSize: "small",
	//textTransform: "none",
	fontWeight: "600",
	borderRadius: "10px",
	color: "var(--secondary-color)",
	backgroundColor: "var(--button-color)",
	border: "1px solid var(--button-color)",
	"&:hover, &:active": {
		backgroundColor: "var(--secondary-color)",
		color: "var(--button-color)",
	},
	"&:disabled": {
		color: "var(--button-disabled-color)",
		backgroundColor: "var(--button-disabled-background)",
	},
};


export const CheckBoxStyle = {
	color: "var(--button-color)", // Default color for the checkbox
	"&.Mui-checked": {
		color: "var(--button-color)", // Color when the checkbox is checked
	},
	"&:hover": {
		backgroundColor: "var(--secondary-color)",
		color: "var(--button-color)",
	},
};


export const TextFieldStyle = {
	backgroundColor: "rgba(0,0,0,0)",
	marginBottom: "12px",
	marginTop: "3px",
	"& label.Mui-focused": {
		color: "var(--textfield-outline)",
	},
	"& .MuiInput-underline:after": {
		borderBottomColor: "var(--textfield-outline)",
	},
	"& .MuiFilledInput-underline:after": {
		borderBottomColor: "var(--textfield-outline)",
	},
	"& .MuiOutlinedInput-root": {
		"&.Mui-focused fieldset": {
			borderColor: "var(--textfield-outline)",
		},
		"& .MuiSelect-root": {
			"&.Mui-focused fieldset": {
				borderColor: "var(--textfield-outline)",
			},
		},
	},
};