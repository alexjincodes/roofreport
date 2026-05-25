// Track removed sections for restoration
let removedSections = [];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRoofReportApp();
});

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
                                    { name: 'sheetLength', type: 'number', label: 'Length of sheets (m)', step: 0.1 }
                                ]
                            },
                            'scratches-dents': {
                                title: 'Scratches/dents/dings worth notifying',
                                description: 'We have identified scratches/dents/damage that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'sheetCount', type: 'number', label: 'Number of replacement sheets' },
                                    { name: 'sheetLength', type: 'number', label: 'Length of sheets (m)', step: 0.1 }
                                ]
                            },
                            'damaged-sheet': {
                                title: 'Damaged sheet',
                                description: 'We have identified damaged roof sheeting that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'sheetCount', type: 'number', label: 'Number of replacement sheets' },
                                    { name: 'sheetLength', type: 'number', label: 'Length of sheets (m)', step: 0.1 }
                                ]
                            },
                            'loose-sheeting': {
                                title: 'Loose sheeting loose/missing',
                                description: 'We have identified loose/missing sheeting that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation' }
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
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'scratches-dents': {
                                title: 'Scratches/dents/dings worth notifying',
                                description: 'We have identified scratches/dents/damage that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'loose-ridging': {
                                title: 'Loose ridging loose/missing',
                                description: 'We have identified loose/missing ridging/fixings that have come to the attention of our technician. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
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
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'loose-screws-nails': {
                                title: 'Loose screws/nails isolated',
                                description: 'We have identified a specific area of concern for missing/ damaged roof fixings on your roof. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'rivet-fixings': {
                                title: 'Rivet fixings',
                                description: 'We have identified a specific area of concern for missing/ damaged roof rivet fixings on your roof. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
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
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'penetration-flashing-loose': {
                                title: 'Penetration flashing loose',
                                description: 'Penetration flashing loose/damaged. We recommend replacement or repair. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'penetration-flashing-missing': {
                                title: 'Penetration flashing missing/damaged',
                                description: 'Penetration flashing loose/damaged. We recommend replacement or repair. We recommend urgent remedial works to be carried out for this concern as water ingress is likely to enter the property. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
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
            'trapezio-metal': {
                name: 'Trapezio Metal Roofing (5rib)',
                sections: {
                    // Same structure as corrugated-metal but can have different specific details
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
                            }
                        },
                        specificConcerns: {
                            'rust-holes': {
                                title: 'Rust holes present',
                                description: 'We have identified a specific area of concern for rust damage on your roof sheeting. Potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            }
                        }
                    }
                }
            },
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
                            'rust-holes': {
                                title: 'Rust holes present',
                                description: 'We have identified a specific area of concern for rust damage on your roof metal tiling. This is a potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'scratches-dents': {
                                title: 'Scratches/dents/dings worth notifying',
                                description: 'We have identified scratches/dents/damage that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
                                ]
                            },
                            'damaged-sheet': {
                                title: 'Damaged sheet',
                                description: 'We have identified damaged metal tiling that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'amount', type: 'number', label: 'Amount' },
                                    { name: 'length', type: 'number', label: 'Length', step: 0.1 }
                                ]
                            },
                            'loose-sheeting': {
                                title: 'Loose sheeting loose/missing',
                                description: 'We have identified loose/missing roof metal tiling that have come to the attention of our technician. We recommend a repair to be carried out for this concern Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'subject', type: 'text', label: 'Optional extra subject' },
                                    { name: 'comments', type: 'textarea', label: 'Comments/explanation' }
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
                                title: 'Damaged roof tiles',
                                description: 'We have identified a specific area/s of concern for damaged tiles on your roof tiling. This is a potential water entry point. We recommend a repair to be carried out for this concern. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'tileCount', type: 'number', label: 'Number of damaged tiles' }
                                ]
                            },
                            'missing-slipped-tiles': {
                                title: 'Missing /slipped tiles',
                                description: 'We have identified slipped/missing tiles that have come to the attention of our technician. Please advise if you would like to pursue a recommendation for this repair.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true },
                                    { name: 'tileCount', type: 'number', label: 'Number of missing/slipped tiles' }
                                ]
                            },
                            'moss-isolated': {
                                title: 'Moss and mold isolated',
                                description: 'We have identified area/s with moss and mold present. Moss and mold on your concrete roof is commonly an underestimated concern. Moss and mold grows on your roof especially in places that get a lot of shade and moisture, this will be causing your tiles to become porous & weak. We advise roof moss removal treatments and follow ups every 2 years to ensure your roof condition is well maintained.',
                                fields: [
                                    { name: 'photos', type: 'file', label: 'Photos', required: true, multiple: true }
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

// Generate report using exact text from txt file
function generateReport(formData) {
    let reportHTML = '<div class="report-date">Report Generated: ' + new Date().toLocaleDateString() + '</div>';
    
    // Property Information
    reportHTML += `
        <div class="report-section">
            <h3>Property Information</h3>
            <p><strong>Roof Pitch:</strong> ${formData.get('roofPitch')}°</p>
            <p><strong>Number of Levels:</strong> ${formData.get('levels')}</p>
        </div>
    `;
    
    // 1. Roof Type and Condition
    const roofType = formData.get('roofType');
    const subType = formData.get('subType');
    const section = formData.get('section');
    const overallCondition = formData.get('overallCondition');
    const geometry = formData.get('geometry');
    
    if (roofType && roofData[roofType]) {
        reportHTML += `
            <div class="report-section">
                <h3>1. ${roofData[roofType].name}</h3>
                <p><strong>Roof Geometry:</strong> ${geometry ? geometry.replace('-', ' ').toUpperCase() : 'Not specified'}</p>
        `;
        
        if (roofType === 'asbestos') {
            reportHTML += `
                <h4>Assessment</h4>
                <p><strong>Recommendation:</strong> <span class="condition-poor">Quote For Replacement</span></p>
                <p>Asbestos roofing requires professional assessment and replacement. Please contact us for a replacement quote.</p>
            `;
        } else if (subType && section && overallCondition && 
                   roofData[roofType].subTypes[subType] && 
                   roofData[roofType].subTypes[subType].sections[section] && 
                   roofData[roofType].subTypes[subType].sections[section].overallConditions[overallCondition]) {
            
            const subTypeData = roofData[roofType].subTypes[subType];
            const sectionData = subTypeData.sections[section];
            const conditionData = sectionData.overallConditions[overallCondition];
            
            reportHTML += `
                <p><strong>Sub Type:</strong> ${subTypeData.name}</p>
                <h4>${sectionData.title}</h4>
                <p><strong>Overall Condition:</strong> <span class="${getConditionClass(overallCondition)}">${conditionData.title}</span></p>
                <p>${conditionData.description}</p>
            `;
        }
        
        reportHTML += '</div>';
        
        // 2. Specific Concerns (if any selected) - using exact text from txt file
        const specificConcerns = formData.getAll('specificConcerns');
        if (specificConcerns.length > 0 && subType && section && 
            roofData[roofType].subTypes[subType] && 
            roofData[roofType].subTypes[subType].sections[section]) {
            reportHTML += `
                <div class="report-section">
                    <h3>2. Specific Concerns Isolated</h3>
            `;
            
            const sectionData = roofData[roofType].subTypes[subType].sections[section];
            specificConcerns.forEach(concernKey => {
                if (sectionData.specificConcerns && sectionData.specificConcerns[concernKey]) {
                    const concern = sectionData.specificConcerns[concernKey];
                    reportHTML += `
                        <div class="concern-report">
                            <h4>${concern.title}</h4>
                            <p>${concern.description}</p>
                        </div>
                    `;
                }
            });
            
            reportHTML += '</div>';
        }
    }
    
    // 3. Additional Roofing Items
    const additionalItems = formData.getAll('additionalItems');
    if (additionalItems.length > 0) {
        reportHTML += `
            <div class="report-section">
                <h3>3. Additional Roofing Items</h3>
        `;
        
        additionalItems.forEach(item => {
            const itemName = item.replace('-', ' ').toUpperCase();
            const qty = formData.get(`${item}-qty`);
            const comments = formData.get(`${item}-comments`);
            const subject = item === 'other' ? formData.get('other-subject') : '';
            
            reportHTML += `
                <div class="item-report">
                    <h4>${subject ? subject : itemName}</h4>
                    ${qty ? `<p><strong>Quantity:</strong> ${qty}</p>` : ''}
                    ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
                </div>
            `;
        });
        
        reportHTML += '</div>';
    }
    
    return reportHTML;
}

// Event listeners
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const reportHTML = generateReport(formData);
    
    reportContent.innerHTML = reportHTML;
    reportOutput.style.display = 'block';
    reportOutput.scrollIntoView({ behavior: 'smooth' });
});

