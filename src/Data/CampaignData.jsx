export const ALL_CAMPAIGNS = [
	{
		campaignId: "renthikes",
		campaign: {
			id: "renthikes",
			title: "Report your rent hike",
			host: "Living Rent",
			channel: "email",
			target: "msps",
			blurb: `Scotland's housing crisis is only getting worse - but MSPs have their heads in the sand. Use this tool to email them and make sure they can't ignore the impact rent hikes are having on tenants.`,
			link: "http://livingrent.org/",
			prompts: [
				{
					id: "yourname",
					question: "Your name:",
					answerType: "text",
					required: true,
					answer: null,
				},
				{
					id: "hike",
					question: "Have you recently been served a rent hike yourself?",

					answerType: "yesno",
					required: false,
					answer: null,
				},
				{
					id: "whyimportant",
					question: "Say in your own words how the crisis has impacted you:",

					answerType: "text",
					required: true,
					answer: null,
				},
			],
			subject: "Stand up for tenants",
			bcc: "contact@livingrent.org",
			template: `Dear MSPs,

Across Scotland, eye-watering rent hikes are driving tenants into poverty. <<hike=yes:I myself have just been served a rent increase.>> The housing crisis is only getting worse, and we need action.

<<whyimportant>>

My story is just one of hundreds of thousands that show why Scotland so desperately needs rent controls. As my MSPs, can I count on you to stand with tenants - and stand up to landlords?

Thank you,
<<yourname>>`,
			customTarget: [""],
			accordion: [
				{
					q: `Why rent controls?`,
					a: `Rent controls are the norm across Europe. Without them, rents will continue to go through the roof - and tenants will continue to suffer. That's why it's so important that MSPs recognise the scale of the problem - and act accordingly.`,
				},
				{
					q: `How can I get more involved in the campaign?`,
					a: `Great question! And the answer is simple: <a href="https://livingrent.org/join" target="_blank">join Living Rent</a> and get active in your local branch.`,

				},
			],
		},
	},
	{
		campaignId: "regctteetest",
		campaign: {
			id: "regctteetest",
			title: "Email the regulatory committee",
			host: "Living Rent Leith",
			channel: "email",
			target: "custom",
			customTargetting: "edregcttee",
			blurb: `test`,
			link: "https://livingrent.org/",
			prompts: [],
			subject: "test",
			bcc: "test@test.com",
			template: `Dear members of the Regulatory Committee,\n\nadfh`,
			accordion: [],
		},
	},
];