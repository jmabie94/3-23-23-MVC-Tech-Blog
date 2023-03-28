const logForm = document.getElementById('login-form');
const signForm = document.getElementById('signup-form');
const statusEl = document.getElementById('status');

const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        statusEl.textContent = 'Incorrect Email or Password';
        statusEl.style.color = 'red';
        setTimeout(() => {
          statusEl.textContent = 'Fill in all required values';
          statusEl.style.color = 'black';
        }, 2500);
      }
    }
};

logForm.addEventListener('submit', loginFormHandler);
/* signForm.addEventListener('submit', loginFormHandler); */