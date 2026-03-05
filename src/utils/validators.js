// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation (Indian format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

// Password validation (min 6 chars, at least 1 number, 1 letter)
export const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
};

// Name validation
export const isValidName = (name) => {
    return name && name.length >= 2 && name.length <= 50;
};

// Age validation
export const isValidAge = (age) => {
    return age && age >= 0 && age <= 150;
};

// Pincode validation (Indian)
export const isValidPincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

// URL validation
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Form validation schemas
export const validateLoginForm = (data) => {
    const errors = {};
    
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Invalid email format';
    }
    
    if (!data.password) {
        errors.password = 'Password is required';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateRegisterForm = (data) => {
    const errors = {};
    
    // Name validation
    if (!data.name) {
        errors.name = 'Name is required';
    } else if (!isValidName(data.name)) {
        errors.name = 'Name must be between 2 and 50 characters';
    }
    
    // Email validation
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    } else if (!isStrongPassword(data.password)) {
        errors.password = 'Password must contain at least one letter and one number';
    }
    
    // Confirm password
    if (!data.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone validation (optional)
    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = 'Invalid phone number (10 digits starting with 6-9)';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};