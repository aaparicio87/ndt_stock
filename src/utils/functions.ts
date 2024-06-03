import * as generatePassword from 'generate-password';

function generateRandomPassword () {
    return generatePassword.generate({
        length: 6,
        numbers: true,
        lowercase:true,
        uppercase:true,
        symbols:true
    });
}

 export {
    generateRandomPassword
 }
