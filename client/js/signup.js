
    // Regex Patterns
    const fullnameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^0[567]\d{8}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validation Flags
    let fullnameValid = true;
    let emailValid = true;
    let phoneValid = true;
    let passwordValid = true;
    let confirmPasswordValid = true;

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
    $("#fullname").on("input", function() {
        const fullname = $(this).val();
        if (!fullnameRegex.test(fullname) && fullname) {
            $("#err-fullname").show();
            fullnameValid = false;
        } else {
            $("#err-fullname").hide();
            fullnameValid = true;
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

    $("#phone").on("input", function() {
        const phone = $(this).val().replace(/\s/g, '');
        if (!phoneRegex.test(phone) && phone) {
            $("#err-phone").show();
            phoneValid = false;
        } else {
            $("#err-phone").hide();
            phoneValid = true;
        }
        // Auto-format phone number
        if(phone.length > 2 && phone.length <= 10) {
            $(this).val(phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5'));
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
        // Trigger confirmation check
        if($("#confirm-password").val()) {
            $("#confirm-password").trigger("input");
        }
    });

    $("#confirm-password").on("input", function() {
        const confirmPassword = $(this).val();
        if (confirmPassword !== $("#password").val()) {
            $("#err-confirm-password").show();
            confirmPasswordValid = false;
        } else {
            $("#err-confirm-password").hide();
            confirmPasswordValid = true;
        }
    });

    // Form Submission
    $("#signupForm").on("submit", function(event) {
        event.preventDefault();
        
        const fullname = $("#fullname").val();
        const email = $("#email").val();
        const phone = $("#phone").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirm-password").val();

        // Trigger all validations
        $("#fullname").trigger("input");
        $("#email").trigger("input");
        $("#phone").trigger("input");
        $("#password").trigger("input");
        $("#confirm-password").trigger("input");

        // General Error (Missing Fields)
        if (!fullname || !email || !phone || !password || !confirmPassword) {
            $("#err-general").show();
            return;
        } else {
            $("#err-general").hide();
        }

        // Detailed Validation
        if (fullnameValid && emailValid && phoneValid && passwordValid && confirmPasswordValid) {
            // Save to sessionStorage
            sessionStorage.setItem('signupFullname', fullname);
            sessionStorage.setItem('signupEmail', email);
            sessionStorage.setItem('signupPhone', phone);
            
            // Success Action
            alert("Compte créé avec succès !");
            window.location.href = "login.html"; // Redirect to login
        }
    });

    // Load saved data if available
    $(document).ready(function() {
        if (sessionStorage.getItem('signupFullname')) {
            $("#fullname").val(sessionStorage.getItem('signupFullname'));
        }
        if (sessionStorage.getItem('signupEmail')) {
            $("#email").val(sessionStorage.getItem('signupEmail'));
        }
        if (sessionStorage.getItem('signupPhone')) {
            $("#phone").val(sessionStorage.getItem('signupPhone'));
        }
    });
