document.addEventListener("DOMContentLoaded", function () {
    let form = document.querySelector('.contact-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let nameInput = document.querySelector('input[type="text"]');
        let emailInput = document.querySelector('input[type="email"]');
        let agreeCheckbox = document.getElementById('agree');

        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let isChecked = agreeCheckbox.checked;

        removeErrorMessages(nameInput);
        removeErrorMessages(emailInput);

        let errors = [];

        if (/\d/.test(name)) {
            errors.push('Name should not contain integers.');
        }

        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            errors.push('Invalid email address.');
        }

        if (!isChecked) {
            errors.push('Please agree to the terms.');
        }

        if (errors.length > 0) {
            errors.forEach(message => {
                displayErrorMessage(message);
            });
            return;
        }

        alert('Form submitted successfully!');
        form.reset();
    });

    function removeErrorMessages(input) {
        let errorMessages = input.parentNode.querySelectorAll('.error-message');
        errorMessages.forEach(errorMessage => {
            errorMessage.remove();
        });
    }

    function displayErrorMessage(message) {
        let errorMessage = document.createElement('p');
        errorMessage.textContent = message;
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        form.appendChild(errorMessage);
    }
});
