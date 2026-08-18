// Track removed sections for restoration
let removedSections = [];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRoofReportApp();
});

// Health and Safety/Access Requirements — appended to every Specific Concern's fields (moved off the
// single top-level Roof Details field so each concern can carry its own access requirement).
const HEALTH_SAFETY_FIELDS = [
    { name: 'healthSafety', type: 'select', label: 'Health and Safety/Access Requirements', options: [
        { value: '1-person-harness', label: '1 Person Harness Use' },
        { value: '2-person-harness', label: '2 Person Harness Use' },
        { value: 'fixed-scaffold-metered', label: 'Fixed Scaffold Meterd' },
        { value: 'portable-scaffold', label: 'Portable Scaffold' },
        { value: 'other', label: 'Other' }
    ]},
    { name: 'healthSafetyOther', type: 'text', label: 'Please specify', dependsOn: 'healthSafety', showWhen: 'other' }
];

// Comprehensive roof data structure with 6 roof types, their sub-types, and complete section data from txt file
const roofData = {
    'profiled-metal': {
        name: 'Profiled Metal',
        subTypes: {
            'corrugated-metal': {
                name: 'Corrugated metal Roofing',
                sections: {
                    'sheet-condition': {
                        title: 'Sheet condition',
                        overallConditions: {
                            'good-like-new': {
                                title: 'Good (like new)',
                                description: 'Roof sheeting appears to be in a good condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'satisfactory': {
                                title: 'Satisfactory',
                                description: 'Roof sheeting appears to be in a satisfactory condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'average-moss': {
                                title: 'Average (moss present)',
                                description: 'The roof sheeting condition appears to be in an average condition with visible moss & mold present. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this can cause damage to your iron or coloursteel roof. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained.'
                            },
                            'average-paint': {
                                title: 'Average (paint fading)',
                                description: 'The roof sheeting appears to be in an average condition with paint fade being apparent throughout. Our technician has determined that the roof sheeting is still in a remedial state. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'average-rust': {
                                title: 'Average (rust present under 60% non structural)',
                                description: 'The roof sheeting appears to be an average condition with signs of surface rust present throughout your roofing. Our technician has determined that the roof sheeting is still in a remedial state. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'average-combination': {
                                title: 'Average combination',
                                description: 'The roof sheeting appears to be in an average condition with moss and mold present and the roofs protection coating failing. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'poor-rust': {
                                title: 'Poor (rust present over 60%)',
                                description: 'We have identified large amounts of rust across the majority of the roof sheeting. This rust has been classed as destructive/structural rust and requires urgent remediation. It is likely this rust is causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas to attempt to make the building envelope water tight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            },
                            'poor-structural': {
                                title: 'Poor (Irreparable damage/structural integrity)',
                                description: 'We have identified large amounts of damage across the roof sheeting. Our technician has determined this damage is affecting the roofings structural integrity and requires urgent remediation. It is likely this damage is either causing or about to start causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas in an attempt to make the building envelope watertight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            }
                        },
                        specificConcerns: {
                            'rust-holes': {
                                title: 'Rust holes present',
                                description: 'We have identified a specific area of concern for rust damage on your roof sheeting. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'sheetCount', type: 'number', label: 'Number of replacement sheets' },
                                    { name: 'sheetLength', type: 'number', label: 'Length of sheets (m)', step: 0.1 },
                                    { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                    { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'scratches-dents': {
                                title: 'Scratches/dents/dings worth notifying',
                                description: 'We have identified scratches/dents/damage that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'sheetCount', type: 'number', label: 'Number of replacement sheets' },
                                    { name: 'sheetLength', type: 'number', label: 'Length of sheets (m)', step: 0.1 },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'damaged-sheet': {
                                title: 'Damaged sheet',
                                description: 'We have identified damaged roof sheeting that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'sheetCount', type: 'number', label: 'Number of replacement sheets' },
                                    { name: 'sheetLength', type: 'number', label: 'Length of sheets (m)', step: 0.1 },
                                    { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                    { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'screws-fixings-missing': {
                                title: 'Screws/Fixings Missing/Loose',
                                description: 'We have identified loose/missing screws or fixings that have come to the attention of our technician. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'nailType', type: 'select', label: 'Type of Fixing', options: ['Screw', 'Lead Nail Head', 'Swivel Nail'] },
                                    { name: 'nailCount', type: 'number', label: 'No. of Fixings to Replace' },
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'optional-extra': {
                                title: 'Optional extra',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'design-issue': {
                                title: 'Design Issue',
                                description: 'A design issue has been identified on the roof.',
                                fields: [
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'damaged-flashing': {
                                title: 'Damaged Flashing / Lifting Flashing',
                                description: 'We have identified damaged or lifting flashing. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'flashingType', type: 'flashing-select', label: 'Flashing Type', options: [
                                        { value: 'valley', label: 'Valley' },
                                        { value: 'barge', label: 'Barge' },
                                        { value: 'apron', label: 'Apron' },
                                        { value: 'ridge', label: 'Ridge' },
                                        { value: 'drip-edge', label: 'Drip Edge Flashing' },
                                        { value: 'tray-penetration', label: 'Tray / Penetration Flashing' },
                                        { value: 'other', label: 'Other' }
                                    ]},
                                    ...HEALTH_SAFETY_FIELDS
                                ],
                                flashingFields: {
                                    'valley': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Valley Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'barge': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Barge Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'apron': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Apron Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'ridge': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Ridge Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'drip-edge': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true }
                                    ],
                                    'tray-penetration': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'other': [
                                        { name: 'description', type: 'textarea', label: 'Description' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true }
                                    ]
                                }
                            },
                            'moss-issue': {
                                title: 'Moss Issue',
                                description: 'Moss and mold has been identified on the roof surface.',
                                fields: [
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'gutters-full': {
                                title: 'Gutters Full',
                                description: 'Gutters have been found to be full during inspection.',
                                fields: [
                                    { name: 'guttersFull', type: 'yesno', label: 'Gutters Full?' },
                                    { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'butynol-damage': {
                                title: 'Butynol Damage',
                                description: 'Butynol damage has been identified.',
                                fields: [
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            }
                        }
                    },
                    'hip-ridging': {
                        title: 'Hip and ridging condition',
                        overallConditions: {
                            'good': {
                                title: 'Good',
                                description: 'Roof ridging appears to be in a good condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'satisfactory': {
                                title: 'Satisfactory',
                                description: 'Roof ridging appears to be in a satisfactory condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'average-moss': {
                                title: 'Average (moss present)',
                                description: 'The roof ridging condition appears to be in an average condition with visible moss & mold present. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this can cause damage to your iron or coloursteel roof. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained.'
                            },
                            'average-paint': {
                                title: 'Average (paint fading)',
                                description: 'The roof ridging appears to be in an average condition with paint fade being apparent throughout'
                            },
                            'average-combination': {
                                title: 'Average combination',
                                description: 'The roof sheeting appears to be in an average condition with moss and mold present and the roofs protection coating failing.'
                            },
                            'poor-rust': {
                                title: 'Poor (rust present over 60%)',
                                description: 'We have identified large amounts of rust across the ridgeline. This rust has been classed as destructive/structural rust and requires urgent remediation. It is likely this rust is causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas to attempt to make the building envelope water tight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a replacement roof please advise and we can arrange a quote.'
                            },
                            'poor-structural': {
                                title: 'Poor (Irreparable damage/structural integrity)',
                                description: 'We have identified that there is large amounts of damage across the roofline. Our technician has determined this damage is affecting the roofings structural integrity and requires urgent remediation. It is likely this damage is causing or about to cause water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas in an attempt to make the building envelope watertight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            }
                        },
                        specificConcerns: {
                            'rust-holes': {
                                title: 'Rust holes present',
                                description: 'We have identified a specific area of concern for rust damage on your roof ridging. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'scratches-dents': {
                                title: 'Scratches/dents/dings worth notifying',
                                description: 'We have identified scratches/dents/damage that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'loose-ridging': {
                                title: 'Loose ridging loose/missing',
                                description: 'We have identified loose/missing ridging/fixings that have come to the attention of our technician. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'optional-extra': {
                                title: 'Optional extra',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' }
                                ]
                            },
                            'moss': {
                                title: 'Moss',
                                description: 'Moss and mold has been identified on the hip and ridging.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            }
                        }
                    },
                    'roof-fixings': {
                        title: 'Roof fixings condition',
                        fixingTypes: {
                            'lead-nail-heads': 'Lead nail heads were used in the past for the fast and reliable fitting of iron roofing.These are an old style method of fixing metal roofs and no longer are in use and goes against today\'s current code of practice (v24 .09). We recommend replacement with certified roof tek screw fasteners.',
                            'concealed-fasteners': 'Your roofing type does not have roof fixings visible to our technician. This is due to the roof fastening being concealed under the roofing.',
                            'tek-screw-fasteners': 'Tek screw Fasteners - Overall condition',
                            'cyclone-nailheads': 'Cyclone nailheads - Overall condition'
                        },
                        overallConditions: {
                            'good-like-new': {
                                title: 'Good (like new)',
                                description: 'Roof fasteners appear to be in a good condition. There are no obvious signs of wear and tear, and/or damage to the roof fasteners to be of concern.'
                            },
                            'good': {
                                title: 'Good',
                                description: 'Roof fasteners appear to be of average condition. There are no obvious signs of wear and tear, and/or damage to the roof fasteners to be of concern.'
                            },
                            'average': {
                                title: 'Average',
                                description: 'Roof fasteners appear to be of average condition. There are no significant signs of damage or deterioration. Paint fade applicable.'
                            },
                            'poor-rust': {
                                title: 'Poor (Rust)',
                                description: 'Roof fasteners are in poor condition and have rust present. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'poor-loose-missing': {
                                title: 'Poor (loose/missing)',
                                description: 'Roof fasteners are in poor condition and are loose.missing in ares. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.'
                            }
                        },
                        specificConcerns: {
                            'washers-damaged': {
                                title: 'Washers damaged/missing isolated',
                                description: 'We have identified a specific area of concern for missing/ damaged washers on your roof fixings. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'loose-screws-nails': {
                                title: 'Loose screws/nails isolated',
                                description: 'We have identified a specific area of concern for missing/ damaged roof fixings on your roof. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'rivet-fixings': {
                                title: 'Rivet fixings',
                                description: 'We have identified a specific area of concern for missing/ damaged roof rivet fixings on your roof. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'additional': {
                                title: 'Additional',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' }
                                ]
                            }
                        }
                    },
                    'valleys': {
                        title: 'Valley/s Condition',
                        hasNumberField: true,
                        numberFieldName: 'valleyCount',
                        numberFieldLabel: 'Number of valleys',
                        overallConditions: {
                            'good-like-new': {
                                title: 'Good (like new)',
                                description: 'Roof valleys appear to be in a good condition. There are no obvious signs of wear and tear, and/or damage, or debris in the roof valleys to be of concern.'
                            },
                            'good': {
                                title: 'Good',
                                description: 'Roof valleys appear to be of average condition. There are no obvious signs of wear and tear, debris, and/or damage to the roof valleys to be of concern.'
                            },
                            'average': {
                                title: 'Average',
                                description: 'Roof valleys appear to be of average condition. There are no significant signs of damage or deterioration minor debris present. Recommend clearing all debris for adequate water flow.'
                            },
                            'poor-rust': {
                                title: 'Poor (Rust)',
                                description: 'Roof valleys are in poor condition and have rust present. We recommend a repair to be carried out for this concern as water ingress is likely to enter the property. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'poor-debris': {
                                title: 'Poor (Full of debris)',
                                description: 'Roof valleys are in poor condition and are blocked causing inadequate water flow. We recommend urgent remedial works to be carried out for this concern as water ingress is likely to enter the property. Please advise if you would like to pursue a recommendation for this repair.'
                            }
                        },
                        specificConcerns: {
                            'optional-extra': {
                                title: 'Optional extra',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' }
                                ]
                            }
                        }
                    },
                    'penetration-flashing': {
                        title: 'Penetration flashing/s condition',
                        overallConditions: {
                            'good-like-new': {
                                title: 'Good (like new)',
                                description: 'Roof penetrations appear to be in a good condition. There are no obvious signs of wear and tear, and/or damage.'
                            },
                            'good': {
                                title: 'Good',
                                description: 'Roof penetrations appear to be of average condition. There are no obvious signs of wear and tear, debris, and/or damage to the roof penetrations to be of concern.'
                            },
                            'average': {
                                title: 'Average',
                                description: 'Roof penetrations appear to be in average condition. There are no significant signs of damage or deterioration. Sealant appears to be in a stable condition.'
                            },
                            'poor-seal': {
                                title: 'Poor (poor Seal)',
                                description: 'Roof penetrations are in poor condition and have deterioration present. We recommend a repair to be carried out for this concern as water ingress is likely to enter the property. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'poor-debris': {
                                title: 'Poor (Full of debris)',
                                description: 'Roof penetrations are installed incorrectly and are disrupting water flow. We recommend urgent remedial works to be carried out for this concern as water ingress is likely to enter the property. Please advise if you would like to pursue a recommendation for this repair.'
                            }
                        },
                        specificConcerns: {
                            'rubber-boot-perished': {
                                title: 'Rubber boot perished/ cracking',
                                description: 'Rubber boot/dektite flashing deteriorating. We recommend replacement of this replaceable part',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'penetration-flashing-loose': {
                                title: 'Penetration flashing loose',
                                description: 'Penetration flashing loose/damaged. We recommend replacement or repair. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'penetration-flashing-missing': {
                                title: 'Penetration flashing missing/damaged',
                                description: 'Penetration flashing loose/damaged. We recommend replacement or repair. We recommend urgent remedial works to be carried out for this concern as water ingress is likely to enter the property. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' }
                                ]
                            },
                            'optional-extra': {
                                title: 'Optional extra',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' }
                                ]
                            }
                        }
                    },
                    'aerials-antennas': {
                        title: 'Aerials/ antennas above roofing',
                        hasApplicable: true,
                        overallConditions: {
                            'good': {
                                title: 'Good',
                                description: 'Roof antennas/aerials appear to be of good condition. There are no obvious signs of wear and tear, and/or damage to the roof aerials to be of concern.'
                            },
                            'average': {
                                title: 'Average',
                                description: 'Roof antennas/aerials appear to be in average condition. There are no significant signs of damage or deterioration. Sealant appears to be in a stable condition.'
                            },
                            'poor-loose': {
                                title: 'Poor (Loose)',
                                description: 'Roof antennas/aerials are in a poor condition and loose/missing. We recommend a repair to be carried out for this concern as further damage to the roofing/building is possible. Please advise if you would like to pursue a recommendation for this repair.'
                            }
                        }
                    }
                }
            },
            'trapezio-metal': { name: 'Trapezio Metal Roofing (5rib)', sections: {} },
            'tray-euro': { name: 'Tray (Euro Style)', sections: {} },
            'multi-rib': { name: 'Multi Rib', sections: {} },
            'commercial': { name: 'Commercial', sections: {} },
            'other': { name: 'Other', sections: {} }
        }
    },
    'compressed-metal-tile': {
        name: 'Compressed Metal Tile',
        subTypes: {
            'decramastic': {
                name: 'Decramastic',
                sections: {
                    'metal-tile-condition': {
                        title: 'Metal tile condition',
                        overallConditions: {
                            'good': {
                                title: 'Good',
                                description: 'The roofing metal tile used appears to be in a good condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'satisfactory': {
                                title: 'Satisfactory',
                                description: 'The roofing metal tile used appears to be in a satisfactory condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'average-moss': {
                                title: 'Average (moss present)',
                                description: 'The roofing metal tile condition appears to be in an average condition with visible moss & mold present. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this can cause damage to your iron or coloursteel roof. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained.'
                            },
                            'average-paint': {
                                title: 'Average (paint fading)',
                                description: 'The roofing metal tile appears to be in an average condition with paint fade being apparent throughout. Our technician has determined that the roof sheeting is still in a remedial state. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'average-rust': {
                                title: 'Average (rust present under 60% non structural)',
                                description: 'The roofing metal tile appears to be an average condition with signs of surface rust present throughout your roofing. Our technician has determined that the roof sheeting is still in a remedial state. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'average-combination': {
                                title: 'Average combination',
                                description: 'The roofing metal tile appears to be in an average condition with moss and mold present and the roofs protection coating failing. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'poor-rust': {
                                title: 'Poor (rust present over 60%)',
                                description: 'We have identified large amounts of rust across the majority of the roof metal tiling. This rust has been classed as destructive/structural rust and requires urgent remediation. It is likely this rust is causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas to attempt to make the building envelope water tight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            },
                            'poor-structural': {
                                title: 'Poor (Irreparable damage/structural integrity)',
                                description: 'We have identified large amounts of damage across the roof metal tiling. Our technician has determined this damage is affecting the roofings structural integrity and requires urgent remediation. It is likely this damage is either causing or about to start causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas in an attempt to make the building envelope watertight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            }
                        },
                        specificConcerns: {
                            'rust-damage': {
                                title: 'Rust Damage',
                                description: 'We have identified a specific area of concern for rust damage on your roof metal tiling. This is a potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'tileCount', type: 'number', label: 'Number of replacement tiles' },
                                    { name: 'tileLength', type: 'number', label: 'Length of tiles (m)', step: 0.1 },
                                    { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                    { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'dented-sheet-tile': {
                                title: 'Dented Sheet Tile',
                                description: 'We have identified dented metal tile sheeting that has come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'dentedTileCount', type: 'number', label: 'No. of Dented Tiles' },
                                    { name: 'replacement', type: 'yesno', label: 'Replacement Needed?' },
                                    { name: 'howMany', type: 'number', label: 'How Many to Replace', dependsOn: 'replacement', showWhen: 'yes' },
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'chipped-coat': {
                                title: 'Chipped Coat / Paint Loose',
                                description: 'We have identified chipped coating or loose paint on the roof metal tiling. This can lead to accelerated deterioration if left untreated. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'severity', type: 'select', label: 'Paint Chip Coat Affected Level', options: [
                                        { value: 'low', label: 'Low (Small amount of area)' },
                                        { value: 'moderate', label: 'Moderate (50%)' },
                                        { value: 'high', label: 'High (Majority)' }
                                    ]},
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'damaged-sheet': {
                                title: 'Damaged sheet',
                                description: 'We have identified damaged metal tiling that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'amount', type: 'number', label: 'Amount' },
                                    { name: 'length', type: 'number', label: 'Length', step: 0.1 },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'loose-sheeting': {
                                title: 'Loose sheeting loose/missing',
                                description: 'We have identified loose/missing roof metal tiling that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'subject', type: 'text', label: 'Optional extra subject' },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'gutters-full': {
                                title: 'Gutters Full',
                                description: 'Gutters have been found to be full during inspection.',
                                fields: [
                                    { name: 'guttersFull', type: 'yesno', label: 'Gutters Full?' },
                                    { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'moss-issue': {
                                title: 'Moss Issue',
                                description: 'Moss and mold has been identified on the roof surface.',
                                fields: [
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'damaged-flashing': {
                                title: 'Damaged Flashing / Lifting Flashing',
                                description: 'We have identified damaged or lifting flashing. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'flashingType', type: 'flashing-select', label: 'Flashing Type', options: [
                                        { value: 'valley', label: 'Valley' },
                                        { value: 'barge', label: 'Barge' },
                                        { value: 'apron', label: 'Apron' },
                                        { value: 'ridge', label: 'Ridge' },
                                        { value: 'drip-edge', label: 'Drip Edge Flashing' },
                                        { value: 'tray-penetration', label: 'Tray / Penetration Flashing' },
                                        { value: 'other', label: 'Other' }
                                    ]},
                                    ...HEALTH_SAFETY_FIELDS
                                ],
                                flashingFields: {
                                    'valley': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Valley Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'barge': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Barge Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'apron': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Apron Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'ridge': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Ridge Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'drip-edge': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true }
                                    ],
                                    'tray-penetration': [
                                        { name: 'issueDescription', type: 'textarea', label: 'Issues Description' },
                                        { name: 'howMany', type: 'number', label: 'How Many to Replace' },
                                        { name: 'measurements', type: 'text', label: 'Measurements' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true },
                                        { name: 'patching', type: 'checkbox', label: 'Apply patch as cost-effective solution' },
                                        { name: 'patchingOutcome', type: 'yesno', label: 'Will cost-effective method achieve desired outcome for owner?', dependsOn: 'patching' }
                                    ],
                                    'other': [
                                        { name: 'description', type: 'textarea', label: 'Description' },
                                        { name: 'photos', type: 'file', label: 'Photos', multiple: true }
                                    ]
                                }
                            },
                            'butynol-damage': {
                                title: 'Butynol Damage',
                                description: 'Butynol damage has been identified.',
                                fields: [
                                    { name: 'description', type: 'textarea', label: 'Description' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'optional-extra': {
                                title: 'Optional extra',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            }
                        }
                    },
                    'hip-ridging': {
                        title: 'Hip and ridging condition',
                        hasApplicable: true,
                        overallConditions: {
                            'good': {
                                title: 'Good',
                                description: 'Roof ridging appears to be in a good condition throughout the roof line. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'satisfactory': {
                                title: 'Satisfactory',
                                description: 'Roof ridging appears to be in a satisfactory condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof sheeting to be of concern.'
                            },
                            'average-moss': {
                                title: 'Average (moss present)',
                                description: 'The roof ridging condition appears to be in an average condition with visible moss & mold present. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this can cause damage to your iron or coloursteel roof. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained.'
                            },
                            'average-paint': {
                                title: 'Average (paint fading)',
                                description: 'The roof ridging appears to be in an average condition with paint fade being apparent throughout'
                            },
                            'average-combination': {
                                title: 'Average combination',
                                description: 'The roof sheeting appears to be in an average condition with moss and mold present and the roofs protection coating failing.'
                            },
                            'poor-rust': {
                                title: 'Poor (rust present over 60%)',
                                description: 'We have identified large amounts of rust across the ridgeline. This rust has been classed as destructive/structural rust and requires urgent remediation. It is likely this rust is causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas to attempt to make the building envelope water tight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a replacement roof please advise and we can arrange a quote.'
                            },
                            'poor-structural': {
                                title: 'Poor (Irreparable damage/structural integrity)',
                                description: 'We have identified that there is large amounts of damage across the roofline. Our technician has determined this damage is affecting the roofings structural integrity and requires urgent remediation. It is likely this damage is causing or about to cause water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas in an attempt to make the building envelope watertight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            }
                        }
                    }
                }
            },
            'scallop-tile': { name: 'Scallop Tile', sections: {} },
            'compressed-metal-tile': { name: 'Compressed Metal Tile', sections: {} }
        }
    },
    'concrete-tile': {
        name: 'Concrete Tile',
        subTypes: {
            'atlas': {
                name: 'Atlas Roof Tile',
                sections: {
                    'roof-tile-condition': {
                        title: 'Roof tile condition',
                        overallConditions: {
                            'good': {
                                title: 'Good',
                                description: 'The roofing tile used appears to be in a good condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof tiling to be of concern.'
                            },
                            'satisfactory': {
                                title: 'Satisfactory',
                                description: 'The roofing tile used appears to be in a satisfactory condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof tiling to be of concern.'
                            },
                            'average-moss': {
                                title: 'Average (moss present)',
                                description: 'The roofing tile condition appears to be in an average condition with visible moss & mold present. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this can cause damage to your iron or coloursteel roof. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained.'
                            },
                            'average-paint': {
                                title: 'Average (paint fading)',
                                description: 'The roofing tile appears to be in an average condition with paint fade being apparent throughout. Our technician has determined that the roof tiling is still in a remedial state. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'average-fractures': {
                                title: 'Average (hairline fractures, corner chipping non structural)',
                                description: 'The roofing tile appears to be an average condition with signs of hairline fractures and corner chipping. Our technician has determined that the roof tiling is still in a remedial state. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'average-combination': {
                                title: 'Average combination',
                                description: 'The roofing tile appears to be in an average condition with moss and mold present and the roof\'s protection coating failing. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained. Please advise if you would like to pursue a recommendation for this repair.'
                            },
                            'poor-moss': {
                                title: 'Poor (Heavy moss present)',
                                description: 'The roofing tile condition appears to be in a poor condition with visible heavy moss & mold present. Moss and mold on your concrete roof is commonly an underestimated concern. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this will be causing your tiles to become porous & weak. We advise roof moss removal treatments and follow ups every 2 years to ensure your roof condition is well maintained.'
                            },
                            'poor-damaged': {
                                title: 'Poor (Multiple damaged tiles/ old tiling)',
                                description: 'We have identified multiple damaged/beyond use tiles across the majority of the roof tiling. This damage has been classed as destructive to the building and requires urgent remediation. It is likely the damaged tiling is causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas to attempt to make the building envelope water tight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            },
                            'poor-structural': {
                                title: 'Poor (Irreparable damage/structural integrity)',
                                description: 'We have identified large amounts of damage across the roof tiling. Our technician has determined this damage is affecting the roofings structural integrity and requires urgent remediation. It is likely this damage is either causing or about to start causing water ingress into your property. As a cost effective solution we can apply temporary repairs to major areas in an attempt to make the building envelope watertight. We do not recommend and we cannot guarantee the longevity and effectiveness of these repairs. We recommend replacing the roofing as a long-term solution. Please note for remedial maintenance work a warranty does not apply. If you want a price for a reroof please advise and we can arrange a quote.'
                            }
                        },
                        specificConcerns: {
                            'damaged-tiles': {
                                title: 'Broken Ridge/Barge Caps',
                                description: 'We have identified a specific area/s of concern for broken ridge/barge caps on your roof tiling. This is a potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'tileCount', type: 'number', label: 'Number of broken ridge/barge caps' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'missing-slipped-tiles': {
                                title: 'Missing /slipped tiles',
                                description: 'We have identified slipped/missing tiles that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'tileCount', type: 'number', label: 'Number of missing/slipped tiles' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'moss-isolated': {
                                title: 'Moss and mold isolated',
                                description: 'We have identified area/s with moss and mold present. Moss and mold on your concrete roof is commonly an underestimated concern. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this will be causing your tiles to become porous & weak. We advise roof moss removal treatments and follow ups every 2 years to ensure your roof condition is well maintained.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'chipped-tiles': {
                                title: 'Chipped tiles',
                                description: 'We have identified chipped tiles on your roof tiling. This is a cosmetic concern which can become a water entry point if left untreated. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'totalCount', type: 'number', label: 'Total number of chipped tiles' },
                                    { name: 'underCapsCount', type: 'number', label: 'Number of chipped tiles under roofing caps' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'porous-tiles': {
                                title: 'Porous tiles',
                                description: 'We have identified porous tiles on your roof tiling. Porous tiles have lost their protective coating and are absorbing moisture, which will accelerate further deterioration. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'totalCount', type: 'number', label: 'Total number of porous tiles' },
                                    { name: 'underCapsCount', type: 'number', label: 'Number of porous tiles under roofing caps' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'cracked-broken-tiles': {
                                title: 'Cracked/broken tiles',
                                description: 'We have identified cracked/broken tiles on your roof tiling. This is a potential water entry point and requires urgent remediation. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'totalCount', type: 'number', label: 'Total number of cracked/broken tiles' },
                                    { name: 'underCapsCount', type: 'number', label: 'Number of cracked/broken tiles under roofing caps' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'repointing-caps': {
                                title: 'Repointing cracked or Damaged',
                                description: 'We have identified cracked or damaged pointing on the roofing caps. We recommend a repoint to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'capsOnRoofLineCount', type: 'number', label: 'No. of caps on roof line' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'rebed-caps': {
                                title: 'Rebed Caps',
                                description: 'We have identified roofing caps that have come loose from their bedding. We recommend a rebed to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments' },
                                    { name: 'capsNeedingRebedCount', type: 'number', label: 'No. of caps needing to be rebedded' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            },
                            'optional-extra': {
                                title: 'Optional extra',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' },
                                    ...HEALTH_SAFETY_FIELDS
                                ]
                            }
                        }
                    },
                    'gable-barge-capping': {
                        title: 'Gable ends and/or barge capping',
                        hasApplicable: true,
                        endTypes: {
                            'gable-end': 'Gable end',
                            'barge-end': 'Barge end'
                        },
                        overallConditions: {
                            'good': {
                                title: 'Good',
                                description: 'Roof barge/gable end appears to be in a good condition throughout the roof line. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof ends to be of concern.'
                            },
                            'satisfactory': {
                                title: 'Satisfactory',
                                description: 'Roof ridging appears to be in a satisfactory condition. There are no obvious signs of wear and tear, moss and mold, and/or damage to the roof tiling to be of concern.'
                            },
                            'average-moss': {
                                title: 'Average (moss present)',
                                description: 'Roof barge/gable end condition appears to be in an average condition with visible moss & mold present. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this can cause damage to your tiled roof. We advise roof moss removal treatments and follow ups every year to ensure your roof condition is well maintained.'
                            },
                            'average-cracking': {
                                title: 'Average (minor cracking in mortar)',
                                description: 'Roof barge/gable end appears to be in an average condition with minor cracking visible in the mortar seating the roof barge/gable end. We recommend getting a full flexi point RE-POINT. This will help restore the life back into your concrete roof ridgelines, hips and barge capping (if applicable) and assure you of your roofline capping being secured like new again.'
                            },
                            'average-combination': {
                                title: 'Average (cracking and moss present combination)',
                                description: 'Roof barge/gable end appears to be in an average condition with moss and mold present and the minor cracking visible in the mortar seating the roof barge/gable end. We recommend getting a full flexi point RE-POINT. This will help restore the life back into your concrete roof ridgelines, hips and barge capping (if applicable) and assure you of your roofline capping being secured like new again. We also recommend a moss and mold treatment.'
                            }
                        },
                        specificConcerns: {
                            'additional': {
                                title: 'Additional',
                                description: 'Additional concern not covered by standard categories.',
                                fields: [
                                    { name: 'subject', type: 'text', label: 'Subject', required: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation', required: true },
                                    { name: 'photo', type: 'file', label: 'Photo' }
                                ]
                            }
                        }
                    }
                }
            },
            'hacienda': { name: 'Hacienda Roof Tile', sections: {} },
            'elabana': { name: 'Elabana Roof Tile', sections: {} },
            'centurion': { name: 'Centurion Roof Tile', sections: {} },
            'winston-concave': { name: 'Winstn Concave', sections: {} },
            'dovetail': { name: 'Dovetal Roof Tile', sections: {} },
            'unknown': { name: 'Unknown', sections: {} },
            'other': { name: 'Other', sections: {} }
        }
    },
    'clay-tile': {
        name: 'Clay Tile',
        subTypes: {
            'winston-auckland': { name: 'Winston Auckland Clay Tile', sections: {} },
            'spanish-clay': { name: 'Spanish Clay Roof Tile', sections: {} },
            'unknown': { name: 'Unknown', sections: {} },
            'other': { name: 'Other', sections: {} }
        }
    },
    'asbestos': {
        name: 'Asbestos',
        requiresReplacement: true
    },
    'flat-roof': {
        name: 'Flat Roof',
        subTypes: {
            'liquid-membrane': { name: 'Liquid Membrane', sections: {} },
            'torch-on-membrane': { name: 'Torch on Membrane', sections: {} },
            'tpo': { name: 'TPO', sections: {} },
            'epdm': { name: 'EPDM', sections: {} },
            'butynol': { name: 'Butynol', sections: {} }
        }
    }
};

// DOM elements
const form = document.getElementById('roofReportForm');
const reportOutput = document.getElementById('reportOutput');
const reportContent = document.getElementById('reportContent');
const clearFormBtn = document.getElementById('clearForm');
const printReportBtn = document.getElementById('printReport');
const exportPDFBtn = document.getElementById('exportPDF');

// Main cascading dropdown functionality
function setupCascadingDropdowns() {
    const roofTypeSelect = document.getElementById('roofType');
    const subTypeGroup = document.getElementById('subTypeGroup');
    const subTypeSelect = document.getElementById('subType');
    const asbestosMessage = document.getElementById('asbestosMessage');
    const sectionGroup = document.getElementById('sectionGroup');
    const sectionSelect = document.getElementById('section');
    const overallConditionGroup = document.getElementById('overallConditionGroup');
    const overallConditionSelect = document.getElementById('overallCondition');
    const specificConcernsGroup = document.getElementById('specificConcernsGroup');
    const specificConcernsSelect = document.getElementById('specificConcerns');
    const conditionPhotoGroup = document.getElementById('conditionPhotoGroup');
    const concernDetailsSection = document.getElementById('concernDetailsSection');
    const additionalItemsSection = document.getElementById('additionalItemsSection');

    // Step 1: Roof Type Selection
    roofTypeSelect.addEventListener('change', function() {
        const selectedRoofType = this.value;
        
        // Reset all subsequent dropdowns and sections
        subTypeSelect.innerHTML = '<option value="">Select sub type...</option>';
        sectionSelect.innerHTML = '<option value="">Select section...</option>';
        overallConditionSelect.innerHTML = '<option value="">Select overall condition...</option>';
        specificConcernsSelect.innerHTML = '';
        subTypeGroup.style.display = 'none';
        asbestosMessage.style.display = 'none';
        sectionGroup.style.display = 'none';
        overallConditionGroup.style.display = 'none';
        specificConcernsGroup.style.display = 'none';
        conditionPhotoGroup.style.display = 'none';
        concernDetailsSection.style.display = 'none';
        additionalItemsSection.style.display = 'none';
        
        if (selectedRoofType && roofData[selectedRoofType]) {
            const roofTypeData = roofData[selectedRoofType];
            
            // Special handling for Asbestos
            if (selectedRoofType === 'asbestos') {
                asbestosMessage.style.display = 'block';
                return;
            }
            
            // Populate sub-types
            if (roofTypeData.subTypes) {
                Object.keys(roofTypeData.subTypes).forEach(subTypeKey => {
                    const option = document.createElement('option');
                    option.value = subTypeKey;
                    option.textContent = roofTypeData.subTypes[subTypeKey].name;
                    subTypeSelect.appendChild(option);
                });
                
                subTypeGroup.style.display = 'block';
            }
        }
    });

    // Step 2: Sub-type Selection
    subTypeSelect.addEventListener('change', function() {
        const selectedSubType = this.value;
        const selectedRoofType = roofTypeSelect.value;
        
        // Reset subsequent dropdowns and sections
        sectionSelect.innerHTML = '<option value="">Select section...</option>';
        overallConditionSelect.innerHTML = '<option value="">Select overall condition...</option>';
        specificConcernsSelect.innerHTML = '';
        sectionGroup.style.display = 'none';
        overallConditionGroup.style.display = 'none';
        specificConcernsGroup.style.display = 'none';
        conditionPhotoGroup.style.display = 'none';
        concernDetailsSection.style.display = 'none';
        
        if (selectedSubType && selectedRoofType && roofData[selectedRoofType].subTypes[selectedSubType]) {
            const subTypeData = roofData[selectedRoofType].subTypes[selectedSubType];
            
            // Populate sections
            if (subTypeData.sections && Object.keys(subTypeData.sections).length > 0) {
                Object.keys(subTypeData.sections).forEach(sectionKey => {
                    const option = document.createElement('option');
                    option.value = sectionKey;
                    option.textContent = subTypeData.sections[sectionKey].title;
                    sectionSelect.appendChild(option);
                });
                sectionGroup.style.display = 'block';
            }
        }
    });

    // Step 3: Section Selection
    sectionSelect.addEventListener('change', function() {
        const selectedSection = this.value;
        const selectedRoofType = roofTypeSelect.value;
        const selectedSubType = subTypeSelect.value;
        
        // Reset subsequent dropdowns and sections
        overallConditionSelect.innerHTML = '<option value="">Select overall condition...</option>';
        specificConcernsSelect.innerHTML = '';
        overallConditionGroup.style.display = 'none';
        specificConcernsGroup.style.display = 'none';
        conditionPhotoGroup.style.display = 'none';
        concernDetailsSection.style.display = 'none';
        
        if (selectedSection && selectedRoofType && selectedSubType && 
            roofData[selectedRoofType].subTypes[selectedSubType].sections[selectedSection]) {
            const sectionData = roofData[selectedRoofType].subTypes[selectedSubType].sections[selectedSection];
            
            // Populate overall conditions
            if (sectionData.overallConditions) {
                Object.keys(sectionData.overallConditions).forEach(conditionKey => {
                    const option = document.createElement('option');
                    option.value = conditionKey;
                    option.textContent = sectionData.overallConditions[conditionKey].title;
                    overallConditionSelect.appendChild(option);
                });
                overallConditionGroup.style.display = 'block';
            }
        }
    });

    // Step 4: Overall Condition Selection
    overallConditionSelect.addEventListener('change', function() {
        const selectedCondition = this.value;
        const selectedRoofType = roofTypeSelect.value;
        const selectedSubType = subTypeSelect.value;
        const selectedSection = sectionSelect.value;
        
        // Reset subsequent sections
        specificConcernsSelect.innerHTML = '';
        specificConcernsGroup.style.display = 'none';
        conditionPhotoGroup.style.display = 'none';
        concernDetailsSection.style.display = 'none';
        
        if (selectedCondition && selectedRoofType && selectedSubType && selectedSection && 
            roofData[selectedRoofType].subTypes[selectedSubType].sections[selectedSection]) {
            
            const sectionData = roofData[selectedRoofType].subTypes[selectedSubType].sections[selectedSection];
            
            // Show photo upload if condition requires it (not good or satisfactory)
            if (!selectedCondition.includes('good') && selectedCondition !== 'satisfactory') {
                conditionPhotoGroup.style.display = 'block';
            }
            
            // Populate specific concerns
            if (sectionData.specificConcerns) {
                Object.keys(sectionData.specificConcerns).forEach(concernKey => {
                    const option = document.createElement('option');
                    option.value = concernKey;
                    option.textContent = sectionData.specificConcerns[concernKey].title;
                    specificConcernsSelect.appendChild(option);
                });
                specificConcernsGroup.style.display = 'block';
            }
            
            additionalItemsSection.style.display = 'block';
        }
    });

    // Step 5: Specific Concerns Selection
    specificConcernsSelect.addEventListener('change', function() {
        const selectedConcerns = Array.from(this.selectedOptions).map(option => option.value);
        const selectedRoofType = roofTypeSelect.value;
        const selectedSubType = subTypeSelect.value;
        const selectedSection = sectionSelect.value;
        
        if (selectedConcerns.length > 0 && selectedRoofType && selectedSubType && selectedSection && 
            roofData[selectedRoofType].subTypes[selectedSubType].sections[selectedSection]) {
            
            generateConcernDetails(selectedRoofType, selectedSubType, selectedSection, selectedConcerns);
            concernDetailsSection.style.display = 'block';
        } else {
            concernDetailsSection.style.display = 'none';
        }
    });
}

// Generate dynamic concern detail forms
function generateConcernDetails(roofType, subType, sectionType, selectedConcerns) {
    const concernDetailsContent = document.getElementById('concernDetailsContent');
    concernDetailsContent.innerHTML = '';
    
    const concerns = roofData[roofType].subTypes[subType].sections[sectionType].specificConcerns;
    
    selectedConcerns.forEach(concernKey => {
        if (concerns[concernKey]) {
            const concern = concerns[concernKey];
            const concernDiv = document.createElement('div');
            concernDiv.className = 'concern-section';
            concernDiv.innerHTML = `
                <h4>${concern.title}</h4>
                <div class="concern-content">
                    <p class="concern-description">${concern.description}</p>
                    <div id="${concernKey}-fields">
                        <!-- Dynamic fields will be inserted here -->
                    </div>
                </div>
            `;
            
            concernDetailsContent.appendChild(concernDiv);
            
            // Generate fields for this concern
            if (concern.fields) {
                const fieldsContainer = document.getElementById(`${concernKey}-fields`);
                generateConcernFields(fieldsContainer, concernKey, concern.fields);
            }
        }
    });
}

// Generate form fields for a specific concern
function generateConcernFields(container, concernKey, fields) {
    const formRow = document.createElement('div');
    formRow.className = 'form-row';
    
    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = field.label + ':';
        label.setAttribute('for', `${concernKey}-${field.name}`);
        
        let input;
        switch (field.type) {
            case 'file':
                input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                if (field.multiple) input.multiple = true;
                if (field.required) input.required = true;
                break;
            case 'textarea':
                input = document.createElement('textarea');
                input.rows = 3;
                input.placeholder = `Enter ${field.label.toLowerCase()}...`;
                if (field.required) input.required = true;
                break;
            case 'number':
                input = document.createElement('input');
                input.type = 'number';
                input.min = field.min || 0.1;
                if (field.step) input.step = field.step;
                input.placeholder = `Enter ${field.label.toLowerCase()}...`;
                if (field.required) input.required = true;
                break;
            default: // text
                input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Enter ${field.label.toLowerCase()}...`;
                if (field.required) input.required = true;
        }
        
        input.id = `${concernKey}-${field.name}`;
        input.name = `${concernKey}-${field.name}`;
        
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        
        if (field.type === 'file') {
            const small = document.createElement('small');
            small.textContent = field.multiple ? 'Upload multiple photos' : 'Upload photo';
            formGroup.appendChild(small);
        }
        
        formRow.appendChild(formGroup);
    });
    
    container.appendChild(formRow);
}

// Setup additional roofing items functionality
function setupAdditionalItems() {
    const addButton = document.getElementById('addAdditionalItem');
    const container = document.getElementById('additionalItemsContainer');
    
    if (!addButton || !container) return;
    
    let itemCounter = 0;
    
    addButton.addEventListener('click', function() {
        addAdditionalItemCard(container, itemCounter++);
    });
}

// Add a new additional item card
function addAdditionalItemCard(container, index) {
    const itemCard = document.createElement('div');
    itemCard.className = 'additional-item-card';
    itemCard.innerHTML = `
        <button type="button" class="remove-additional-item" onclick="removeAdditionalItem(this)">×</button>
        <div class="form-row">
            <div class="form-group">
                <label for="additionalItem_${index}_type">Select Additional Item:</label>
                <select id="additionalItem_${index}_type" name="additionalItem_${index}_type" onchange="toggleSubjectField(this, ${index})">
                    <option value="">Select an item...</option>
                    <option value="solar-heating">Solar Heating</option>
                    <option value="solar-power">Solar Power</option>
                    <option value="walking-bridge">Walking Bridge/s</option>
                    <option value="air-conditioning">Air Conditioning Units</option>
                    <option value="monkey-toes">Monkey Toes</option>
                    <option value="ventilated-ridging">Ventilated Ridging</option>
                    <option value="ventilation-units">Ventilation Units</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
        <div class="form-row" id="subjectGroup_${index}" style="display: none;">
            <div class="form-group">
                <label for="additionalItem_${index}_subject">Subject:</label>
                <input type="text" id="additionalItem_${index}_subject" name="additionalItem_${index}_subject" placeholder="Specify the item...">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="additionalItem_${index}_quantity">Quantity (1-100):</label>
                <input type="number" id="additionalItem_${index}_quantity" name="additionalItem_${index}_quantity" min="1" max="100" placeholder="Enter quantity...">
            </div>
            <div class="form-group">
                <label for="additionalItem_${index}_photo">Photo:</label>
                <input type="file" id="additionalItem_${index}_photo" name="additionalItem_${index}_photo" accept="image/*">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="additionalItem_${index}_comments">Comments/Explanation:</label>
                <textarea id="additionalItem_${index}_comments" name="additionalItem_${index}_comments" rows="3" placeholder="Add your comments and explanation here..."></textarea>
            </div>
        </div>
    `;
    
    container.appendChild(itemCard);
}

// Remove additional item card
function removeAdditionalItem(button) {
    const card = button.closest('.additional-item-card');
    if (card) {
        card.remove();
    }
}

// Toggle subject field for "Other" option
function toggleSubjectField(selectElement, index) {
    const subjectGroup = document.getElementById(`subjectGroup_${index}`);
    const subjectInput = document.getElementById(`additionalItem_${index}_subject`);
    
    if (selectElement.value === 'other') {
        subjectGroup.style.display = 'block';
    } else {
        subjectGroup.style.display = 'none';
        if (subjectInput) subjectInput.value = '';
    }
}

// Clear all additional item fields
function clearAllAdditionalItems() {
    const container = document.getElementById('additionalItemsContainer');
    if (container) {
        container.innerHTML = '';
    }
}

// Setup section restoration functionality
function setupSectionRestoration() {
    const showRestoreBtn = document.getElementById('showRestoreOptions');
    const hideRestoreBtn = document.getElementById('hideRestoreOptions');
    const restoreContainer = document.getElementById('restoreSectionsContainer');
    
    if (showRestoreBtn) {
        showRestoreBtn.addEventListener('click', function() {
            restoreContainer.style.display = 'block';
            showRestoreBtn.style.display = 'none';
        });
    }
    
    if (hideRestoreBtn) {
        hideRestoreBtn.addEventListener('click', function() {
            restoreContainer.style.display = 'none';
            document.getElementById('showRestoreOptions').style.display = 'inline-block';
        });
    }
}

// Update restore options when sections are removed
function updateRestoreOptions() {
    const showRestoreBtn = document.getElementById('showRestoreOptions');
    const removedSectionsList = document.getElementById('removedSectionsList');
    const restoreContainer = document.getElementById('restoreSectionsContainer');

    // Check if elements exist (they may not be in the HTML)
    if (!showRestoreBtn || !removedSectionsList) {
        return; // Elements don't exist, skip this function
    }

    if (removedSections.length > 0) {
        // Show the restore button
        showRestoreBtn.style.display = 'inline-block';

        // Clear and rebuild the removed sections list
        removedSectionsList.innerHTML = '';

        removedSections.forEach(section => {
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'restore-section-btn';
            restoreBtn.textContent = `Restore: ${section.title}`;
            restoreBtn.addEventListener('click', function() {
                restoreSection(section.id, section.title);
            });
            removedSectionsList.appendChild(restoreBtn);
        });
    } else {
        // Hide the restore button if no sections are removed
        showRestoreBtn.style.display = 'none';
        if (restoreContainer) {
            restoreContainer.style.display = 'none';
        }
    }
}

// Restore a specific section
function restoreSection(sectionId, sectionTitle) {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        // Show the section
        sectionElement.style.display = 'block';
        
        // Reset section state
        sectionElement.setAttribute('data-disabled', 'false');
        const cardContent = sectionElement.querySelector('.card-content');
        if (cardContent) {
            cardContent.style.opacity = '1';
            cardContent.style.pointerEvents = 'auto';
        }
        
        // Reset applicable toggles to checked
        const applicableToggle = sectionElement.querySelector('.applicable-toggle input[type="checkbox"]');
        if (applicableToggle) {
            applicableToggle.checked = true;
        }
        
        // Remove from removed sections tracking
        removedSections = removedSections.filter(section => section.id !== sectionId);
        
        // Update restore options
        updateRestoreOptions();
    }
}

// Setup spouting and downpipe cascading dropdowns
function setupSpoutingDownpipeDropdowns() {
    const spoutingTypeSelect = document.getElementById('spoutingType');
    const spoutingSubTypeSelect = document.getElementById('spoutingSubType');
    const spoutingSubTypeGroup = document.getElementById('spoutingSubTypeGroup');
    
    const downpipeTypeSelect = document.getElementById('downpipeType');
    const downpipeSubTypeSelect = document.getElementById('downpipeSubType');
    const downpipeSubTypeGroup = document.getElementById('downpipeSubTypeGroup');
    
    // Spouting type data structure - varies by roof type
    const spoutingOptionsByRoofType = {
        'compressed-metal-tile': {
            'pvc': [
                { value: 'marley-stormcloud', text: 'Marley Stormcloud Profile' },
                { value: 'marley-classic', text: 'Marley Classic Profile' }
            ],
            'metal': [
                { value: 'quad-metal', text: 'Quad Metal Gutter' },
                { value: 'half-round-metal', text: 'Half Round Metal Gutter' },
                { value: 'box-metal', text: 'Box Metal Gutter' }
            ],
            'facia-internal-plastic': [
                { value: 'taylor-plastic', text: 'Taylor fascia/Plastic internal gutter' },
                { value: 'taylor-metal', text: 'Taylor fascia/Metal internal gutter' }
            ],
            'facia-internal-metal': [
                { value: 'taylor-metal-internal', text: 'Taylor fascia/Metal internal gutter' }
            ]
        },
        // Tile roof types (concrete-tile and clay-tile)
        'tile': {
            'pvc': [
                { value: 'marley-stormcloud', text: 'Marley Stormcloud Profile' },
                { value: 'marley-classic', text: 'Marley Classic Profile' }
            ],
            'metal': [
                { value: 'quad-metal', text: 'Quad Metal Gutter' },
                { value: 'half-round-metal', text: 'Half Round Metal Gutter' },
                { value: 'box-metal', text: 'Box Metal Gutter' }
            ],
            'asbestos': [],
            'facia-internal-plastic': [
                { value: 'taylor-plastic', text: 'Taylor fascia/Plastic internal gutter' },
                { value: 'taylor-metal', text: 'Taylor fascia/Metal internal gutter' }
            ],
            'facia-internal-metal': [
                { value: 'taylor-metal-internal', text: 'Taylor fascia/Metal internal gutter' }
            ]
        },
        // Default options for other roof types
        'default': {
            'pvc': [
                { value: 'marley-stormcloud', text: 'Marley Stormcloud Profile' },
                { value: 'marley-classic', text: 'Marley Classic Profile' }
            ],
            'metal': [
                { value: 'quad-metal', text: 'Quad Metal Gutter' },
                { value: 'half-round-metal', text: 'Half Round Metal Gutter' },
                { value: 'box-metal', text: 'Box Metal Gutter' }
            ],
            'pvc-internal': [
                { value: 'pvc-internal-option', text: 'PVC Internal' }
            ],
            'gutters-metal-internal': [
                { value: 'gutters-metal-internal-option', text: 'Gutters Metal Internal' }
            ]
        }
    };
    
    // Bracket type options for spouting
    const spoutingBracketOptions = {
        'pvc': [
            { value: 'external-brackets', text: 'External brackets' },
            { value: 'internal-brackets', text: 'Internal brackets' }
        ],
        'metal': [
            { value: 'external-brackets', text: 'External brackets' },
            { value: 'internal-brackets', text: 'Internal brackets' },
            { value: 'toe-brackets', text: 'Toe brackets' }
        ]
    };
    
    // Downpipe type data structure
    const downpipeOptions = {
        'pvc': [
            { value: '65mm', text: '65mm' },
            { value: '80mm', text: '80mm' },
            { value: '100mm', text: '100mm' },
            { value: 'square', text: 'Square' },
            { value: 'rectangle', text: 'Rectangle' },
            { value: 'other', text: 'Other' }
        ],
        'metal': [
            { value: '80mm', text: '80mm' },
            { value: 'square', text: 'Square' },
            { value: 'rectangle', text: 'Rectangle' },
            { value: 'other', text: 'Other' }
        ]
    };
    
    // Overall condition options for different spouting types
    const spoutingConditionOptions = {
        'pvc': [
            { value: 'good-like-new', text: 'Good like new' },
            { value: 'satisfactory', text: 'Satisfactory' },
            { value: 'average-debris', text: 'Average (debris present)' },
            { value: 'average-holding-water', text: 'Average (holding water)' },
            { value: 'average-combination', text: 'Average combination debris and holding water' },
            { value: 'poor-replacement', text: 'Poor replacement- damaged/brittle/missing spouting' },
            { value: 'poor-repairable', text: 'Poor repairable condition' },
            { value: 'poor-heavy-debris', text: 'Poor (heavy debris present)' }
        ],
        'metal': [
            { value: 'good-like-new', text: 'Good like new' },
            { value: 'satisfactory', text: 'Satisfactory' },
            { value: 'average-debris', text: 'Average (debris present)' },
            { value: 'average-rust', text: 'Average (minor rust present)' },
            { value: 'average-holding-water', text: 'Average (holding water)' },
            { value: 'average-combination', text: 'Average combination debris and holding water' },
            { value: 'poor-replacement', text: 'Poor replacement- damaged,heavy rust, missing spouting' },
            { value: 'poor-repairable', text: 'Poor repairable condition' },
            { value: 'poor-heavy-debris', text: 'Poor (heavy debris present)' }
        ],
        'facia-internal-plastic': [
            { value: 'good-like-new', text: 'Good like new' },
            { value: 'satisfactory', text: 'Satisfactory' },
            { value: 'average-debris', text: 'Average (debris present)' },
            { value: 'average-holding-water', text: 'Average (holding water)' },
            { value: 'average-combination', text: 'Average combination debris and holding water' },
            { value: 'poor-replacement', text: 'Poor replacement- damaged/brittle/missing spouting' },
            { value: 'poor-repairable', text: 'Poor repairable condition' },
            { value: 'poor-heavy-debris', text: 'Poor (heavy debris present)' }
        ],
        'facia-internal-metal': [
            { value: 'good-like-new', text: 'Good like new' },
            { value: 'satisfactory', text: 'Satisfactory' },
            { value: 'average-debris', text: 'Average (debris present)' },
            { value: 'average-rust', text: 'Average (minor rust present)' },
            { value: 'average-holding-water', text: 'Average (holding water)' },
            { value: 'average-combination', text: 'Average combination debris and holding water' },
            { value: 'poor-replacement', text: 'Poor replacement- damaged,heavy rust, missing spouting' },
            { value: 'poor-repairable', text: 'Poor repairable condition' },
            { value: 'poor-heavy-debris', text: 'Poor (heavy debris present)' }
        ],
        'pvc-internal': [
            { value: 'good-like-new', text: 'Good like new' },
            { value: 'satisfactory', text: 'Satisfactory' },
            { value: 'average-debris', text: 'Average (debris present)' },
            { value: 'average-holding-water', text: 'Average (holding water)' },
            { value: 'average-combination', text: 'Average combination debris and holding water' },
            { value: 'poor-replacement', text: 'Poor replacement- damaged/missing spouting' },
            { value: 'poor-repairable', text: 'Poor repairable condition' },
            { value: 'poor-heavy-debris', text: 'Poor (heavy debris present)' }
        ],
        'gutters-metal-internal': [
            { value: 'good-like-new', text: 'Good like new' },
            { value: 'satisfactory', text: 'Satisfactory' },
            { value: 'average-debris', text: 'Average (debris present)' },
            { value: 'average-rust', text: 'Average (minor rust present)' },
            { value: 'average-holding-water', text: 'Average (holding water)' },
            { value: 'average-combination', text: 'Average combination debris and holding water' },
            { value: 'poor-replacement', text: 'Poor replacement- damaged,heavy rust, missing spouting' },
            { value: 'poor-repairable', text: 'Poor repairable condition' },
            { value: 'poor-heavy-debris', text: 'Poor (heavy debris present)' }
        ],
        'asbestos': [
            { value: 'asbestos-replacement', text: 'Contains asbestos. Please enquire for a replacement' }
        ]
    };

    // Function to populate spouting type options based on roof type
    function populateSpoutingTypeOptions() {
        const roofType = document.getElementById('roofType').value;
        
        // Clear existing options
        spoutingTypeSelect.innerHTML = '<option value="">Select spouting type...</option>';
        
        // Define spouting type options for each roof type
        let spoutingTypeOptions = [];
        
        if (roofType === 'compressed-metal-tile') {
            spoutingTypeOptions = [
                { value: 'pvc', text: 'PVC' },
                { value: 'metal', text: 'Metal' },
                { value: 'facia-internal-plastic', text: 'Facia Internal Gutter Plastic Internal' },
                { value: 'facia-internal-metal', text: 'Facia Internal Gutters Metal Internal' }
            ];
        } else if (roofType === 'concrete-tile' || roofType === 'clay-tile') {
            // Tile roof types
            spoutingTypeOptions = [
                { value: 'pvc', text: 'PVC' },
                { value: 'metal', text: 'Metal' },
                { value: 'asbestos', text: 'Asbestos' },
                { value: 'facia-internal-plastic', text: 'Facia Internal Gutter Plastic Internal' },
                { value: 'facia-internal-metal', text: 'Facia Internal Gutters Metal Internal' }
            ];
        } else {
            // Default options for other roof types
            spoutingTypeOptions = [
                { value: 'pvc', text: 'PVC' },
                { value: 'metal', text: 'Metal' },
                { value: 'pvc-internal', text: 'PVC Internal' },
                { value: 'gutters-metal-internal', text: 'Gutters Metal Internal' }
            ];
        }
        
        // Populate the spouting type dropdown
        spoutingTypeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            spoutingTypeSelect.appendChild(optionElement);
        });
    }

    // Handle spouting type change
    if (spoutingTypeSelect) {
        spoutingTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            const roofType = document.getElementById('roofType').value;
            const spoutingConditionSelect = document.getElementById('spoutingCondition');
            const bracketTypeRow = document.getElementById('bracketTypeRow');
            const spoutingBracketGroup = document.getElementById('spoutingBracketGroup');
            const spoutingBracketSelect = document.getElementById('spoutingBracketType');
            
            // Get appropriate spouting options based on roof type
            let dataRoofType = roofType;
            if (roofType === 'concrete-tile' || roofType === 'clay-tile') {
                dataRoofType = 'tile';
            }
            const spoutingOptions = spoutingOptionsByRoofType[dataRoofType] || spoutingOptionsByRoofType['default'];
            
            // Handle asbestos special case
            if (selectedType === 'asbestos') {
                // Hide all other options and show asbestos message
                spoutingSubTypeGroup.style.display = 'none';
                bracketTypeRow.style.display = 'none';
                spoutingBracketGroup.style.display = 'none';
                
                // Show asbestos-specific condition
                if (spoutingConditionSelect) {
                    spoutingConditionSelect.innerHTML = '<option value="">Select condition...</option>';
                    const asbestosOption = document.createElement('option');
                    asbestosOption.value = 'asbestos-replacement';
                    asbestosOption.textContent = 'Contains asbestos. Please enquire for a replacement';
                    spoutingConditionSelect.appendChild(asbestosOption);
                }
                return;
            }
            
            if (selectedType && spoutingOptions[selectedType]) {
                // Show sub-type dropdown
                spoutingSubTypeGroup.style.display = 'block';
                
                // Populate sub-type options
                spoutingSubTypeSelect.innerHTML = '<option value="">Select sub type...</option>';
                spoutingOptions[selectedType].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    spoutingSubTypeSelect.appendChild(optionElement);
                });
                
                // Show bracket types for PVC and Metal on tile and compressed metal tile roofs
                if ((roofType === 'compressed-metal-tile' || roofType === 'concrete-tile' || roofType === 'clay-tile') && 
                    (selectedType === 'pvc' || selectedType === 'metal')) {
                    bracketTypeRow.style.display = 'block';
                    spoutingBracketGroup.style.display = 'block';
                    
                    // Populate spouting bracket options
                    if (spoutingBracketOptions[selectedType]) {
                        spoutingBracketSelect.innerHTML = '<option value="">Select bracket type...</option>';
                        spoutingBracketOptions[selectedType].forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.textContent = option.text;
                            spoutingBracketSelect.appendChild(optionElement);
                        });
                    }
                } else {
                    spoutingBracketGroup.style.display = 'none';
                }
                
                // Populate overall condition options based on spouting type
                if (spoutingConditionSelect && spoutingConditionOptions[selectedType]) {
                    spoutingConditionSelect.innerHTML = '<option value="">Select condition...</option>';
                    spoutingConditionOptions[selectedType].forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        spoutingConditionSelect.appendChild(optionElement);
                    });
                }
            } else {
                // Hide sub-type dropdown
                spoutingSubTypeGroup.style.display = 'none';
                spoutingSubTypeSelect.innerHTML = '<option value="">Select sub type...</option>';
                
                // Hide bracket options
                spoutingBracketGroup.style.display = 'none';
                
                // Reset overall condition dropdown
                if (spoutingConditionSelect) {
                    spoutingConditionSelect.innerHTML = '<option value="">Select condition...</option>';
                }
            }
        });
    }
    
    // Make the populate function available globally so it can be called when roof type changes
    window.populateSpoutingTypeOptions = populateSpoutingTypeOptions;
    
    // Handle downpipe type change
    if (downpipeTypeSelect) {
        downpipeTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            const roofType = document.getElementById('roofType').value;
            const bracketTypeRow = document.getElementById('bracketTypeRow');
            const downpipeBracketGroup = document.getElementById('downpipeBracketGroup');
            
            if (selectedType && downpipeOptions[selectedType]) {
                // Show sub-type dropdown
                downpipeSubTypeGroup.style.display = 'block';
                
                // Populate sub-type options
                downpipeSubTypeSelect.innerHTML = '<option value="">Select sub type...</option>';
                downpipeOptions[selectedType].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    downpipeSubTypeSelect.appendChild(optionElement);
                });
                
                // Show downpipe bracket types for tile and compressed metal tile roofs
                if (roofType === 'compressed-metal-tile' || roofType === 'concrete-tile' || roofType === 'clay-tile') {
                    bracketTypeRow.style.display = 'block';
                    downpipeBracketGroup.style.display = 'block';
                } else {
                    downpipeBracketGroup.style.display = 'none';
                }
            } else {
                // Hide sub-type dropdown
                downpipeSubTypeGroup.style.display = 'none';
                downpipeSubTypeSelect.innerHTML = '<option value="">Select sub type...</option>';
                
                // Hide bracket options
                downpipeBracketGroup.style.display = 'none';
            }
        });
    }
}

// Get condition class for styling
function getConditionClass(condition) {
    if (condition.includes('good') || condition.includes('satisfactory')) {
        return 'condition-good';
    } else if (condition.includes('average')) {
        return 'condition-average';
    } else if (condition.includes('poor')) {
        return 'condition-poor';
    }
    return '';
}

printReportBtn.addEventListener('click', function() {
    window.print();
});

exportPDFBtn.addEventListener('click', function() {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;

    const addressValue = document.getElementById('propertyAddress').value.trim();
    const refValue = document.getElementById('reportRef').value.trim();
    const safeAddress = (addressValue || 'Roof-Report').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
    const filename = `${safeAddress}${refValue ? '-' + refValue : ''}.pdf`;

    const originalText = exportPDFBtn.textContent;
    exportPDFBtn.disabled = true;
    exportPDFBtn.textContent = 'Generating PDF…';

    // html2canvas captures relative to the current scroll position and gets
    // it wrong (blank output) unless the page is scrolled to the top first.
    const scrollBefore = window.scrollY;
    window.scrollTo(0, 0);

    html2pdf()
        .set({
            margin: 10,
            filename,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(reportContent)
        .save()
        .catch(function(err) {
            console.error(err);
            alert('Could not generate the PDF. Please try again, or use Print Report instead.');
        })
        .finally(function() {
            window.scrollTo(0, scrollBefore);
            exportPDFBtn.disabled = false;
            exportPDFBtn.textContent = originalText;
        });
});

// Main application initialization function
function initializeRoofReportApp() {
    setupRoofTypeHandler();
    setupGutterOnlyToggle();
    setupSectionRemovalButtons();
    setupApplicabilityToggles();
    setupAdditionalItems();
    setupFormSubmission();
    setupSectionRestoration();
    setupSpoutingDownpipeDropdowns();
    setupGutterConcernsSection();
}

// Setup Gutter Concerns section interactivity
function setupGutterConcernsSection() {
    // Show/hide gutter details when Yes/No is selected
    const gutterIssueYes = document.getElementById('gutterIssueYes');
    const gutterIssueNo = document.getElementById('gutterIssueNo');
    const gutterDetails = document.getElementById('gutterDetails');

    if (gutterIssueYes) {
        gutterIssueYes.addEventListener('change', function() {
            if (this.checked) gutterDetails.style.display = 'block';
        });
    }
    if (gutterIssueNo) {
        gutterIssueNo.addEventListener('change', function() {
            if (this.checked) gutterDetails.style.display = 'none';
        });
    }

    // Wire each damage type checkbox to show/hide its detail fields
    const damageCheckboxIds = [
        'gutterDamage_leakingJoins',
        'gutterDamage_alignmentIssues',
        'gutterDamage_rustHoles',
        'gutterDamage_crackedBroken',
        'gutterDamage_missingSections',
        'gutterDamage_brittle',
        'gutterDamage_insufficientDownpipes'
    ];

    damageCheckboxIds.forEach(id => {
        const checkbox = document.getElementById(id);
        const details = document.getElementById(`${id}_details`);
        if (checkbox && details) {
            checkbox.addEventListener('change', function() {
                details.style.display = this.checked ? 'block' : 'none';
                if (!this.checked) {
                    details.querySelectorAll('input, textarea').forEach(inp => {
                        if (inp.type === 'radio' || inp.type === 'checkbox') {
                            inp.checked = false;
                        } else {
                            inp.value = '';
                        }
                    });
                }
            });
        }
    });
}

// Setup roof type selection handler
function setupRoofTypeHandler() {
    const roofTypeSelect = document.getElementById('roofType');
    const subTypeGroup = document.getElementById('subTypeGroup');
    const subTypeSelect = document.getElementById('subType');
    const asbestosMessage = document.getElementById('asbestosMessage');
    const sectionsContainer = document.getElementById('roofSectionsContainer');

    roofTypeSelect.addEventListener('change', function() {
        const selectedRoofType = this.value;

        // Reset sub-type dropdown and hide sections initially
        subTypeSelect.innerHTML = '<option value="">Select sub type...</option>';
        subTypeGroup.style.display = 'none';
        sectionsContainer.style.display = 'none';
        asbestosMessage.style.display = 'none';

        // Handle asbestos special case
        if (selectedRoofType === 'asbestos') {
            asbestosMessage.style.display = 'block';
            return;
        }

        if (selectedRoofType && roofData[selectedRoofType]) {
            // Populate sub-types
            const subTypes = roofData[selectedRoofType].subTypes;
            
            Object.keys(subTypes).forEach(subTypeKey => {
                const option = document.createElement('option');
                option.value = subTypeKey;
                option.textContent = subTypes[subTypeKey].name;
                subTypeSelect.appendChild(option);
            });
            
            subTypeGroup.style.display = 'block';
        }
    });

    subTypeSelect.addEventListener('change', function() {
        const selectedRoofType = roofTypeSelect.value;
        const selectedSubType = this.value;
        const sectionsContainer = document.getElementById('roofSectionsContainer');

        if (selectedRoofType && selectedSubType && roofData[selectedRoofType]?.subTypes[selectedSubType]) {
            // Show sections container
            sectionsContainer.style.display = 'block';

            // Populate the single specific concerns section
            populateSpecificConcernsSection(selectedRoofType, selectedSubType);
        } else {
            sectionsContainer.style.display = 'none';
        }
    });
}

// Setup Gutter Only toggle: swaps Roof Details (+ its roof-type-driven
// Specific Concerns) for the mirrored Gutter Details section. The existing
// Gutter Concerns section stays reachable either way.
function setupGutterOnlyToggle() {
    const toggle = document.getElementById('gutterOnlyToggle');
    const roofDetailsSection = document.getElementById('roofDetailsSection');
    const gutterDetailsSection = document.getElementById('gutterDetailsSection');
    const specificConcernsSection = document.getElementById('specificConcernsSection');
    const sectionsContainer = document.getElementById('roofSectionsContainer');
    const asbestosMessage = document.getElementById('asbestosMessage');
    const roofTypeSelect = document.getElementById('roofType');
    const subTypeSelect = document.getElementById('subType');

    const roofRequiredFields = Array.from(roofDetailsSection.querySelectorAll('[required]'));
    const gutterRequiredFields = Array.from(gutterDetailsSection.querySelectorAll('[required]'));

    function applyState(isGutterOnly) {
        roofDetailsSection.style.display = isGutterOnly ? 'none' : '';
        gutterDetailsSection.style.display = isGutterOnly ? '' : 'none';
        specificConcernsSection.style.display = isGutterOnly ? 'none' : '';

        roofRequiredFields.forEach(el => { el.required = !isGutterOnly; });
        gutterRequiredFields.forEach(el => { el.required = isGutterOnly; });

        if (isGutterOnly) {
            asbestosMessage.style.display = 'none';
            // Gutter Concerns lives in the same container as Specific Concerns
            // and is normally only revealed by the roof type/subtype cascade —
            // force it open here since there's no roof type to drive it.
            sectionsContainer.style.display = 'block';
        } else {
            asbestosMessage.style.display = roofTypeSelect.value === 'asbestos' ? 'block' : 'none';
            sectionsContainer.style.display = (roofTypeSelect.value && subTypeSelect.value) ? 'block' : 'none';
        }
    }

    toggle.addEventListener('change', function() {
        applyState(this.checked);
    });

    applyState(toggle.checked);
}

// Show only sections that are relevant to the selected roof type and subtype
function showRelevantSections(roofType, subType) {
    // Hide all sections first
    document.querySelectorAll('.section-card').forEach(section => {
        section.style.display = 'none';
    });
    
    // Define which sections each roof type category should show
    const sectionsByRoofType = {
        'profiled-metal': [
            'section-sheet-condition',
            'section-hip-ridging', 
            'section-roof-fixings',
            'section-valleys',
            'section-penetration-flashing',
            'section-aerials-antennas',
            'section-spouting-downpipe'
        ],
        'compressed-metal-tile': [
            'section-sheet-condition',
            'section-hip-ridging',
            'section-roof-fixings', 
            'section-valleys',
            'section-penetration-flashing',
            'section-aerials-antennas',
            'section-spouting-downpipe'
        ],
        'concrete-tile': [
            'section-sheet-condition',
            'section-hip-ridging',
            'section-gable-barge',
            'section-roof-fixings',
            'section-valleys', 
            'section-penetration-flashing',
            'section-aerials-antennas',
            'section-spouting-downpipe'
        ],
        'clay-tile': [
            'section-sheet-condition',
            'section-hip-ridging',
            'section-gable-barge',
            'section-roof-fixings',
            'section-valleys',
            'section-penetration-flashing', 
            'section-aerials-antennas',
            'section-spouting-downpipe'
        ],
        'flat-roof': [
            'section-sheet-condition',
            'section-penetration-flashing',
            'section-aerials-antennas',
            'section-spouting-downpipe'
        ]
    };
    
    // Get sections to show for this roof type
    const sectionsToShow = sectionsByRoofType[roofType];
    if (!sectionsToShow) return;
    
    // Show relevant sections
    sectionsToShow.forEach(sectionId => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.style.display = 'block';
            
            // Reset section state
            sectionElement.setAttribute('data-disabled', 'false');
            const cardContent = sectionElement.querySelector('.card-content');
            if (cardContent) {
                cardContent.style.opacity = '1';
                cardContent.style.pointerEvents = 'auto';
            }
            
            // Reset applicable toggles to checked
            const applicableToggle = sectionElement.querySelector('.applicable-toggle input[type="checkbox"]');
            if (applicableToggle) {
                applicableToggle.checked = true;
            }
        }
    });
}

// Setup remove section button functionality
function setupSectionRemovalButtons() {
    document.querySelectorAll('.remove-section-btn').forEach(button => {
        button.addEventListener('click', function() {
            const sectionCard = this.closest('.section-card');
            if (sectionCard) {
                const sectionId = sectionCard.id;
                const sectionTitle = sectionCard.querySelector('h3').textContent;
                
                // Hide the section
                sectionCard.style.display = 'none';
                
                // Add to removed sections tracking (only if not already there)
                if (!removedSections.find(section => section.id === sectionId)) {
                    removedSections.push({
                        id: sectionId,
                        title: sectionTitle
                    });
                }
                
                // Clear all form values in the removed section
                const inputs = sectionCard.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
                
                // Update restore options
                updateRestoreOptions();
            }
        });
    });
}

// Setup applicable/not applicable toggles
function setupApplicabilityToggles() {
    document.querySelectorAll('.applicable-toggle input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const sectionCard = this.closest('.section-card');
            const cardContent = sectionCard.querySelector('.card-content');
            
            if (this.checked) {
                cardContent.style.opacity = '1';
                cardContent.style.pointerEvents = 'auto';
                sectionCard.setAttribute('data-disabled', 'false');
            } else {
                cardContent.style.opacity = '0.5';
                cardContent.style.pointerEvents = 'none';
                sectionCard.setAttribute('data-disabled', 'true');
                
                // Clear form values when disabled
                const inputs = cardContent.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
            }
        });
    });
}

// Populate all section dropdowns based on selected roof type and sub-type
function populateAllSectionDropdowns() {
    const roofType = document.getElementById('roofType').value;
    const subType = document.getElementById('subType').value;
    
    if (!roofType || !subType) return;
    
    // Map roof types to their data structure equivalents
    let dataRoofType;
    
    // Map each roof type to its corresponding data structure
    if (roofType === 'profiled-metal') {
        dataRoofType = 'profiled-metal';
    } else if (roofType === 'compressed-metal-tile') {
        dataRoofType = 'compressed-metal-tile';
    } else if (roofType === 'concrete-tile' || roofType === 'clay-tile') {
        // Both concrete-tile and clay-tile use the "tile" data structure
        dataRoofType = 'tile';
    } else if (roofType === 'flat-roof') {
        dataRoofType = 'flat-roof';
    } else {
        // Fallback to the original roof type
        dataRoofType = roofType;
    }
    
    // Get the appropriate data structure
    const roofTypeData = roofData[dataRoofType];
    if (!roofTypeData) {
        return;
    }
    
    // Get sections from the selected sub-type
    const selectedSubTypeData = roofTypeData.subTypes[subType];
    if (!selectedSubTypeData || !selectedSubTypeData.sections) {
        console.error('No section data found for', dataRoofType, '->', subType);
        return;
    }

    // Sub-types with empty sections fall back to the primary sub-type's data
    let sections = selectedSubTypeData.sections;
    if (roofType === 'profiled-metal' && Object.keys(sections).length === 0) {
        sections = roofTypeData.subTypes['corrugated-metal'].sections;
    }
    if (roofType === 'compressed-metal-tile' && Object.keys(sections).length === 0) {
        sections = roofTypeData.subTypes['decramastic'].sections;
    }

    console.log('Populating dropdowns for', dataRoofType, '->', subType, '- Found', Object.keys(sections).length, 'sections');

    // Populate each section's dropdowns
    Object.keys(sections).forEach(sectionKey => {
        const section = sections[sectionKey];
        console.log('Populating section:', sectionKey, section.title);
        populateSectionDropdowns(sectionKey, section);
    });
}

// Create a single field input element based on field definition
function renderFieldInput(field, namePrefix) {
    const fieldId = `${namePrefix}_${field.name}`;

    if (field.type === 'file') {
        const input = document.createElement('input');
        input.type = 'file';
        input.name = fieldId;
        input.accept = 'image/*';
        if (field.multiple) input.multiple = true;
        return input;
    } else if (field.type === 'textarea') {
        const input = document.createElement('textarea');
        input.name = fieldId;
        input.rows = 3;
        input.placeholder = field.label;
        return input;
    } else if (field.type === 'number') {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = fieldId;
        input.placeholder = field.label;
        if (field.step) input.step = field.step;
        return input;
    } else if (field.type === 'select') {
        const input = document.createElement('select');
        input.name = fieldId;
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = `Select ${field.label}...`;
        input.appendChild(defaultOpt);
        (field.options || []).forEach(opt => {
            const option = document.createElement('option');
            option.value = typeof opt === 'object' ? opt.value : opt.toLowerCase().replace(/\s+/g, '-');
            option.textContent = typeof opt === 'object' ? opt.label : opt;
            input.appendChild(option);
        });
        return input;
    } else if (field.type === 'checkbox') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = fieldId;
        input.id = fieldId;
        return input;
    } else if (field.type === 'yesno') {
        const group = document.createElement('div');
        group.className = 'yesno-group';
        ['yes', 'no'].forEach(val => {
            const radioLabel = document.createElement('label');
            radioLabel.className = 'radio-label';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = fieldId;
            radio.value = val;
            radioLabel.appendChild(radio);
            radioLabel.appendChild(document.createTextNode(val === 'yes' ? 'Yes' : 'No'));
            group.appendChild(radioLabel);
        });
        return group;
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = fieldId;
        input.placeholder = field.label;
        return input;
    }
}

// Render sub-fields for a specific flashing type into a container
function renderFlashingSubFields(container, fields, namePrefix) {
    container.innerHTML = '';
    fields.forEach(field => {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';

        if (field.dependsOn) {
            fieldGroup.style.display = 'none';
            fieldGroup.dataset.dependsOn = field.dependsOn;
            if (field.showWhen) fieldGroup.dataset.showWhen = field.showWhen;
        }

        if (field.type === 'checkbox') {
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-wrapper';
            const input = renderFieldInput(field, namePrefix);
            const lbl = document.createElement('label');
            lbl.htmlFor = `${namePrefix}_${field.name}`;
            lbl.textContent = field.label;
            wrapper.appendChild(input);
            wrapper.appendChild(lbl);
            fieldGroup.appendChild(wrapper);
            input.addEventListener('change', function() {
                container.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                    dep.style.display = this.checked ? 'block' : 'none';
                });
            });
        } else {
            const lbl = document.createElement('label');
            lbl.textContent = field.label + (field.required ? ' *' : '');
            const input = renderFieldInput(field, namePrefix);
            if (field.type === 'yesno') {
                input.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.addEventListener('change', function() {
                        container.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                            const showWhen = dep.dataset.showWhen;
                            dep.style.display = (!showWhen || showWhen === this.value) ? 'block' : 'none';
                        });
                    });
                });
            }
            if (field.type === 'select') {
                input.addEventListener('change', function() {
                    container.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                        const showWhen = dep.dataset.showWhen;
                        dep.style.display = (!showWhen || showWhen === this.value) ? 'block' : 'none';
                    });
                });
            }
            fieldGroup.appendChild(lbl);
            fieldGroup.appendChild(input);
        }
        container.appendChild(fieldGroup);
    });
}

// Populate dropdowns for a specific section
function populateSectionDropdowns(sectionKey, section) {
    // Map section keys to their corresponding HTML elements
    const sectionElementMap = {
        'sheet-condition': {
            conditionSelect: 'sheetCondition',
            concernsSelect: 'sheetSpecificConcerns'
        },
        'metal-tile-condition': {
            conditionSelect: 'sheetCondition',
            concernsSelect: 'sheetSpecificConcerns'
        },
        'roof-tile-condition': {
            conditionSelect: 'sheetCondition',
            concernsSelect: 'sheetSpecificConcerns'
        },
        'hip-ridging': {
            conditionSelect: 'hipRidgingCondition',
            concernsSelect: 'hipRidgingSpecificConcerns'
        },
        'gable-barge': {
            conditionSelect: 'gableBargeCondition',
            concernsSelect: 'gableBargeSpecificConcerns'
        },
        'roof-fixings': {
            conditionSelect: 'roofFixingsCondition',
            concernsSelect: 'roofFixingsSpecificConcerns'
        },
        'valleys': {
            conditionSelect: 'valleysCondition',
            concernsSelect: 'valleysSpecificConcerns'
        },
        'penetration-flashing': {
            conditionSelect: 'penetrationFlashingCondition',
            concernsSelect: 'penetrationFlashingSpecificConcerns'
        },
        'aerials-antennas': {
            conditionSelect: 'aerialsCondition',
            concernsSelect: 'aerialsSpecificConcerns'
        },
        'spouting-downpipe': {
            conditionSelect: 'spoutingCondition',
            concernsSelect: 'spoutingSpecificConcerns'
        }
    };
    
    const elementIds = sectionElementMap[sectionKey];
    if (!elementIds) return;
    
    // Populate overall condition dropdown
    const conditionSelect = document.getElementById(elementIds.conditionSelect);
    if (conditionSelect && section.overallConditions) {
        conditionSelect.innerHTML = '<option value="">Select condition...</option>';
        
        Object.keys(section.overallConditions).forEach(conditionKey => {
            const condition = section.overallConditions[conditionKey];
            const option = document.createElement('option');
            option.value = conditionKey;
            option.textContent = condition.title;
            conditionSelect.appendChild(option);
        });
    }
    
    // Populate specific concerns checkboxes
    const concernsContainer = document.getElementById(elementIds.concernsSelect);
    console.log('Populating concerns for:', elementIds.concernsSelect, 'Found container:', !!concernsContainer, 'Has concerns:', !!section.specificConcerns);

    if (concernsContainer && section.specificConcerns) {
        concernsContainer.innerHTML = '';
        console.log('Adding', Object.keys(section.specificConcerns).length, 'concerns to', elementIds.concernsSelect);

        Object.keys(section.specificConcerns).forEach(concernKey => {
            const concern = section.specificConcerns[concernKey];

            const concernItem = document.createElement('div');
            concernItem.className = 'concern-item';

            const label = document.createElement('label');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = `${elementIds.concernsSelect}_${concernKey}`;
            checkbox.value = concernKey;
            checkbox.id = `${elementIds.concernsSelect}_${concernKey}`;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(concern.title));

            concernItem.appendChild(label);

            // Create detail fields container (hidden by default)
            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'concern-details';
            detailsContainer.id = `${elementIds.concernsSelect}_${concernKey}_details`;
            detailsContainer.style.display = 'none';

            // Add fields based on concern definition
            if (concern.fields && concern.fields.length > 0) {
                const namePrefix = `${elementIds.concernsSelect}_${concernKey}`;

                concern.fields.forEach(field => {
                    // Special handling for flashing cascade select
                    if (field.type === 'flashing-select') {
                        const fieldGroup = document.createElement('div');
                        fieldGroup.className = 'field-group';
                        const lbl = document.createElement('label');
                        lbl.textContent = field.label;
                        const select = document.createElement('select');
                        select.name = `${namePrefix}_${field.name}`;
                        const defaultOpt = document.createElement('option');
                        defaultOpt.value = '';
                        defaultOpt.textContent = 'Select flashing type...';
                        select.appendChild(defaultOpt);
                        (field.options || []).forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt.value;
                            option.textContent = opt.label;
                            select.appendChild(option);
                        });
                        const subContainer = document.createElement('div');
                        subContainer.className = 'flashing-sub-fields';
                        select.addEventListener('change', function() {
                            if (this.value && concern.flashingFields && concern.flashingFields[this.value]) {
                                renderFlashingSubFields(subContainer, concern.flashingFields[this.value], `${namePrefix}_${this.value}`);
                                subContainer.style.display = 'block';
                            } else {
                                subContainer.innerHTML = '';
                                subContainer.style.display = 'none';
                            }
                        });
                        fieldGroup.appendChild(lbl);
                        fieldGroup.appendChild(select);
                        detailsContainer.appendChild(fieldGroup);
                        detailsContainer.appendChild(subContainer);
                        return;
                    }

                    const fieldGroup = document.createElement('div');
                    fieldGroup.className = 'field-group';

                    if (field.dependsOn) {
                        fieldGroup.style.display = 'none';
                        fieldGroup.dataset.dependsOn = field.dependsOn;
                        if (field.showWhen) fieldGroup.dataset.showWhen = field.showWhen;
                    }

                    if (field.type === 'checkbox') {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'checkbox-wrapper';
                        const input = renderFieldInput(field, namePrefix);
                        const lbl = document.createElement('label');
                        lbl.htmlFor = `${namePrefix}_${field.name}`;
                        lbl.textContent = field.label;
                        wrapper.appendChild(input);
                        wrapper.appendChild(lbl);
                        fieldGroup.appendChild(wrapper);
                        input.addEventListener('change', function() {
                            detailsContainer.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                                dep.style.display = this.checked ? 'block' : 'none';
                            });
                        });
                    } else {
                        const lbl = document.createElement('label');
                        lbl.textContent = field.label + (field.required ? ' *' : '');
                        const input = renderFieldInput(field, namePrefix);
                        if (field.type === 'yesno') {
                            input.querySelectorAll('input[type="radio"]').forEach(radio => {
                                radio.addEventListener('change', function() {
                                    detailsContainer.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                                        const showWhen = dep.dataset.showWhen;
                                        dep.style.display = (!showWhen || showWhen === this.value) ? 'block' : 'none';
                                    });
                                });
                            });
                        }
                        if (field.type === 'select') {
                            input.addEventListener('change', function() {
                                detailsContainer.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                                    const showWhen = dep.dataset.showWhen;
                                    dep.style.display = (!showWhen || showWhen === this.value) ? 'block' : 'none';
                                });
                            });
                        }
                        fieldGroup.appendChild(lbl);
                        fieldGroup.appendChild(input);
                    }

                    detailsContainer.appendChild(fieldGroup);
                });
            }

            concernItem.appendChild(detailsContainer);

            // Add event listener to show/hide details
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    detailsContainer.style.display = 'block';
                } else {
                    detailsContainer.style.display = 'none';
                    // Clear fields when unchecked
                    const inputs = detailsContainer.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = false;
                        } else if (input.type === 'file') {
                            input.value = '';
                        } else {
                            input.value = '';
                        }
                    });
                }
            });

            concernsContainer.appendChild(concernItem);
        });
    }
}

// Populate the Specific Concerns section with all concerns from all sections
// Resolve which section's specificConcerns should be shown/read for a given roof type + subtype.
// Mirrors the subtype fallback used when a subtype has no section data of its own (e.g. clay-tile -> concrete-tile/atlas).
function resolvePrimaryConcernsSection(roofType, subType) {
    const roofTypeData = roofData[roofType];
    if (!roofTypeData || !roofTypeData.subTypes) return null;

    let sections = roofTypeData.subTypes[subType]?.sections || {};

    if (Object.keys(sections).length === 0) {
        if (roofType === 'profiled-metal') {
            sections = roofData['profiled-metal'].subTypes['corrugated-metal'].sections;
        } else if (roofType === 'compressed-metal-tile') {
            sections = roofData['compressed-metal-tile'].subTypes['decramastic'].sections;
        } else if (roofType === 'concrete-tile' || roofType === 'clay-tile') {
            sections = roofData['concrete-tile'].subTypes['atlas'].sections;
        }
    }

    const sectionKey = Object.keys(sections)[0];
    if (!sectionKey) return null;
    const section = sections[sectionKey];
    if (!section.specificConcerns) return null;

    return { sectionKey, section };
}

function populateSpecificConcernsSection(roofType, subType) {
    const allSpecificConcernsContainer = document.getElementById('allSpecificConcerns');
    if (!allSpecificConcernsContainer) return;

    allSpecificConcernsContainer.innerHTML = '';
    let concernsCount = 0;

    const resolved = resolvePrimaryConcernsSection(roofType, subType);
    if (!resolved) return;
    const { sectionKey: firstSectionKey, section: primarySection } = resolved;

    const singleSectionEntries = { [firstSectionKey]: primarySection };

    Object.keys(singleSectionEntries).forEach(sectionKey => {
        const section = singleSectionEntries[sectionKey];
        if (!section.specificConcerns || Object.keys(section.specificConcerns).length === 0) return;

        Object.keys(section.specificConcerns).forEach(concernKey => {
            const concern = section.specificConcerns[concernKey];
            const uniqueId = `sc_${sectionKey}_${concernKey}`;
            const namePrefix = `sc_${sectionKey}_${concernKey}`;

            const concernItem = document.createElement('div');
            concernItem.className = 'concern-item';

            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = uniqueId;
            checkbox.value = concernKey;
            checkbox.id = uniqueId;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(concern.title));
            concernItem.appendChild(label);

            // Detail fields container (shown when checkbox is checked)
            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'concern-details';
            detailsContainer.id = `${uniqueId}_details`;
            detailsContainer.style.display = 'none';

            if (concern.fields && concern.fields.length > 0) {
                concern.fields.forEach(field => {
                    // Special handling for flashing cascade select — repeatable, so a technician can
                    // log more than one distinct flashing issue (e.g. Valley + Barge) under one concern.
                    if (field.type === 'flashing-select') {
                        const entriesContainer = document.createElement('div');
                        entriesContainer.className = 'flashing-entries';

                        const countInput = document.createElement('input');
                        countInput.type = 'hidden';
                        countInput.name = `${namePrefix}_${field.name}_count`;

                        let nextIndex = 0;

                        const addFlashingEntry = () => {
                            const entryIndex = nextIndex++;
                            countInput.value = nextIndex;
                            const entryPrefix = `${namePrefix}_flash${entryIndex}`;

                            const entryCard = document.createElement('div');
                            entryCard.className = 'flashing-entry-card';

                            const entryHeader = document.createElement('div');
                            entryHeader.className = 'flashing-entry-header';
                            const lbl = document.createElement('label');
                            lbl.textContent = entryIndex === 0 ? field.label : `${field.label} (additional)`;
                            entryHeader.appendChild(lbl);
                            if (entryIndex > 0) {
                                const removeBtn = document.createElement('button');
                                removeBtn.type = 'button';
                                removeBtn.className = 'remove-flashing-entry';
                                removeBtn.textContent = '×';
                                removeBtn.title = 'Remove this flashing entry';
                                removeBtn.addEventListener('click', () => entryCard.remove());
                                entryHeader.appendChild(removeBtn);
                            }

                            const select = document.createElement('select');
                            select.name = `${entryPrefix}_${field.name}`;
                            const defaultOpt = document.createElement('option');
                            defaultOpt.value = '';
                            defaultOpt.textContent = 'Select flashing type...';
                            select.appendChild(defaultOpt);
                            (field.options || []).forEach(opt => {
                                const option = document.createElement('option');
                                option.value = opt.value;
                                option.textContent = opt.label;
                                select.appendChild(option);
                            });

                            const subContainer = document.createElement('div');
                            subContainer.className = 'flashing-sub-fields';
                            select.addEventListener('change', function() {
                                if (this.value && concern.flashingFields && concern.flashingFields[this.value]) {
                                    renderFlashingSubFields(subContainer, concern.flashingFields[this.value], `${entryPrefix}_${this.value}`);
                                    subContainer.style.display = 'block';
                                } else {
                                    subContainer.innerHTML = '';
                                    subContainer.style.display = 'none';
                                }
                            });

                            entryCard.appendChild(entryHeader);
                            entryCard.appendChild(select);
                            entryCard.appendChild(subContainer);
                            entriesContainer.appendChild(entryCard);
                        };

                        addFlashingEntry();

                        const addMoreBtn = document.createElement('button');
                        addMoreBtn.type = 'button';
                        addMoreBtn.className = 'add-flashing-btn';
                        addMoreBtn.textContent = '+ Add another flashing issue';
                        addMoreBtn.addEventListener('click', addFlashingEntry);

                        detailsContainer.appendChild(entriesContainer);
                        detailsContainer.appendChild(countInput);
                        detailsContainer.appendChild(addMoreBtn);
                        return;
                    }

                    const fieldGroup = document.createElement('div');
                    fieldGroup.className = 'field-group';

                    if (field.dependsOn) {
                        fieldGroup.style.display = 'none';
                        fieldGroup.dataset.dependsOn = field.dependsOn;
                        if (field.showWhen) fieldGroup.dataset.showWhen = field.showWhen;
                    }

                    if (field.type === 'checkbox') {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'checkbox-wrapper';
                        const input = renderFieldInput(field, namePrefix);
                        const lbl = document.createElement('label');
                        lbl.htmlFor = `${namePrefix}_${field.name}`;
                        lbl.textContent = field.label;
                        wrapper.appendChild(input);
                        wrapper.appendChild(lbl);
                        fieldGroup.appendChild(wrapper);
                        input.addEventListener('change', function() {
                            detailsContainer.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                                dep.style.display = this.checked ? 'block' : 'none';
                            });
                        });
                    } else {
                        const lbl = document.createElement('label');
                        lbl.textContent = field.label + (field.required ? ' *' : '');
                        const input = renderFieldInput(field, namePrefix);
                        if (field.type === 'yesno') {
                            input.querySelectorAll('input[type="radio"]').forEach(radio => {
                                radio.addEventListener('change', function() {
                                    detailsContainer.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                                        const showWhen = dep.dataset.showWhen;
                                        dep.style.display = (!showWhen || showWhen === this.value) ? 'block' : 'none';
                                    });
                                });
                            });
                        }
                        if (field.type === 'select') {
                            input.addEventListener('change', function() {
                                detailsContainer.querySelectorAll(`[data-depends-on="${field.name}"]`).forEach(dep => {
                                    const showWhen = dep.dataset.showWhen;
                                    dep.style.display = (!showWhen || showWhen === this.value) ? 'block' : 'none';
                                });
                            });
                        }
                        fieldGroup.appendChild(lbl);
                        fieldGroup.appendChild(input);
                    }

                    detailsContainer.appendChild(fieldGroup);
                });
            }

            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    detailsContainer.style.display = 'block';
                } else {
                    detailsContainer.style.display = 'none';
                    detailsContainer.querySelectorAll('input, textarea').forEach(inp => {
                        if (inp.type === 'checkbox' || inp.type === 'radio') {
                            inp.checked = false;
                        } else {
                            inp.value = '';
                        }
                    });
                }
            });

            concernItem.appendChild(detailsContainer);
            allSpecificConcernsContainer.appendChild(concernItem);
            concernsCount++;
        });
    });
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('roofReportForm');
    const reportOutput = document.getElementById('reportOutput');
    const reportContent = document.getElementById('reportContent');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
        reportOutput.style.display = 'block';
        reportOutput.scrollIntoView({ behavior: 'smooth' });

        if (typeof handleDraftSubmit === 'function') {
            handleDraftSubmit(form);
        }
    });
    
    // Clear form functionality
    const clearBtn = document.getElementById('clearForm');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            form.reset();
            reportOutput.style.display = 'none';

            // form.reset() doesn't fire 'change', so the Gutter Only toggle's
            // listener (which shows/hides Roof vs Gutter Details) won't run on
            // its own — dispatch it explicitly to avoid stale section state.
            document.getElementById('gutterOnlyToggle').dispatchEvent(new Event('change'));

            // Hide sub-type group, asbestos message, and sections container
            document.getElementById('subTypeGroup').style.display = 'none';
            document.getElementById('asbestosMessage').style.display = 'none';
            document.getElementById('roofSectionsContainer').style.display = 'none';

            // Clear specific concerns
            const allSpecificConcerns = document.getElementById('allSpecificConcerns');
            if (allSpecificConcerns) allSpecificConcerns.innerHTML = '';

            // Clear additional items
            clearAllAdditionalItems();
        });
    }
}

// Generate the roof report
function generateReport() {
    const formData = new FormData(document.getElementById('roofReportForm'));
    const reportContent = document.getElementById('reportContent');

    // Drop object URLs from any previous render before creating a new batch
    reportObjectUrls.forEach(url => URL.revokeObjectURL(url));
    reportObjectUrls = [];

    const concerns = collectSelectedConcerns(formData);
    if (typeof applyNarrativeOverrides === 'function') {
        applyNarrativeOverrides(concerns);
    }

    const isGutterOnly = document.getElementById('gutterOnlyToggle').checked;

    let reportHTML = '<div class="report-sections">';
    reportHTML += generateCoverSection(formData, isGutterOnly);
    reportHTML += generateCauseForConcernSummary(concerns);
    reportHTML += generateRoofDetailsTable(formData, isGutterOnly);
    reportHTML += generateCauseForConcernDetails(concerns);
    reportHTML += generateAdditionalItemsSection(formData);
    reportHTML += '</div>';

    reportContent.innerHTML = reportHTML;
}

// Turn a slug/word value (e.g. "dry-ridge") into a display label ("Dry Ridge")
function slugToLabel(value) {
    if (!value) return '';
    const label = value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return label === 'Pvc' ? 'PVC' : label;
}

const NUMBER_WORDS = { '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five' };
function numberWord(value) {
    return NUMBER_WORDS[value] || value || '';
}

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatReportDate(date) {
    return `${date.getDate()} ${MONTH_ABBR[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
}

// Display labels for the Gutter Details "Gutter Type" field — matches the
// options list under Gutter Concerns' "Type of Gutters", but slugToLabel()
// can't reverse-engineer these correctly (e.g. "metal-box-125" doesn't encode
// "Cutter"), so they're spelled out explicitly here.
const GUTTER_TYPE_LABELS = {
    'pvc-storm-cloud': 'PVC Storm Cloud',
    'pvc-classic': 'PVC Classic',
    'pvc-other': 'PVC Other',
    'metal-quarter-round': 'Metal Quarter Round',
    'metal-half-round': 'Metal Half Round',
    'metal-box-125': 'Metal Box Cutter 125',
    'metal-box-custom': 'Metal Box Cutter Custom',
    'internal-gutters': 'Internal Gutters',
    'downpipe-issues': 'Downpipe Issues',
};

// Object URLs created for report photo previews (specific-concern photos, gutter photos, cover photo).
// Revoked and reset at the start of every generateReport() call so repeated submits don't leak memory.
let reportObjectUrls = [];

// Endeavour-branded letterhead + title + report meta (date/ref/address/prepared for) + cover photo
function generateCoverSection(formData, isGutterOnly) {
    const reportDate = formatReportDate(new Date());
    const reportRef = formData.get(isGutterOnly ? 'gutterDetailsReportRef' : 'reportRef') || `#${Date.now().toString().slice(-10)}`;
    const address = formData.get(isGutterOnly ? 'gutterDetailsPropertyAddress' : 'propertyAddress') || 'Not specified';
    const preparedFor = formData.get(isGutterOnly ? 'gutterDetailsPreparedFor' : 'preparedFor');
    const inspectionTitle = isGutterOnly ? 'Gutter Inspection' : 'Roof Inspection';

    const coverPhotoFile = formData.getAll(isGutterOnly ? 'gutterDetailsAdditionalImages' : 'additionalImages').find(f => f instanceof File && f.size > 0);
    let coverPhotoHtml = '';
    if (coverPhotoFile) {
        const url = URL.createObjectURL(coverPhotoFile);
        reportObjectUrls.push(url);
        coverPhotoHtml = `<img class="cover-photo" src="${url}" alt="Property photo">`;
    }

    return `
        <div class="report-letterhead">
            <span class="report-page-badge">Pg. 1</span>
            <span class="report-letterhead-label">${inspectionTitle}</span>
            <span class="eg-logo">
                <span class="eg-logo-squares"><span></span><span></span><span></span></span>
                <span class="eg-logo-word">ENDEAVOUR</span>
            </span>
        </div>
        <h1 class="cover-title">${inspectionTitle}</h1>
        <div class="cover-meta">
            <div class="cover-meta-text">
                <p><strong>Report Date:</strong> ${reportDate}</p>
                <p><strong>Report Ref:</strong> ${reportRef}</p>
                <p><strong>Address:</strong> ${address}</p>
                ${preparedFor ? `<p><strong>Prepared For:</strong> ${preparedFor}</p>` : ''}
            </div>
            ${coverPhotoHtml}
        </div>
    `;
}

// "Cause for Concern Summary" — striped list of every checked concern's title, plus the standard intro copy
function generateCauseForConcernSummary(concerns) {
    const introHtml = `
        <p>This report contains information in regards to your roof, guttering systems and any other miscellaneous conditions that may or may not be affecting your roof line's purpose.</p>
        <p>We have simplified our layout and personalised it for a very direct understanding for our valued customers. If something doesn't look right, or you require further information regarding this report.</p>
        <p>Please feel free to reply back to this email stating your query and we will look into it right away.</p>
    `;

    const summaryBody = concerns.length > 0
        ? `
            <p>During inspection we have identified the following cause's for concern.</p>
            <div class="cfc-summary-list">${concerns.map(c => `<div class="cfc-summary-row">${c.title}</div>`).join('')}</div>
        `
        : `<p>During inspection our technician did not identify any causes for concern.</p>`;

    return `
        <div class="report-section">
            <h2 class="section-heading">Cause for Concern Summary</h2>
            ${summaryBody}
            ${introHtml}
        </div>
    `;
}

// "Roof Details" table — direct label/value mapping from the top-level roof detail fields
function generateRoofDetailsTable(formData, isGutterOnly) {
    if (isGutterOnly) {
        const gutterType = formData.get('gutterDetailsType');
        if (!gutterType) return '';

        const gutterTypeName = GUTTER_TYPE_LABELS[gutterType] || slugToLabel(gutterType);
        const overallCondition = formData.get('gutterDetailsOverallCondition');

        const rows = [
            ['Gutter Type', gutterTypeName],
            ['Gutter Levels', numberWord(formData.get('gutterDetailsLevels')) || 'N/A'],
            ['Gutter Pitch', slugToLabel(formData.get('gutterDetailsPitch')) || 'N/A'],
            ['Ridge Type', slugToLabel(formData.get('gutterDetailsRidgeType')) || 'N/A'],
            ['Spouting Type', slugToLabel(formData.get('gutterDetailsSpoutingType')) || 'N/A'],
            ['Nail Type', slugToLabel(formData.get('gutterDetailsNailType')) || 'N/A'],
            ['Overall Condition of Gutter', overallCondition ? `<strong>${slugToLabel(overallCondition)}</strong>` : 'N/A'],
        ];

        const rowsHtml = rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('');

        return `
            <div class="report-section">
                <table class="roof-details-table">
                    <caption>Gutter Details</caption>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </div>
        `;
    }

    const roofType = formData.get('roofType');
    const subType = formData.get('subType');
    if (!roofType) return '';

    const roofTypeName = roofData[roofType]?.name || slugToLabel(roofType);
    const overallCondition = formData.get('overallCondition');

    const rows = [['Roof Type', roofTypeName]];
    if (subType) {
        rows.push(['Tile Type', roofData[roofType]?.subTypes?.[subType]?.name || slugToLabel(subType)]);
    }
    rows.push(
        ['Roof Levels', numberWord(formData.get('levels')) || 'N/A'],
        ['Roof Pitch', slugToLabel(formData.get('roofPitch')) || 'N/A'],
        ['Ridge Type', slugToLabel(formData.get('ridgeType')) || 'N/A'],
        ['Spouting Type', slugToLabel(formData.get('spoutingTypeMain')) || 'N/A'],
        ['Nail Type', slugToLabel(formData.get('nailType')) || 'N/A'],
        ['Overall Condition of Roof', overallCondition ? `<strong>${slugToLabel(overallCondition)}</strong>` : 'N/A']
    );

    const rowsHtml = rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('');

    return `
        <div class="report-section">
            <table class="roof-details-table">
                <caption>Roof Details</caption>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;
}

// Render entered values for a fields[] array (from roofData or gutterConcernData) as labeled report lines.
// flashingFieldsMap is the owning concern's `flashingFields` map (only relevant for 'flashing-select' fields,
// which live on the concern rather than the field itself).
function formatFieldValues(fields, formData, namePrefix, flashingFieldsMap) {
    if (!fields || fields.length === 0) return '';

    return fields.map(field => {
        const fieldName = namePrefix ? `${namePrefix}_${field.name}` : field.name;

        if (field.type === 'file') {
            const count = formData.getAll(fieldName).filter(f => f instanceof File && f.size > 0).length;
            return count > 0 ? `<p><strong>${field.label}:</strong> ${count} photo(s) attached</p>` : '';
        }

        if (field.type === 'flashing-select') {
            // Repeatable: rendered as entries named `${namePrefix}_flash{N}_{field.name}`, with a
            // `${fieldName}_count` hidden input tracking how many entries were added (see
            // populateSpecificConcernsSection). Sub-field prefix is entryPrefix + chosenType (not
            // fieldName) — matches renderFlashingSubFields' naming.
            const entryCount = parseInt(formData.get(`${fieldName}_count`), 10) || 0;
            const rows = [];
            for (let i = 0; i < entryCount; i++) {
                const entryPrefix = `${namePrefix}_flash${i}`;
                const chosenType = formData.get(`${entryPrefix}_${field.name}`);
                if (!chosenType) continue;
                const chosenLabel = field.options?.find(o => o.value === chosenType)?.label || slugToLabel(chosenType);
                const subFields = flashingFieldsMap?.[chosenType];
                const subFieldsHtml = formatFieldValues(subFields, formData, `${entryPrefix}_${chosenType}`);
                rows.push(`<p><strong>${field.label}:</strong> ${chosenLabel}</p>${subFieldsHtml}`);
            }
            return rows.join('');
        }

        const rawValue = formData.get(fieldName);

        if (field.type === 'checkbox') {
            return rawValue ? `<p><strong>${field.label}:</strong> Yes</p>` : '';
        }

        if (rawValue === null || rawValue === '') return '';

        if (field.type === 'yesno') {
            return `<p><strong>${field.label}:</strong> ${rawValue === 'yes' ? 'Yes' : 'No'}</p>`;
        }

        if (field.type === 'select') {
            const opt = field.options?.find(o => (typeof o === 'object' ? o.value : o) === rawValue);
            const label = opt ? (typeof opt === 'object' ? opt.label : opt) : slugToLabel(rawValue);
            return `<p><strong>${field.label}:</strong> ${label}</p>`;
        }

        return `<p><strong>${field.label}:</strong> ${rawValue}</p>`;
    }).join('');
}

// Gutter concern boilerplate — mirrors the tone of roofData's specificConcerns, but not sourced
// from "Roof report re structure .txt" since these gutter checks were added after that doc was written.
const gutterConcernData = {
    leakingJoins: {
        title: 'Leaking Joins',
        description: 'We have identified leaking joins within the guttering system. This is allowing water to escape before it reaches the downpipes and is a potential source of water damage to the fascia and building envelope. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
        fields: [
            { name: 'gutterLeakingJoins_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterLeakingJoins_count', type: 'number', label: 'Number of leaking joins' },
            { name: 'gutterLeakingJoins_recommendations', type: 'textarea', label: 'Further Recommendations' },
            { name: 'gutterLeakingJoins_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    },
    alignmentIssues: {
        title: 'Alignment Issues',
        description: 'We have identified alignment issues with the guttering system. Misaligned guttering can hold water and disrupt the intended fall, reducing drainage efficiency. We recommend having this remedied to restore correct alignment and effective water flow.',
        fields: [
            { name: 'gutterAlignment_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterAlignment_description', type: 'textarea', label: 'Alignment Issue Description' },
            { name: 'gutterAlignment_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    },
    rustHoles: {
        title: 'Rust Holes Present',
        description: 'We have identified rust holes present in the guttering system. This is a potential water entry/exit point and will continue to deteriorate over time. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
        fields: [
            { name: 'gutterRust_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterRust_holeCount', type: 'number', label: 'Number of holes' },
            { name: 'gutterRust_patchPossible', type: 'yesno', label: 'Patch Repair Possible?' },
            { name: 'gutterRust_replacementLengths', type: 'number', label: 'Lengths needing replacement (m)' },
            { name: 'gutterRust_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    },
    crackedBroken: {
        title: 'Cracked or Broken Components',
        description: 'We have identified cracked or broken components within the guttering system. This is affecting the integrity of the rainwater collection system. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
        fields: [
            { name: 'gutterCracked_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterCracked_count', type: 'number', label: 'Number of components broken' },
            { name: 'gutterCracked_list', type: 'textarea', label: 'List of components broken' },
            { name: 'gutterCracked_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    },
    missingSections: {
        title: 'Missing Sections',
        description: 'We have identified missing sections of guttering. This is a gap in the rainwater collection system and is likely allowing water to discharge directly onto the building or foundations. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
        fields: [
            { name: 'gutterMissing_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterMissing_details', type: 'textarea', label: 'Missing Sections Details' },
            { name: 'gutterMissing_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    },
    brittle: {
        title: 'Brittle / General Wear and Tear',
        description: 'We have identified brittle guttering showing general wear and tear. This indicates the guttering material has begun to degrade and may become prone to further cracking or failure. Please advise if you would like to pursue a recommendation for this repair.',
        fields: [
            { name: 'gutterBrittle_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterBrittle_specifics', type: 'textarea', label: 'Specifics' },
            { name: 'gutterBrittle_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    },
    insufficientDownpipes: {
        title: 'Insufficient Amount of Downpipes',
        description: 'We have identified an insufficient number of downpipes for the guttering system installed. This can lead to guttering overflow during heavy rainfall and place additional stress on the rainwater system. We recommend additional downpipes be installed to ensure adequate drainage.',
        fields: [
            { name: 'gutterDownpipes_photos', type: 'file', label: 'Photos', multiple: true },
            { name: 'gutterDownpipes_needed', type: 'number', label: 'Amount of downpipes needed to be installed' },
            { name: 'gutterDownpipes_compliant', type: 'yesno', label: 'Can suggested downpipes drain into compliant outlets or T-junction into existing downpipes?' },
            { name: 'gutterDownpipes_costEffective', type: 'yesno', label: 'Cost Effective Solution?' }
        ]
    }
};

// Build a normalized { title, description, comments, detailsHtml, photos } entry for one checked concern.
// Pulls the 'comments' field out separately (Damage/Comments split, matching roofreportv1.pdf), collects
// attached photos as File objects, and routes everything else through formatFieldValues() as Details.
function buildConcernEntry(concern, formData, namePrefix, flashingFieldsMap, overrideKey) {
    const allFields = concern.fields || [];

    const commentsField = allFields.find(f => f.name === 'comments');
    const comments = commentsField ? formData.get(namePrefix ? `${namePrefix}_comments` : 'comments') : '';

    const photos = allFields
        .filter(f => f.type === 'file')
        .flatMap(f => {
            const fieldName = namePrefix ? `${namePrefix}_${f.name}` : f.name;
            return formData.getAll(fieldName).filter(file => file instanceof File && file.size > 0);
        });

    const detailFields = allFields.filter(f => f.type !== 'file' && f.name !== 'comments');
    const detailsHtml = formatFieldValues(detailFields, formData, namePrefix, flashingFieldsMap);

    // overrideKey identifies this concern instance for narrative-text editing (see report-sync.js);
    // falls back to namePrefix since that's already unique per tile/sheet concern.
    return { title: concern.title, description: concern.description, comments, detailsHtml, photos, overrideKey: overrideKey || namePrefix };
}

// Collect every checked concern (tile/sheet specific concerns + gutter concerns) into one normalized list,
// shared by both the "Cause for Concern Summary" list and the detailed cause-for-concern blocks below it.
function collectSelectedConcerns(formData) {
    const concerns = [];

    const roofType = formData.get('roofType');
    const subType = formData.get('subType');
    const resolved = resolvePrimaryConcernsSection(roofType, subType);
    if (resolved) {
        const { sectionKey, section } = resolved;
        Object.keys(section.specificConcerns).forEach(concernKey => {
            const namePrefix = `sc_${sectionKey}_${concernKey}`;
            if (!formData.get(namePrefix)) return;
            const concern = section.specificConcerns[concernKey];
            concerns.push(buildConcernEntry(concern, formData, namePrefix, concern.flashingFields));
        });
    }

    if (formData.get('gutterIssue') === 'yes') {
        Object.keys(gutterConcernData).forEach(concernKey => {
            if (!formData.get(`gutterDamage_${concernKey}`)) return;
            concerns.push(buildConcernEntry(gutterConcernData[concernKey], formData, '', undefined, `gutter_${concernKey}`));
        });
    }

    return concerns;
}

// Render a dense photo mosaic from an array of File objects, matching roofreportv1.pdf's photo grid
function renderPhotoGrid(files) {
    if (!files || files.length === 0) return '';
    const tiles = files.map(file => {
        const url = URL.createObjectURL(file);
        reportObjectUrls.push(url);
        return `<img src="${url}" alt="${file.name}">`;
    }).join('');
    return `<div class="photo-grid">${tiles}</div>`;
}

// "Cause for Concern: {title}" blocks — Damage (boilerplate) / Comments (if entered) / Details / photo grid
function generateCauseForConcernDetails(concerns) {
    if (concerns.length === 0) return '';

    const blocks = concerns.map(c => `
        <div class="cause-block">
            <h4 class="cause-title">Cause for Concern: <span>${c.title}</span></h4>
            <p><strong>Damage:</strong> <span class="narrative-editable" contenteditable="true" data-override-key="${c.overrideKey}::description">${c.description}</span></p>
            ${c.comments ? `<p><strong>Comments:</strong> <span class="narrative-editable" contenteditable="true" data-override-key="${c.overrideKey}::comments">${c.comments}</span></p>` : ''}
            ${c.detailsHtml}
            ${renderPhotoGrid(c.photos)}
        </div>
    `).join('');

    return `<div class="report-section">${blocks}</div>`;
}

// Generate additional items section
function generateAdditionalItemsSection(formData) {
    const items = [];
    
    // Collect all additional items
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('additionalItem_') && key.endsWith('_type') && value) {
            const index = key.match(/additionalItem_(\d+)_type/)[1];
            const subject = formData.get(`additionalItem_${index}_subject`);
            const quantity = formData.get(`additionalItem_${index}_quantity`);
            const comments = formData.get(`additionalItem_${index}_comments`);
            
            // Get display name for the item
            const itemDisplayName = value === 'other' && subject ? 
                subject : 
                value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            items.push({
                name: itemDisplayName,
                quantity: quantity,
                comments: comments
            });
        }
    }
    
    if (items.length === 0) return '';
    
    let html = `
        <div class="report-section">
            <h3>Additional Roofing Items</h3>
    `;
    
    items.forEach((item, index) => {
        html += `<div class="additional-item-report">
            <p><strong>Item ${index + 1}:</strong> ${item.name}</p>`;
        
        if (item.quantity) {
            html += `<p><strong>Quantity:</strong> ${item.quantity}</p>`;
        }
        
        if (item.comments) {
            html += `<p><strong>Comments/Explanation:</strong> ${item.comments}</p>`;
        }
        
        html += `</div>`;
    });
    
    html += '</div>';
    return html;
}