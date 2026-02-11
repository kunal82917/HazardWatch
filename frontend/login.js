// ========================================
// Login Page JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    // Handle login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Simple validation (in production, this would be server-side)
        if (username && password) {
            // Store user session (in production, use proper authentication)
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);

            if (remember) {
                localStorage.setItem('rememberedUser', username);
            }

            // Add loading state to button
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Signing in...</span>';
            submitBtn.disabled = true;

            // Simulate authentication delay
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 800);
        }
    });

    // Check if user is remembered
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.querySelector('input[name="remember"]').checked = true;
    }

    // Add input animations
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Social login buttons
    const socialBtns = document.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Social login will be implemented with OAuth providers');
        });
    });
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCFYKtb_fNUtLA3Yz0Ssx4PoBoKQIQxOM0",
    authDomain: "disaster-ai-240b7.firebaseapp.com",
    projectId: "disaster-ai-240b7",
    storageBucket: "disaster-ai-240b7.firebasestorage.app",
    messagingSenderId: "369708904270",
    appId: "1:369708904270:web:89dc4d1a6950fc0276381f",
    measurementId: "G-RRD494ZD8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);