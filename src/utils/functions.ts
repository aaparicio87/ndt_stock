import { getAllCertificates } from "../services";

function generateRandomPassword (name:string, lastName:string) {
    const formattedName = capitalizeFirstLetter(name);
    const formattedSurname = capitalizeFirstLetter(lastName);

    return `${formattedName}${formattedSurname}123*`;
}

function capitalizeFirstLetter(text:string) {
    if (!text) return ''; // Manejo de caso vacío
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const timeToMinutes = (time: string ): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Convert a Date object to minutes since midnight
const timeDateToMinutes = (date: Date) => {
    return date.getHours() * 60 + date.getMinutes();
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
};

const calculateEventDuration = (start: Date, end: Date) => {
    let startMinutes = timeDateToMinutes(start);
    let endMinutes = timeDateToMinutes(end);

    // If the event crosses midnight, adjust the end time
    if (endMinutes < startMinutes) {
        endMinutes += 1440; // 1440 minutes = 24 hours
    }

    return endMinutes - startMinutes;
};

const getNameCertificate = (name:string, level:TLevelKey) => {
    const number = level.split('_').at(1)
    return `${name}${number}`
}


const handleGetCertificates = async() => {
    try {
        const certificates = await getAllCertificates()
        if(certificates){
            return certificates
            .filter((li) => li.uid !== undefined)
            .map((res) => {
               return res.levels.map((level) =>{
                const levelName = getNameCertificate(res.name, level.uid)
                return { label: level.uid === 'level_1'? res.name : levelName , value: res.uid ?? ''}
               }) 
            })
            .reduce((acc, curr) => acc.concat(curr), []);
        }
    } catch (error) {
        throw new Error((error as Error).message)
    }
}




 export {
    generateRandomPassword,
     timeToMinutes,
     handleKeyDown,
     capitalizeFirstLetter,
     calculateEventDuration,
     handleGetCertificates
 }
