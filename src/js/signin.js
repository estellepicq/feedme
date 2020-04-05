watchSigninForm('foodList');
watchSigninForm('fodmapsRecipes');

function watchSigninForm(currentForm) {
  var signinFormContainer = document.getElementById(currentForm + 'SigninFormContainer');
  var signinBtn = document.getElementById(currentForm + 'SigninBtn');
  var signinEmailInput = document.getElementById(currentForm + 'SigninEmail');
  var signinErrorMessage = document.getElementById(currentForm + 'SigninErrorMessage');
  var signinSuccessMessage = document.getElementById(currentForm + 'SigninSuccessMessage');

  if (signinFormContainer) {
    signinEmailInput.addEventListener('keyup', function() {
      setBtnState(signinBtn, signinEmailInput.value);
    });

    signinBtn.addEventListener('click', function() {
      var requiredDoc = signinBtn.getAttribute('data-requiredDoc');
      signIn(signinEmailInput.value, requiredDoc, signinBtn, signinFormContainer, signinErrorMessage, signinSuccessMessage);
    });
  }
}

function setBtnState(signinBtn, emailValue) {
  signinBtn.disabled = !emailValue || !Ch.isEmail(emailValue);
}

function signIn(email, requiredDoc, signinBtn, signinFormContainer, signinErrorMessage, signinSuccessMessage) {
  signinBtn.disabled = true;
  
  Aias.HTTP.POST('/signin', 'json', { email, requiredDoc })
    .then(function(response) {
      if (response.success) {
        signinFormContainer.style.display = 'none';
        signinSuccessMessage.style.display = 'block';
      } else {
        signinErrorMessage.style.display = 'block';
      }
    })
    .catch(function(_error) {
      signinErrorMessage.style.display = 'block';
      signinBtn.disabled = false;
    });
}