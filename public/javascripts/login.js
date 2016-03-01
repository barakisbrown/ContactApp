$(function () {

    var email = Cookies.get('email');

    if (typeof email != 'undefined') {
        // COOKIE DOES EXIST
        console.log('Cookie with name[email] exist');
        $("#email-input").val(email);
        $("#remember").prop('checked', true);
    }

    // COOKIE DOES NOT EXIST
    $("#submitBtn").click(function() {

        var email = $('#email-input').val();
        var passw = $('#password-input').val();
        console.log("Password = ", passw);
        // VALIDATE FORM
        if (validateForm(email,passw)) {

            // VALIDATION SUCCESS
            // DETERMINE IF WE NEED TO SAVE THE EMAIL IN A COOKIE
            if ($('#remember').is(":checked")) {

                email = $('#email-input').val();
                Cookies.set('email',email);
            }
            // CREATE COOKIE SO THAT THE APP PAGE KNOWS ITS OKAY TO DISPLAY
            Cookies.set('isValid',true);
            $('form').unbind('submit').submit();
        } else {
            return false;
        }
    });

    // THE FOLLOWING BUTTONS ARE NOT YET IMPLEMENTED
    $(".register").click(function() { alert("Not Implemented");})
    $(".forgot").click(function() { alert("Not Implemented"); });

    // way to validate the form
    function validateForm(e,p) {

        var rtnValue = true;
        if ((e == null)||(e != "demo@example.com")) {
            alert("Email is required");
            rtnValue = false;
        }
        if ((p == null)||(p != "demo")) {
            alert("Password is invalid");
            rtnValue = false;
        }
        return rtnValue;
    }
});