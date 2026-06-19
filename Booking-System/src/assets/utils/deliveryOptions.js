export const deliveryOption = [
    { municipality: 'Bacoor', fee: 1002 },
    { municipality: 'Cavite City', fee: 1002 },
    { municipality: 'Dasmariñas', fee: 1002 },
    { municipality: 'General Trias', fee: 1003 },
    { municipality: 'Imus', fee: 1003 },
    { municipality: 'Tagaytay', fee: 1003 },
    { municipality: 'Trece Martires', fee: 1004 },
    { municipality: 'General Mariano Alvarez', fee: 1004 },
    { municipality: 'Alfonso', fee: 1004 },
    { municipality: 'Amadeo', fee: 1010 },
    { municipality: 'Kawit', fee: 1010 },
    { municipality: 'Tanza', fee: 1010 },
    { municipality: 'Indang', fee: 1011 },
    { municipality: 'Mendez', fee: 1012 },
    { municipality: 'Naic', fee: 1013 },
    { municipality: 'Noveleta', fee: 1014 },
    { municipality: 'Rosario', fee: 1015 },
    { municipality: 'Silang', fee: 1016 },
    { municipality: 'Magallanes', fee: 1017 },
    { municipality: 'Maragondon', fee: 1018 },
    { municipality: 'Ternate', fee: 1019 },
    { municipality: 'Gen. Emilio Aguinaldo', fee: 1020 },
];


export const  MunicipalityOptions = () => {
    return deliveryOption.map(option => `<option value="${option.municipality}">${option.municipality} (${option.fee})</option>`).join('');
}

export const getDeliveryFee = (municipalityName) => {
    if (!municipalityName) return null;

    const lowerInput = municipalityName.toLowerCase();

    const option = deliveryOption.find((item) => {
        const lowerMunicipality = item.municipality.toLowerCase();

        return lowerInput.includes(lowerMunicipality) || lowerMunicipality.includes(lowerInput);
    });

    return option ? option.fee : null;
};