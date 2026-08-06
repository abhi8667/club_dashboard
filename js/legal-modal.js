document.addEventListener("DOMContentLoaded", () => {
    // 1. 動態注入 CSS 樣式
    const style = document.createElement('style');
    style.innerHTML = `
        .sys-legal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 17, 23, 0.85); backdrop-filter: blur(8px);
            z-index: 99999; display: flex; justify-content: center; align-items: center; padding: 20px;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .sys-legal-overlay.is-active { opacity: 1; pointer-events: auto; }
        
        .sys-legal-content {
            background: #1e222b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;
            max-width: 520px; width: 100%; padding: 32px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            user-select: text; -webkit-user-select: text;
            max-height: 85vh; 
            overflow-y: auto;
            text-align: left;
        }
        
        .sys-legal-content::-webkit-scrollbar { width: 6px; }
        .sys-legal-content::-webkit-scrollbar-track { background: transparent; }
        .sys-legal-content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .sys-legal-content::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }

        .sys-legal-close {
            position: absolute; top: 16px; right: 20px; background: none; border: none;
            color: #94a3b8; font-size: 28px; cursor: pointer; transition: color 0.2s;
            line-height: 1; z-index: 10;
        }
        .sys-legal-close:hover { color: #fff; }
        
        .sys-legal-content h2 { color: #63b3ed; margin-top: 0; margin-bottom: 20px; font-size: 22px; text-align: center; }
        .sys-legal-body h3 { color: #fff; margin: 16px 0 6px 0; font-size: 15px; }
        .sys-legal-body p, .sys-legal-body li { font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin: 0 0 10px 0; }
        .sys-legal-body ul { list-style: none; padding: 0; margin: 12px 0 0 0; }
        .sys-legal-body li { margin-bottom: 6px; }
        .sys-legal-body strong { color: #fff; }
        .sys-legal-link { color: #63b3ed; text-decoration: none; transition: color 0.2s; }
        .sys-legal-link:hover { color: #fff; text-decoration: underline; }

        @media (max-width: 480px) {
            .sys-legal-overlay { padding: 15px; }
            .sys-legal-content { padding: 24px 20px; max-height: 90vh; }
            .sys-legal-close { top: 12px; right: 16px; }
            .sys-legal-body p, .sys-legal-body li { font-size: 12px; }
        }
    `;
    document.head.appendChild(style);

    // 2. 動態注入 HTML 結構
    const modalHTML = `
        <div id="sys-legal-modal" class="sys-legal-overlay">
            <div class="sys-legal-content">
                <button class="sys-legal-close" id="sys-legal-close-btn">&times;</button>
                <h2>Legal Disclaimer</h2>
                <div class="sys-legal-body">
                    <h3>Original Works</h3>
                    <p>All copyrights for the original designs, WebGL assets, and interactive frameworks belong to Allen Tseng (operating under the brand Shaky). These projects are created solely for experimental front-end interactive design, technical research, and personal portfolio display.</p>
                    
                    <h3>Tribute & Fan Art</h3>
                    <p>Certain character designs and themed cards featured on this website are visual tributes (fan art / parody) created out of personal appreciation for pop culture elements. All rights to the original characters strictly belong to their respective original creators, publishers, or copyright holders. This project is strictly non-commercial, generates no revenue, and is not affiliated with or endorsed by any official entities.</p>
                    
                    <h3>Contact</h3>
                    <ul>
                        <li><strong>Creator:</strong> Allen Tseng (Shaky)</li>
                        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/allen-tseng-ab9b85118" target="_blank" class="sys-legal-link">Allen Tseng</a></li>
                        <li><strong>Email:</strong> <a href="mailto:metashaky@gmail.com" class="sys-legal-link">metashaky@gmail.com</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById("sys-legal-modal");
    const closeBtn = document.getElementById("sys-legal-close-btn");

    // 🌟 【防護罩 1：事件攔截】阻斷滑鼠與點擊穿透到 Three.js 畫布
    if (modal) {
        ['mousedown', 'mouseup', 'mousemove', 'click', 'pointerdown', 'pointerup', 'pointermove', 'touchstart', 'touchend', 'touchmove', 'wheel'].forEach(eventType => {
            modal.addEventListener(eventType, (e) => {
                e.stopPropagation(); 
            });
        });
    }

    // 3. 綁定關閉事件
    const close = () => {
        modal.classList.remove("is-active");

        // 🌟 【防護罩 2：關閉時解鎖背景】
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) uiContainer.classList.remove('no-pointer-events');
        const footer = document.querySelector('footer');
        if (footer) footer.classList.remove('no-pointer-events');
        const canvas = document.getElementById('love-opening-canvas') || document.querySelector('canvas');
        if (canvas) canvas.classList.remove('no-pointer-events');
    };
    
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    // 4. 監聽全網頁的點擊，只要點到 id="legal-btn" 就開啟！
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "legal-btn") {
            modal.classList.add("is-active");

            // 🌟 【防護罩 3：開啟時鎖定背景】
            const uiContainer = document.getElementById('ui-container');
            if (uiContainer) uiContainer.classList.add('no-pointer-events');
            const footer = document.querySelector('footer');
            if (footer) footer.classList.add('no-pointer-events');
            const canvas = document.getElementById('love-opening-canvas') || document.querySelector('canvas');
            if (canvas) canvas.classList.add('no-pointer-events');
        }
    });
});

// 監聽全網頁的點擊，只要點到 id="awards-btn" 就開啟 AWARDS 面板！
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "awards-btn") {
        e.preventDefault(); 
        openAwardsModal({ page: 1 });
    }
});