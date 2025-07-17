export const BtnStyle = {
	fontSize: "large",
	//textTransform: "none",
	fontWeight: "800",
	borderRadius: "10px",
	padding: '8px 8px 4px 8px',
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
	padding: '6px 6px 3px 6px',
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

export const BtnStyleCancel = {
	fontSize: "medium",
	//textTransform: "none",
	fontWeight: "600",
	borderRadius: "10px",
	padding: '6px 6px 3px 6px',
	color: "var(--secondary-color)",
	backgroundColor: "var(--alert-color)",
	border: "1px solid var(--box-outline)",
	"&:hover, &:active": {
		backgroundColor: "var(--secondary-color)",
		color: "var(--alert-color)",
		border: "1px solid var(--alert-color)",
	},
	"&:disabled": {
		color: "var(--button-disabled-color)",
		backgroundColor: "var(--button-disabled-background)",
	},
};


export const BtnStyleSecondary = {
	fontSize: "medium",
	//textTransform: "none",
	fontWeight: "600",
	borderRadius: "10px",
	padding: '6px 6px 3px 6px',
	color: "var(--button-color)",
	backgroundColor: "var(--secondary-color)",
	border: "1px solid var(--button-color)",
	"&:hover, &:active": {
		backgroundColor: "var(--primary-color-semi-trans)",
		color: "var(--secondary-color)",
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


  export const MobileStepperStyle = {
	backgroundColor: 'white',
	p: 0,
  
	// center the dots
	'& .MuiMobileStepper-dots': {
	  display: 'flex',
	  justifyContent: 'center',
	  p: 1,
	},
  
	// inactive dots
	'& .MuiMobileStepper-dot': {
	  backgroundColor: '#ccc',
	  width: 8,
	  height: 8,
	  margin: '0 4px',
	},
  
	// active dot (override default blue)
	'& .MuiMobileStepper-dotActive': {
	  backgroundColor: 'var(--textfield-outline) !important',
	},
  
	// override the Next/Back button text color
	// these Buttons are rendered with .MuiButton-text and .MuiButton-textPrimary
	'& .MuiMobileStepper-button': {
	  // target the inner <button>
	  '& button.MuiButton-text': {
		color: 'var(--textfield-outline) !important',
	  },
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
  