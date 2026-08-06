// 【自動生成器】DOM 建構函數
function initAwardsModalDOM() {
    if (!document.getElementById('news-lightbox') && document.body) {
        const lightboxHTML = `
            <div id="news-lightbox" class="lightbox hidden">
               <div class="overlay" onclick="closeNews()"></div>
               <div class="news-content">
                  
                  <span class="fa-btn close" onclick="closeNews()" 
                        style="position: absolute; top: -10px; right: 0; opacity: 0.3; transition: opacity 0.3s; cursor: pointer; z-index: 100;" 
                        onmouseover="this.style.opacity=1" 
                        onmouseout="this.style.opacity=0.3">
                     <i class="fa-solid fa-xmark"></i>
                  </span>
                  
                  <span id="back-to-awards" onclick="openAwardsModal({ page: 1 })" 
                        style="position: absolute; top: 15px; left: 20px; color: #dfc28c; cursor: pointer; transition: 0.3s; display: none; align-items: center; gap: 8px; font-weight: bold; font-family: sans-serif; z-index: 100;"
                        onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">
                     <i class="fa-solid fa-caret-left" style="font-size: 24px;"></i>
                     <span style="font-size: 15px; padding-top: 2px;">Back to Awards</span>
                  </span>
                  
                  <div id="news-body"></div>
               </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        // ✨ 注入右下角媒體輪播專屬的高級 CSS 動畫 (由下而上淡入淡出)
        const style = document.createElement('style');
        style.innerHTML = `
            .awards-footer-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-family: system-ui, -apple-system, sans-serif;
                font-size: clamp(0.8rem, 3vw, 0.95rem);
            }
            .awards-home-link {
                color: #aaa;
                text-decoration: none;
                font-weight: 700;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .awards-home-link:hover {
                color: #fff;
                transform: translateX(-3px);
            }
            
            .press-ticker-wrapper {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                cursor: pointer;
                color: #dfc28c;
                font-weight: 700;
                transition: opacity 0.3s;
            }
            .press-ticker-wrapper:hover {
                opacity: 0.8;
            }
            .press-ticker-wrapper:hover .press-text-item {
                animation-play-state: paused;
            }
            
            .press-icon {
                font-size: 1.15rem;
                line-height: 1;
                flex-shrink: 0;
            }

            .press-ticker-box {
                height: 22px;
                overflow: hidden;
                position: relative;
                width: 170px;
            }
            .press-text-item {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                text-align: right;
                white-space: nowrap;
                opacity: 0;
                transform: translateY(100%);
                line-height: 25px; /* ✨ 修正：與 box 高度一致，對齊更精準 */
                animation: pressSlideUp 9s infinite ease-in-out;
            }
            .press-text-item:nth-child(1) { animation-delay: 0s; }
            .press-text-item:nth-child(2) { animation-delay: 3s; }
            .press-text-item:nth-child(3) { animation-delay: 6s; }

            @keyframes pressSlideUp {
                0% { opacity: 0; transform: translateY(100%); }
                5% { opacity: 1; transform: translateY(0%); }
                30% { opacity: 1; transform: translateY(0%); }
                35% { opacity: 0; transform: translateY(-100%); }
                100% { opacity: 0; transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        // 🌟 【終極防護罩】：攔截所有經過 Lightbox 的滑鼠與點擊事件
        const lightbox = document.getElementById('news-lightbox');
        if (lightbox) {
            ['mousedown', 'mouseup', 'mousemove', 'click', 'pointerdown', 'pointerup', 'pointermove', 'touchstart', 'touchend', 'touchmove', 'wheel'].forEach(eventType => {
                lightbox.addEventListener(eventType, (e) => {
                    e.stopPropagation(); 
                });
            });
        }
    }
}

// ✨ 初始化雙保險：防止載入時間差導致 DOM 沒建立
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAwardsModalDOM);
} else {
    initAwardsModalDOM();
}

