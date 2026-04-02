document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');
    const btnLogin = document.getElementById('btn-login');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            btnLogin.disabled = true;
            errorMsg.style.display = 'none';

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (res.ok && data.ok) {
                    window.location.href = '/dashboard.html';
                } else {
                    throw new Error(data.error || 'Credenciales incorrectas');
                }
            } catch (err) {
                errorMsg.textContent = err.message;
                errorMsg.style.display = 'block';
                btnLogin.innerHTML = '<span>Ingresar</span><i class="fas fa-arrow-right"></i>';
                btnLogin.disabled = false;
            }
        });
    }

    // Verify session on protected pages
    if (window.location.pathname.includes('dashboard.html')) {
        verifySession();
    }
});

async function verifySession() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        
        if (!res.ok || !data.ok) {
            window.location.href = '/';
            return;
        }
        
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) {
            userDisplay.textContent = data.user;
        }
        
    } catch (e) {
        window.location.href = '/';
    }
}

// Handle logout
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (e) {
            console.error('Error logging out', e);
        }
    });
}
