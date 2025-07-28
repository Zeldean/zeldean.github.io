/**
 * Calculates your age based on your date of birth (dob)
 * @param {Date|string} dob Date of birth.
 * @returns {number} Your current age. 
 */
export function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
}
