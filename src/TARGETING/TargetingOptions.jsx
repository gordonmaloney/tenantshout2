
//This is where the drop-down is created when creating a new campaign


//TODO - either remove the rule  part  from this  array or  make  it work properly idk

export const TargetingOptions = [
    {
        name: 'MSPs',
        value: "msps",
        description: "Target the user's MSPs, based on their postcode",
        rule: "function logic, or at least the function name or sth"
    },
    {
        name: 'Edinburgh City Council',
        value: "edinburgh",
        description: "Target the user's councillors, based on their postcode",
        rule: "function logic, or at least the function name or sth"
    },  
    {
        name: 'Glasgow City Council',
        value: "glasgow",
        description: "Target the user's councillors, based on their postcode",
        rule: "function logic, or at least the function name or sth"
    },  
    {
        name: 'MPs',
        value: "mps",
        description: "Target the user's MP, based on their postcode",
        rule: "function logic, or at least the function name or sth"
    },
    {
        name: 'Edinburgh Council - Regulatory Committee',
        value: "edregcttee",
        description: "All members of the ECC Regulatory Committee",
        rule: "function logic, or at least the function name or sth"
    },  
    {
        name: 'Custom Target',
        value: "custom",
        description: "One or more custom targets.",
        rule: "function logic, or at least the function name or sth"
    }, 
]