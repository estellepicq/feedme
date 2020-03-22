var signinFormContainer = document.getElementById('signinFormContainer');
var signinBtn = document.getElementById('signinBtn');
var signinEmailInput = document.getElementById('signinEmail');
var signinErrorMessage = document.getElementById('signinErrorMessage');
var signinSuccessMessage = document.getElementById('signinSuccessMessage');

signinEmailInput.addEventListener('keyup', function() {
  setBtnState();
});

signinBtn.addEventListener('click', function() {
  signIn(signinEmailInput.value, 'foodlist');
});

function setBtnState() {
  signinBtn.disabled = !signinEmailInput.value || !Ch.isEmail(signinEmailInput.value);
}

function signIn(email, requiredDoc) {
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
    .catch(function(err) {
      signinErrorMessage.style.display = 'block';
    });
}