// award.js 雙層架構資料庫 (包含媒體列表)
const awardsData = {
    projects: [
        {
            icon: '🎮',
            title: 'Shaky Picks — Global Awards:',
            awards: [
                { id: 'fwa_picks', date: '2026/07/19', name: 'FWA of the Day (FOTD)', icon: '🏆', color: '#ff8fdd' },
                { id: 'cssda_picks', date: '2026/07/24', name: 'CSSDA Special Kudos & 3 Awards (UI/UX/INN)', icon: '🏅', color: '#00f0ff' },
                { id: 'awwwards_picks', date: '2026/07/22', name: 'Awwwards Nominee (Results Pending) ↗', icon: '🎖️', color: '#ffb703' }
            ]
        },
        {
            icon: '🎮',
            title: 'Shaky Gotcha — Global Awards:',
            awards: [
                { id: 'wdawards', date: '2026/07/31', name: 'WD Awards WD of the Day (WOTD)', icon: '🏆', color: '#00ff88' },
                { id: 'csswinner', date: '2026/07/17', name: 'CSS Winner Site of the Day (SOTD)', icon: '🏆', color: '#ff5a5a' },
                { id: 'fwa', date: '2026/05/31', name: 'FWA of the Day (FOTD)', icon: '🏆', color: '#ff8fdd' },
                { id: 'cssda', date: '2026/05/31', name: 'CSSDA Special Kudos & 3 Awards (UI/UX/INN)', icon: '🏅', color: '#00f0ff' },
                { id: 'awwwards', date: '2026/05/28', name: 'Awwwards Nominee ↗', icon: '🎖️', color: '#ffb703' }
            ]
        }
    ],
    pressList: [
        { title: 'Shaky Gotcha — GSAP Site of the Day', link: 'https://gsap.com/showcase/', date: '2026/07' },
        { title: 'Shaky Gotcha — Three.js Resources Showcase', link: 'https://threejsresources.com/tool/shaky-gotcha?ref=badge', date: '2026/07' },
        { title: 'Shaky Picks — Peekpaper Feature Article', link: 'https://peekpaper.com/2026/07/05/shaky-picks', date: '2026/07' }
    ],
    details: {
        'wdawards': {
            title: '🏆 WD Awards WD of the Day (WOTD)',
            subtitle: '— Shaky Gotcha —',
            text: 'Thrilled to share that Shaky Gotcha has been named WD of the Day by WD Awards! Another fantastic milestone for the Shaky Universe.',
            images: [
                'https://myshaky.com/myimg/award/wdawards_WOTD_Shaky-gotcha_S.jpg',
                'https://myshaky.com/myimg/award/winner_Shaky-gotcha.jpg'
            ],
            link: 'https://wdawards.com/web/shaky-gotcha',
            linkText: 'View WD Awards Official Page ↗'
        },
        'fwa_picks': {
            title: '🏆 FWA Of The Day (FOTD) Winner',
            subtitle: '— Shaky Picks —',
            text: 'Ecstatic to announce that Shaky Picks is the FWA Of The Day! A huge win and a proud moment for the Shaky Universe.',
            images: [
                'https://myshaky.com/myimg/award/fwa_FOTD_Shaky-Picks_S.jpg',
                'https://myshaky.com/myimg/award/fwa_FOTD_Shaky-Picks_Ribbon.jpg'
            ],
            link: 'https://thefwa.com/cases/shaky-picks',
            linkText: 'View FWA Official Page ↗'
        },
        'fwa': {
            title: '🏆 FWA Of The Day (FOTD) Winner',
            subtitle: '— Shaky Gotcha —',
            text: 'Ecstatic to announce that Shaky Gotcha is the FWA Of The Day! A huge win and a proud moment for the Shaky Universe.',
            images: [
                'https://myshaky.com/myimg/award/fwa_FOTD_Shaky-Gotcha_S.jpg',
                'https://myshaky.com/myimg/award/fwa_FOTD_Shaky-gotcha_Ribbon.jpg'
            ],
            link: 'https://thefwa.com/cases/shaky-gotcha',
            linkText: 'View FWA Official Page ↗'
        },
        'cssda': {
            title: '🏅 CSSDA 4 Awards Winner',
            subtitle: '— Shaky Gotcha —',
            text: 'Thrilled to announce that Shaky Gotcha has won 4 CSS Design Awards, including Best UI, Best UX, Best Innovation, and Special Kudos!',
            images: [
                'https://myshaky.com/myimg/award/cssda-special-kudos-Shaky-Gotcha_S.jpg',
                'https://myshaky.com/myimg/award/cssda-ui-Shaky-Gotcha_S.jpg',
                'https://myshaky.com/myimg/award/cssda-ux-Shaky-Gotcha_S.jpg',
                'https://myshaky.com/myimg/award/cssda-inn-Shaky-Gotcha_S.jpg'
            ],
            link: 'https://www.cssdesignawards.com/sites/shaky-gotcha/49467',
            linkText: 'View CSSDA Official Page ↗'
        },
        'csswinner': {
            title: '🏆 CSS Winner Site of the Day',
            subtitle: '— Shaky Gotcha —',
            text: 'Proud to announce that Shaky Gotcha has been awarded Site of the Day by CSS Winner! Another great milestone for the Shaky Universe.',
            images: [
                'https://myshaky.com/myimg/award/csswinner_SOTD_Shaky-gotcha_S.jpg',
                'https://myshaky.com/myimg/award/winner_Shaky-gotcha.jpg'
            ],
            link: 'https://www.csswinner.com/details/shaky-gotcha/19309',
            linkText: 'View CSS Winner Official Page ↗'
        },
        'cssda_picks': {
            title: '🏅 CSSDA 4 Awards Winner',
            subtitle: '— Shaky Picks —',
            text: 'Thrilled to announce that Shaky Picks has won 4 CSS Design Awards, including Best UI, Best UX, Best Innovation, and Special Kudos!',
            images: [
                'https://myshaky.com/myimg/award/cssda-special-kudos-Shaky-Picks_S.jpg',
                'https://myshaky.com/myimg/award/cssda-ui-Shaky-Picks_S.jpg',
                'https://myshaky.com/myimg/award/cssda-ux-Shaky-Picks_S.jpg',
                'https://myshaky.com/myimg/award/cssda-inn-Shaky-Picks_S.jpg'
            ],
            link: 'https://www.cssdesignawards.com/sites/shaky-picks/49821',
            linkText: 'View CSSDA Official Page ↗'
        }    
    }
};