clearFormBtn.addEventListener('click', function() {
    form.reset();
    reportOutput.style.display = 'none';
    
    // Hide all sections
    document.getElementById('subTypeGroup').style.display = 'none';
    document.getElementById('asbestosMessage').style.display = 'none';
    document.getElementById('sectionGroup').style.display = 'none';
    document.getElementById('overallConditionGroup').style.display = 'none';
    document.getElementById('specificConcernsGroup').style.display = 'none';
    document.getElementById('conditionPhotoGroup').style.display = 'none';
    document.getElementById('concernDetailsSection').style.display = 'none';
    document.getElementById('additionalItemsSection').style.display = 'none';
    
    // Hide all additional item details
    document.querySelectorAll('.item-details').forEach(details => {
        details.style.display = 'none';
    });
});

printReportBtn.addEventListener('click', function() {
    window.print();
});

exportPDFBtn.addEventListener('click', function() {
    alert('PDF export functionality would be implemented here using a library like jsPDF or Puppeteer.');
});

// Main application initialization function
function initializeRoofReportApp() {
    setupRoofTypeHandler();
    setupSectionRemovalButtons();
    setupApplicabilityToggles();
    setupAdditionalItems();
    setupFormSubmission();
    setupSectionRestoration();
    setupSpoutingDownpipeDropdowns();
    setupHealthSafetyDropdown();
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

            // Reset removed sections when changing roof types
            removedSections = [];
            updateRestoreOptions();

            // Show only relevant sections for this roof type/subtype
            showRelevantSections(selectedRoofType, selectedSubType);

            // Populate section dropdowns
            populateAllSectionDropdowns();

            // Populate spouting type options based on roof type
            if (window.populateSpoutingTypeOptions) {
                window.populateSpoutingTypeOptions();
            }
        } else {
            sectionsContainer.style.display = 'none';
        }
    });
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

    const sections = selectedSubTypeData.sections;
    console.log('Populating dropdowns for', dataRoofType, '->', subType, '- Found', Object.keys(sections).length, 'sections');

    // Populate each section's dropdowns
    Object.keys(sections).forEach(sectionKey => {
        const section = sections[sectionKey];
        console.log('Populating section:', sectionKey, section.title);
        populateSectionDropdowns(sectionKey, section);
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
                concern.fields.forEach(field => {
                    const fieldGroup = document.createElement('div');

                    const fieldLabel = document.createElement('label');
                    fieldLabel.textContent = field.label + (field.required ? ' *' : '');

                    let fieldInput;

                    if (field.type === 'file') {
                        fieldInput = document.createElement('input');
                        fieldInput.type = 'file';
                        fieldInput.name = `${elementIds.concernsSelect}_${concernKey}_${field.name}`;
                        fieldInput.accept = field.name === 'photos' ? 'image/*' : '';
                        if (field.multiple) {
                            fieldInput.multiple = true;
                        }
                    } else if (field.type === 'textarea') {
                        fieldInput = document.createElement('textarea');
                        fieldInput.name = `${elementIds.concernsSelect}_${concernKey}_${field.name}`;
                        fieldInput.rows = 3;
                        fieldInput.placeholder = field.label;
                    } else if (field.type === 'number') {
                        fieldInput = document.createElement('input');
                        fieldInput.type = 'number';
                        fieldInput.name = `${elementIds.concernsSelect}_${concernKey}_${field.name}`;
                        fieldInput.placeholder = field.label;
                        if (field.step) {
                            fieldInput.step = field.step;
                        }
                    } else {
                        fieldInput = document.createElement('input');
                        fieldInput.type = 'text';
                        fieldInput.name = `${elementIds.concernsSelect}_${concernKey}_${field.name}`;
                        fieldInput.placeholder = field.label;
                    }

                    if (field.required) {
                        fieldInput.required = false; // Don't enforce until checkbox is checked
                    }

                    fieldGroup.appendChild(fieldLabel);
                    fieldGroup.appendChild(fieldInput);
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
function populateSpecificConcernsSection(roofType, subType) {
    const specificConcernsSection = document.getElementById('specificConcernsSection');
    const allSpecificConcernsContainer = document.getElementById('allSpecificConcerns');

    if (!specificConcernsSection || !allSpecificConcernsContainer) return;

    // Map roof types to their data structure equivalents
    let dataRoofType = roofType;
    if (roofType === 'concrete-tile' || roofType === 'clay-tile') {
        dataRoofType = 'tile';
    }

    // Get the roof type data
    const roofTypeData = roofData[dataRoofType];
    if (!roofTypeData || !roofTypeData.subTypes[subType]) {
        specificConcernsSection.style.display = 'none';
        return;
    }

    // Get all sections for this subtype
    const sections = roofTypeData.subTypes[subType].sections;

    // Clear existing concerns
    allSpecificConcernsContainer.innerHTML = '';

    // Collect all specific concerns from all sections
    let concernsCount = 0;

    Object.keys(sections).forEach(sectionKey => {
        const section = sections[sectionKey];

        if (section.specificConcerns && Object.keys(section.specificConcerns).length > 0) {
            // Add section heading
            const sectionHeading = document.createElement('div');
            sectionHeading.style.marginTop = concernsCount > 0 ? '20px' : '0';
            sectionHeading.style.marginBottom = '10px';
            sectionHeading.innerHTML = `<strong>${section.title}</strong>`;
            allSpecificConcernsContainer.appendChild(sectionHeading);

            // Add concerns for this section
            Object.keys(section.specificConcerns).forEach(concernKey => {
                const concern = section.specificConcerns[concernKey];

                const concernItem = document.createElement('div');
                concernItem.className = 'concern-item';
                concernItem.style.marginBottom = '8px';

                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'flex-start';
                label.style.cursor = 'pointer';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `specificConcern_${sectionKey}_${concernKey}`;
                checkbox.value = concernKey;
                checkbox.id = `specificConcern_${sectionKey}_${concernKey}`;
                checkbox.style.marginRight = '8px';
                checkbox.style.marginTop = '2px';

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(concern.title));

                concernItem.appendChild(label);
                allSpecificConcernsContainer.appendChild(concernItem);

                concernsCount++;
            });
        }
    });

    // Show the specific concerns section
    if (concernsCount > 0) {
        specificConcernsSection.style.display = 'block';
    } else {
        specificConcernsSection.style.display = 'none';
    }
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
    });
    
    // Clear form functionality
    const clearBtn = document.getElementById('clearForm');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            form.reset();
            reportOutput.style.display = 'none';
            
            // Hide all sections initially
            document.querySelectorAll('.section-card').forEach(section => {
                section.style.display = 'none';
                section.setAttribute('data-disabled', 'false');
            });
            
            // Reset applicable toggles
            document.querySelectorAll('.applicable-toggle input[type="checkbox"]').forEach(toggle => {
                toggle.checked = true;
            });
            
            // Hide sub-type group and sections container
            document.getElementById('subTypeGroup').style.display = 'none';
            document.getElementById('asbestosMessage').style.display = 'none';
            document.getElementById('roofSectionsContainer').style.display = 'none';
            
            // Clear additional items
            clearAllAdditionalItems();
            
            // Reset removed sections tracking
            removedSections = [];
            updateRestoreOptions();
            
            // Reset spouting and downpipe dropdowns
            document.getElementById('spoutingSubTypeGroup').style.display = 'none';
            document.getElementById('downpipeSubTypeGroup').style.display = 'none';
        });
    }
}

