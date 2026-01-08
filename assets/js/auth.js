// Mock Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  // Handle Email/Password Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (email && password) {
        // Mock successful login
        loginUser({ email: email, name: email.split('@')[0], type: 'email' });
      }
    });
  }

  // Social Login Buttons
  const googleBtn = document.getElementById('google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => mockLogin('google'));
  }

  const appleBtn = document.getElementById('apple-login-btn');
  if (appleBtn) {
    appleBtn.addEventListener('click', () => mockLogin('apple'));
  }

  // Signup Link
  const signupLink = document.getElementById('signup-link');
  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Sign up coming soon!');
    });
  }

  checkLoginStatus();
});

// Mock Social Login
function mockLogin(provider) {
  const mockUser = {
    name: provider === 'google' ? 'Google User' : 'Apple User',
    email: `user@${provider}.com`,
    type: provider
  };
  loginUser(mockUser);
}

function loginUser(user) {
  // Save user to localStorage
  localStorage.setItem('nomikai_user', JSON.stringify(user));

  // Show visual feedback
  const btn = document.querySelector('button[type="submit"]');
  if(btn) {
      const originalText = btn.innerText;
      btn.innerText = 'Signing in...';
      btn.disabled = true;

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
  } else {
      // Social login
       setTimeout(() => {
        window.location.href = '../index.html';
      }, 500);
  }
}

function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem('nomikai_user'));
  const navLinks = document.querySelector('.nav-links');

  if (user && navLinks) {
    // Check if "Sign In" link exists and replace it
    // Note: The structure varies slightly between pages (relative paths), so we look for the text content or href

    // We can't easily find the specific 'Sign In' link by selector alone if it doesn't have a unique ID.
    // Let's iterate through links.
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      if (link.innerText === 'Sign In' || link.href.includes('signin.html')) {
        link.innerText = 'Profile';
        link.href = '#profile'; // Placeholder for profile
        link.addEventListener('click', (e) => {
             e.preventDefault();
             showProfileModal(user);
        });
      }
    });
  }
}

function showProfileModal(user) {
    alert(`Logged in as: ${user.name} (${user.email})\n\nClick OK to sign out.`);
    logoutUser();
}

function logoutUser() {
    localStorage.removeItem('nomikai_user');
    window.location.reload();
}
