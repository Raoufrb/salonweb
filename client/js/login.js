// Regex Patterns (Same as Your Existing Validation)
const usernameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+$/;  // Firstname Lastname format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Strong password

// Validation Flags
let usernameValid = true;
let emailValid = true;
let passwordValid = true;

// Password toggle visibility
    $('#togglePassword').click(function(){
        const password = $('#password');
        const icon = $(this).find('i');
        if(password.attr('type') === 'password'){
            password.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            password.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

// Real-time Validation
$("#username").on("input", function() {
    const username = $(this).val();
    if (!usernameRegex.test(username) && username) {
        $("#err-username").show();
        usernameValid = false;
    } else {
        $("#err-username").hide();
        usernameValid = true;
    }
});

$("#email").on("input", function() {
    const email = $(this).val();
    if (!emailRegex.test(email) && email) {
        $("#err-email").show();
        emailValid = false;
    } else {
        $("#err-email").hide();
        emailValid = true;
    }
});

$("#password").on("input", function() {
    const password = $(this).val();
    if (!passwordRegex.test(password) && password) {
        $("#err-password").show();
        passwordValid = false;
    } else {
        $("#err-password").hide();
        passwordValid = true;
    }
});

// Form Submission
$("#loginForm").on("submit", function(event) {
    event.preventDefault();
    
    const username = $("#username").val();
    const email = $("#email").val();
    const password = $("#password").val();

    // General Error (Missing Fields)
    if (!username || !email || !password) {
        $("#err-general").show();
        return;
    } else {
        $("#err-general").hide();
    }

    // Detailed Validation
    if (usernameValid && emailValid && passwordValid) {
        // Save to sessionStorage (like your existing logic)
        sessionStorage.setItem('loginUsername', username);
        sessionStorage.setItem('loginEmail', email);
        
        // Success Action (e.g., redirect or show message)
        alert("Connexion réussie !");
        window.location.href = "dashboard.html"; // Example redirect
    }
});

// Load Saved Data (if any)
if (sessionStorage.getItem('loginUsername')) {
    $("#username").val(sessionStorage.getItem('loginUsername'));
}
if (sessionStorage.getItem('loginEmail')) {
    $("#email").val(sessionStorage.getItem('loginEmail'));
}