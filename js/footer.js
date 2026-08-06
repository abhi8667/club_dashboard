// footer.js
document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = `
            <style>
                .global-footer-container {
                    text-align: center;
                    padding: 20px 10px; 
                    color: rgba(31, 31, 31, 0.6);
                    font-family: 'Inter', sans-serif;
                    font-size: 0.85rem;
                    letter-spacing: 0.5px;
                }
                .footer-pipe {
                    margin: 0 8px;
                    opacity: 0.5; 
                }
                .footer-btn {
                    cursor: pointer;
                    color: inherit; 
                    text-decoration: none;
                    transition: color 0.3s;
                }
                @media (hover: hover) {
                    .footer-btn:hover {
                        color: #1a202c !important; 
                    }
                }
                @media (max-width: 480px) {
                    .global-footer-container {
                        font-size: 0.75rem; 
                        line-height: 1.8;     
                    }
                }
            </style>
            
            <div class="global-footer-container">
                <span class="footer-copyright">© 2026 R.V. College of Engineering · Induction 2026</span>
            </div>
        `;
    }
});