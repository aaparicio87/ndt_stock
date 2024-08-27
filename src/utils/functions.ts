
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

const handleGetCertificates = (certificates: TCertificates[]) => {
        return certificates
                .filter((li) => li.uid !== undefined)
                .map((res) => {
                return res.levels.map((level) =>{
                    const levelName = getNameCertificate(res.name, level.uid)
                    const valueSelect = `${res.uid}-${level.uid}`
                    return { label: level.uid === 'level_1'? res.name : levelName , value: valueSelect}
                }) 
                })
                .reduce((acc, curr) => acc.concat(curr), []);
}

const getUserCertificatesName = (userCertifications: IUserCertificate[], certificates:TCertificates[] ) => {
    const result = userCertifications.reduce((res, userCert) => {
        const cert = certificates.find(c => c.uid === userCert.uid);
        
        if (cert) {
            const nombresConNivel = userCert.levels.map(level => {
                const levelIndex = cert.levels.findIndex(l => l.uid === level.uid);
                return levelIndex === 0 
                    ? cert.name  
                    : `${cert.name}${levelIndex + 1}`;
            });
            
            return res.concat(nombresConNivel);
        }
        
        return res;
    }, [] as string[]);

    return result
}

const getUserCertificatesEdit = (userCertifications: IUserCertificate[], certificates: TCertificates[]): TOptions[] => {
    return userCertifications.reduce((res, userCert) => {
        const cert = certificates.find(c => c.uid === userCert.uid);
        
        if (cert) {
            const options = userCert.levels.map(userLevel => {
                const levelIndex = cert.levels.findIndex(l => l.uid === userLevel.uid);
                if(levelIndex !== -1){
                    return {
                        label: levelIndex === 0 ? cert.name : `${cert.name}${levelIndex + 1}`,
                        value: `${userCert.uid}-${cert.levels[levelIndex].uid}`
                    };
                }
                return undefined; 
            }).filter((option) => option !== undefined) as TOptions[];

            return res.concat(options);
        }
        
        return res;
    }, [] as TOptions[]);
}


const handleThunkError = (error: unknown, rejectWithValue: (value: { message: string }) => any) => {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue({ message: 'Unknown error' });
};


 export {
    generateRandomPassword,
     timeToMinutes,
     handleKeyDown,
     capitalizeFirstLetter,
     calculateEventDuration,
     handleGetCertificates,
     handleThunkError,
     getUserCertificatesName,
     getUserCertificatesEdit
 }
 