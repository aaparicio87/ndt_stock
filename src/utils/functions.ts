
function generateRandomPassword (name:string, lastName:string) {
    const formattedName = capitalizeFirstLetter(name);
    const formattedSurname = capitalizeFirstLetter(lastName);

    return `${formattedName}${formattedSurname}123*`;
}

function capitalizeFirstLetter(text:string) {
    if (!text) return ''; // Manejo de caso vacío
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};


 export {
    generateRandomPassword,
     timeToMinutes,
 }