// 核心切換函數：三層 Lightbox 渲染
function openAwardsModal({ page = 1, type = null }) {
    // 🛡️ 保險：點擊時若 DOM 不存在，現場立刻建立
    initAwardsModalDOM();

    const modal = document.getElementById('news-lightbox');
    const body = document.getElementById('news-body');
    const backBtn = document.getElementById('back-to-awards'); 
    
    if (!modal || !body) return;

    body.innerHTML = '';

    if (page === 1) {
        if (backBtn) backBtn.style.display = 'none'; 
        let htmlContent = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="margin: 0; font-size: clamp(1.2rem, 5vw, 2rem); color: #dfc28c; text-shadow: 0 0 10px rgba(223, 194, 140, 0.3); letter-spacing: 2px;">
                    SHAKY UNIVERSE AWARDS
                </h2>
            </div>
            <div style="max-width: 700px; margin: 0 auto; text-align: left; padding: 0 10px;">
        `;
        awardsData.projects.forEach(project => {
            htmlContent += `
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 16px 0; font-size: clamp(0.95rem, 4vw, 1.3rem); color: #f0f0f0; font-weight: normal; letter-spacing: 1.5px; display: flex; align-items: flex-start; gap: 10px;">
                        <span style="font-size: clamp(1.1rem, 4.5vw, 1.4rem); line-height: 1.3; flex-shrink: 0;">${project.icon}</span>
                        <span style="line-height: 1.4;">${project.title}</span>
                    </h3>
                    <div style="padding-left: clamp(12px, 5vw, 42px); display: flex; flex-direction: column; gap: 14px;">
            `;
            project.awards.forEach(award => {
                let clickHandler = '';
                if (award.id === 'awwwards_picks') {
                    clickHandler = `onclick="window.open('https://www.awwwards.com/sites/shaky-picks', '_blank', 'noopener,noreferrer')"`;
                } else if (award.id === 'awwwards') {
                    clickHandler = `onclick="window.open('https://www.awwwards.com/sites/shaky-gotcha', '_blank', 'noopener,noreferrer')"`;
                } else {
                    clickHandler = `onclick="openAwardsModal({ page: 2, type: '${award.id}' })"`;
                }
                
                const cursorStyle = 'cursor: pointer;';
                const hoverEffects = `onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1"`;

                htmlContent += `
                        <div ${clickHandler} 
                            style="color: ${award.color}; font-size: clamp(0.85rem, 3.5vw, 1.2rem); ${cursorStyle} transition: 0.3s; display: flex; align-items: flex-start; gap: 8px; font-weight: bold; line-height: 1.5;" 
                            ${hoverEffects}>
                            <span style="font-size: clamp(1rem, 4vw, 1.2rem); flex-shrink: 0; margin-top: 1px;">${award.icon}</span>
                            <span>${award.date} | ${award.name}</span>
                        </div>
                `;
            });
            htmlContent += `</div></div>`;
        });

        htmlContent += `
            <div class="awards-footer-bar">
                <a href="https://myshaky.com/" target="_blank" rel="noopener noreferrer" class="awards-home-link">
                    ← 🏠 Home
                </a>

                <div class="press-ticker-wrapper" onclick="openAwardsModal({ page: 3 })">
                    <div class="press-ticker-box">
                        <div class="press-text-item">GSAP Showcase</div>
                        <div class="press-text-item">Three.js Resources</div>
                        <div class="press-text-item">Peekpaper Feature</div>
                    </div>
                    <span class="press-icon">📰</span>
                </div>
            </div>
        `;

        htmlContent += `</div>`;
        body.innerHTML = htmlContent;

    } else if (page === 2 && type) {
        const data = awardsData.details[type];
        if (!data) return;
        if (backBtn) backBtn.style.display = 'flex'; 
        let imagesHtml = data.images.map(src => `<img src="${src}">`).join('');
        
        let titleColor = '#00f0ff'; 
        let shadowColor = 'rgba(0,240,255,0.4)';
        
        if (type.includes('fwa')) {
            titleColor = '#ff8fdd';
            shadowColor = 'rgba(255,143,221,0.4)';
        } else if (type === 'csswinner') {
            titleColor = '#ff5a5a'; 
            shadowColor = 'rgba(255,90,90,0.4)';
        } else if (type === 'wdawards') {
            titleColor = '#00ff88';
            shadowColor = 'rgba(0,255,136,0.4)';
        }

        const subtitleHtml = data.subtitle ? `<h3 style="margin: 8px 0 0 0; font-size: clamp(1rem, 3vw, 1.25rem); color: #fff; font-weight: normal; letter-spacing: 2px;">${data.subtitle}</h3>` : '';

        body.innerHTML = `
            <div style="max-width: 850px; margin: 0 auto; text-align: center;">
                <h2 style="margin-top: 0; font-size: clamp(1.4rem, 4vw, 2rem); letter-spacing: 1.5px; line-height: 1.3; color: ${titleColor}; text-shadow: 0 0 15px ${shadowColor};">${data.title}</h2>
                
                ${subtitleHtml}
                
                <p style="font-size: clamp(0.95rem, 2vw, 1.15rem); line-height: 1.6; margin-top: 25px; color: #ddd; letter-spacing: 0.5px;">${data.text}</p>
            </div>
            <div class="news-gallery">
                ${imagesHtml}
            </div>
            <div class="news-link-wrapper">
                <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="news-official-link">${data.linkText}</a>
            </div>
        `;

    } else if (page === 3) {
        if (backBtn) backBtn.style.display = 'flex';
        let pressHtml = `
            <div style="text-align: center; margin-bottom: 35px;">
                <h2 style="margin: 0; font-size: clamp(1.2rem, 5vw, 1.8rem); color: #dfc28c; letter-spacing: 2px;">
                    📰 FEATURED & PRESS
                </h2>
            </div>
            <div style="max-width: 650px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; padding: 0 10px;">
        `;

        awardsData.pressList.forEach(item => {
            pressHtml += `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" 
                   style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 16px 20px; border-radius: 12px; color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s;"
                   onmouseover="this.style.background='rgba(255,255,255,0.12)'; this.style.borderColor='#dfc28c';" 
                   onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.1)';">
                    <span style="font-size: clamp(0.9rem, 3.5vw, 1.1rem); font-weight: bold; letter-spacing: 0.5px;">${item.title}</span>
                    <span style="color: #dfc28c; font-size: 0.9rem; flex-shrink: 0; padding-left: 10px;">${item.date} ↗</span>
                </a>
            `;
        });

        pressHtml += `</div>`;
        body.innerHTML = pressHtml;
    }

    modal.classList.remove('hidden');

    // 🌟 【防護罩開啟】鎖定 UI、Footer 與 3D Canvas
    const uiContainer = document.getElementById('ui-container');
    if (uiContainer) uiContainer.classList.add('no-pointer-events');
    const footer = document.querySelector('footer');
    if (footer) footer.classList.add('no-pointer-events');
    const canvas = document.getElementById('love-opening-canvas') || document.querySelector('canvas');
    if (canvas) canvas.classList.add('no-pointer-events'); // ✨ 修正：打開時加入鎖定
}

function closeNews() {
    const modal = document.getElementById('news-lightbox');
    const body = document.getElementById('news-body');
    const backBtn = document.getElementById('back-to-awards');

    if (modal) modal.classList.add('hidden');
    if (body) body.innerHTML = ''; 
    if (backBtn) backBtn.style.display = 'none'; 

    // 🌟 【防護罩解除】恢復 UI、Footer 與 3D Canvas
    const uiContainer = document.getElementById('ui-container');
    if (uiContainer) uiContainer.classList.remove('no-pointer-events');
    const footer = document.querySelector('footer');
    if (footer) footer.classList.remove('no-pointer-events');
    const canvas = document.getElementById('love-opening-canvas') || document.querySelector('canvas');
    if (canvas) canvas.classList.remove('no-pointer-events');
}