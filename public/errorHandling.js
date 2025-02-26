


// alert("Hello");
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("login_error")) {
    if(urlParams.get("login_error")==="1"){
        document.getElementById("invalid_disp").textContent = "Invalid credentials";
    }
    else{
        document.getElementById("invalid_disp").textContent = "Account has been Blocked.Contact Admin";
    }

    

    
}


if (urlParams.has("psd_error")){
    if(urlParams.get("psd_error")==="1"){
        document.getElementById("invalid_disp").textContent = "Password Mismatched";
    }
    else if(urlParams.get("psd_error")==="2"){
        document.getElementById("invalid_disp").textContent = "New Password can't be the old password";
    }
}
