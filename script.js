// ===========================
// FORM VALIDATION RULES
// ===========================

const validationRules = {
    firstName: {
        validate: (value) => value.trim().length >= 2,
        message: 'First name must be at least 2 characters long'
    },
    lastName: {
        validate: (value) => value.trim().length >= 2,
        message: 'Last name must be at least 2 characters long'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    phone: {
        validate: (value) => /^[\d\s\-\(\)\+]{10,}$/.test(value.replace(/\s/g, '')),
        message: 'Please enter a valid phone number'
    },
    dob: {
        validate: (value) => {
            if (!value) return false;
            const birthDate = new Date(value);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            return age >= 16;
        },
        message: 'You must be at least 16 years old'
    },
    studentId: {
        validate: (value) => value.trim().length >= 3,
        message: 'Student ID must be at least 3 characters long'
    },
    program: {
        validate: (value) => value !== '',
        message: 'Please select a program of study'
    },
    level: {
        validate: (value) => value !== '',
        message: 'Please select an academic level'
    },
    gpa: {
        validate: (value) => {
            const gpa = parseFloat(value);
            return value !== '' && gpa >= 0 && gpa <= 4;
        },
        message: 'GPA must be between 0 and 4.0'
    },
    address: {
        validate: (value) => value.trim().length >= 5,
        message: 'Please enter a valid address'
    },
    city: {
        validate: (value) => value.trim().length >= 2,
        message: 'Please enter a valid city'
    },
    state: {
        validate: (value) => value.trim().length >= 2,
        message: 'Please enter a valid state'
    },
    zip: {
        validate: (value) => /^\d{5}(-\d{4})?$/.test(value),
        message: 'Please enter a valid zip code (e.g., 10001 or 10001-1234)'
    },
    terms: {
        validate: (value) => value === true,
        message: 'You must agree to the terms and conditions'
    }
};

// ===========================
// FORM INITIALIZATION
// ===========================

const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

// Add event listeners to form
form.addEventListener('submit', handleFormSubmit);
form.addEventListener('reset', handleFormReset);

// Add real-time validation
const formInputs = form.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('change', validateField);
});

// ===========================
// VALIDATION FUNCTIONS
// ===========================

function validateField(event) {
    const field = event.target;
    const fieldName = field.name;
    const fieldValue = field.type === 'checkbox' ? field.checked : field.value;

    if (!validationRules[fieldName]) {
        return true;
    }

    const rule = validationRules[fieldName];
    const isValid = rule.validate(fieldValue);

    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');

    if (!isValid) {
        formGroup.classList.add('invalid');
        field.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = rule.message;
        }
        return false;
    } else {
        formGroup.classList.remove('invalid');
        field.classList.remove('error');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
        return true;
    }
}

function validateForm() {
    let isFormValid = true;

    formInputs.forEach(input => {
        const fieldName = input.name;
        if (validationRules[fieldName]) {
            const event = { target: input };
            if (!validateField(event)) {
                isFormValid = false;
            }
        }
    });

    return isFormValid;
}

// ===========================
// FORM SUBMISSION
// ===========================

function handleFormSubmit(event) {
    event.preventDefault();

    // Validate entire form
    if (!validateForm()) {
        showNotification('Please fix the errors above', 'error');
        return;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Log the data (in a real application, this would be sent to a server)
    console.log('Form submitted with data:', data);

    // Show success message
    showSuccessMessage();

    // Optional: Reset form after 3 seconds
    setTimeout(() => {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
    }, 500);
}

function handleFormReset() {
    // Clear all error messages and error states
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('invalid');
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.classList.remove('error');
        }
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
}

function showSuccessMessage() {
    // Get form data for confirmation
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const email = formData.get('email');

    console.log(`Registration successful for ${firstName} (${email})`);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// ===========================
// PHONE NUMBER FORMATTING
// ===========================

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', formatPhoneNumber);
}

function formatPhoneNumber(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }

    input.value = value;
}

// ===========================
// PAGE LOAD ANIMATION
// ===========================

window.addEventListener('load', () => {
    form.style.opacity = '0';
    form.style.transform = 'translateY(10px)';

    setTimeout(() => {
        form.style.transition = 'all 0.5s ease-out';
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
    }, 100);
});

// ===========================
// PREVENT FORM SUBMISSION ON ENTER
// (except in textarea)
// ===========================

form.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
    }
});