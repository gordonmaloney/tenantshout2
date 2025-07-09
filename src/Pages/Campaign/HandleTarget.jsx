export const handleTarget = (target, channel) => {
	let ContactVerb = "Message";
	if (channel === "email") ContactVerb = "Email";
	else if (channel === "twitter") ContactVerb = "Tweet";

	if (target == "MPs") {
		const label = `${ContactVerb} your MP`;
		const postcodeRequired = true;
	}

	if (target == "MSPs") {
		const label = `${ContactVerb} your MSPs`;
		const postcodeRequired = true;
	}

	if (target == "ECC") {
		const label = `${ContactVerb} your Councillors`;
		const postcodeRequired = true;
	}

	if (target == "Custom") {
		const label = `Send your message ${ContactVerb}`;
		const postcodeRequired = true;
	}
};

export const handleFetchingTarget = (target, postcode) => {

    if (target == "MPs") {
        //process postcode to get relevant MP
    }

};
