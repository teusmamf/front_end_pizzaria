document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('http://18.218.255.177:8080/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed!');
        }
        return response.json();
    })
    .then(data => {
        // Assuming the API returns a token
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    })
    .catch(error => {
        document.getElementById("error-message").textContent = error.message;
    });
});