// Generate the roof report
function generateReport() {
    const formData = new FormData(document.getElementById('roofReportForm'));
    const reportContent = document.getElementById('reportContent');
    
    let reportHTML = '<div class="report-sections">';
    
    // Property Information
    reportHTML += generatePropertySection(formData);
    
    // Roof Type Information
    reportHTML += generateRoofTypeSection(formData);
    
    // Section Reports
    reportHTML += generateSectionReports(formData);
    
    // Additional Items
    reportHTML += generateAdditionalItemsSection(formData);
    
    reportHTML += '</div>';
    
    reportContent.innerHTML = reportHTML;
}

// Generate property information section
function generatePropertySection(formData) {
    const pitch = formData.get('roofPitch');
    const levels = formData.get('levels');
    const geometry = formData.get('geometry');
    
    return `
        <div class="report-section">
            <h3>Property Information</h3>
            <p><strong>Roof Pitch:</strong> ${pitch}°</p>
            <p><strong>Number of Levels:</strong> ${levels}</p>
            <p><strong>Roof Geometry:</strong> ${geometry?.replace('-', ' ') || 'Not specified'}</p>
        </div>
    `;
}

// Generate roof type section
function generateRoofTypeSection(formData) {
    const roofType = formData.get('roofType');
    const subType = formData.get('subType');
    
    if (!roofType) return '';
    
    const roofTypeName = roofData[roofType]?.name || roofType;
    const subTypeName = roofData[roofType]?.subTypes[subType]?.name || subType;
    
    return `
        <div class="report-section">
            <h3>Roof Type</h3>
            <p><strong>Primary Type:</strong> ${roofTypeName}</p>
            ${subType ? `<p><strong>Sub Type:</strong> ${subTypeName}</p>` : ''}
        </div>
    `;
}

// Generate section reports
function generateSectionReports(formData) {
    // This would contain the logic to generate detailed reports for each section
    // For now, returning a placeholder
    return `
        <div class="report-section">
            <h3>Detailed Section Reports</h3>
            <p>Detailed section reports will be generated based on the selected conditions and concerns.</p>
        </div>
    `;
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

// Setup Health and Safety dropdown with conditional "Other" text field
function setupHealthSafetyDropdown() {
    const healthSafetySelect = document.getElementById('healthSafety');
    const healthSafetyOtherGroup = document.getElementById('healthSafetyOtherGroup');

    if (healthSafetySelect && healthSafetyOtherGroup) {
        healthSafetySelect.addEventListener('change', function() {
            if (this.value === 'other') {
                healthSafetyOtherGroup.style.display = 'block';
            } else {
                healthSafetyOtherGroup.style.display = 'none';
            }
        });
    }
}