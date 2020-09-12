// Contact
var contactFormContainer = document.getElementById('contactFormContainer');
var contactBtn = document.getElementById('contactBtn');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var messageInput = document.getElementById('message');
var errorMessage = document.getElementById('errorMessage');
var successMessage = document.getElementById('successMessage');

nameInput.addEventListener('keyup', function() {
  setBtnState();
});

emailInput.addEventListener('keyup', function() {
  setBtnState();
});

messageInput.addEventListener('keyup', function() {
  setBtnState();
});

contactBtn.addEventListener('click', function() {
  var contactBody = {
    name: nameInput.value,
    email: emailInput.value,
    message: messageInput.value,
    from: '[www.feedinggood.estellepicq.com]'
  };
  sendMail(contactBody);
});

function setBtnState() {
  contactBtn.disabled = !nameInput.value || !emailInput.value || !messageInput.value || !Ch.isEmail(emailInput.value);
}

function sendMail(contactBody) {
  contactBtn.disabled = true;
  Aias.HTTP.POST('/mail/send', 'json', contactBody)
    .then(function(response) {
      if (response.success) {
        contactFormContainer.style.display = 'none';
        successMessage.style.display = 'block';
      } else {
        errorMessage.style.display = 'block';
      }
    })
    .catch(function(_error) {
      errorMessage.style.display = 'block';
    });
}