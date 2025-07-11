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


// StepperStyle.js
export const StepperStyle = {
	backgroundColor: 'white',
	p: 0,
  
	// style the connector line
	'& .MuiStepConnector-root .MuiStepConnector-line': {
	  borderColor: 'var(--textfield-outline)',
	  borderTopWidth: 3,
	},
  
	// base icon color
	'& .MuiStepIcon-root': {
	  color: '#ccc',
	},
	// active step icon
	'& .MuiStepIcon-root.Mui-active': {
	  color: 'var(--textfield-outline)',
	},
	// completed step icon
	'& .MuiStepIcon-root.Mui-completed': {
	  color: 'var(--textfield-outline)',
	},
  
	// label text
	'& .MuiStepLabel-label': {
	  color: 'rgba(0,0,0,0.6)',
	},
	// active label
	'& .MuiStepLabel-label.Mui-active': {
	  color: 'var(--textfield-outline)',
	},
	// completed label
	'& .MuiStepLabel-label.Mui-completed': {
	  color: 'var(--textfield-outline)',
	},
  };
  

  // in your styles file (e.g. src/styles/RadioStyles.js)
export const RadioGroupStyle = {

  
	// target each label+radio wrapper
	'& .MuiFormControlLabel-root': {
	  margin: 0,
  
	  // style the radio itself
	  '& .MuiRadio-root': {
		color: 'var(--textfield-outline)',
		'&.Mui-checked': {
		  color: 'var(--textfield-outline)',
		},
		'&:hover': {
		  backgroundColor: 'rgba(0,0,0,0.08)',
		},
		'&.Mui-focusVisible': {
		  outline: '2px solid var(--textfield-outline)',
		},
	  },
  
	  // style the label text
	  '& .MuiFormControlLabel-label': {
		color: 'rgba(0,0,0,0.6)',
		'&.Mui-disabled': {
		  color: 'rgba(0,0,0,0.38)',
		},
	  },
	},
  };
  