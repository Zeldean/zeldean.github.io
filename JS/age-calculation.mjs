/**
 * Calculates your age based on your date of birth (dob)
 * @param {Date} dob Date of birth.
 * @returns {number} Your current age. 
 */
export function calculateAge(dob) {
    // if (!(dob instanceof Date)) {
    //     throw new Error('Invalid date of birth');
    // }

    const today = new Date();
    const birthDate = new Date(dob); // Create a copy of the dob date
        
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age based on month and day
    if ( today.getMonth() < birthDate.getMonth() || (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate()) ) {
        age--;
    };

    return age;
};