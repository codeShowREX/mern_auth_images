export const profileValidation = (values) => {
    const errors = {};

    // Name validation - only if name is being changed
    if (values.name && values.name.trim() === '') {
        errors.name = 'Name cannot be empty';
    }

    // Email validation - only if email is being changed
    if (values.email !== values.originalEmail) {
        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
    }

    // Password validation - only if changing password
    if (values.newPassword) {
        if (!values.currentPassword) {
            errors.currentPassword = 'Current password is required to change password';
        }
        if (values.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }
        if (values.newPassword !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
    }

    // Email change requires current password
    if (values.email !== values.originalEmail && !values.currentPassword) {
        errors.currentPassword = 'Current password is required to change email';
    }

    return errors;
}; 