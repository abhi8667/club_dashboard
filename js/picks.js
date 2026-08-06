let isFinalResultLocked = false; 
const audioEffect = new Audio('https://myshaky.com/myimg/picks/ok-111.mp3');

let clubsData = [];
let filteredClubs = [];
let currentClubIndex = -1;
let activeCategory = 'All';

class SplitText {
    constructor(element, vars) {
        this.element = element;
        this.vars = vars;
        this.words = [];
        this.chars = [];
        this._originalText = element.innerText;
        this.split(vars);
    }
    split(vars) {
        const text = this.element.innerText.trim();
        this.element.innerHTML = '';
        this.element.style.whiteSpace = 'nowrap';
        if (vars.type === 'chars' || vars.type.includes('chars')) {
            const words = text.split(' ');
            words.forEach((wordText, wIndex) => {
                const wordDiv = document.createElement('div');
                wordDiv.style.display = 'inline-block';
                wordDiv.style.whiteSpace = 'nowrap';
                const chars = wordText.split('');
                chars.forEach((charText) => {
                    const charDiv = document.createElement('div');
                    charDiv.innerText = charText;
                    charDiv.style.display = 'inline-block';
                    charDiv.className = 'char';
                    wordDiv.appendChild(charDiv);
                    this.chars.push(charDiv);
                });
                this.element.appendChild(wordDiv);
                if (wIndex < words.length - 1) {
                    const space = document.createElement('span');
                    space.innerHTML = '&nbsp;';
                    this.element.appendChild(space);
                }
            });
        } else {
            const words = text.split(' ');
            words.forEach((word, i) => {
                const wordDiv = document.createElement('div');
                wordDiv.className = vars.wordsClass || 'word';
                wordDiv.style.display = 'inline-block';
                wordDiv.innerText = word;
                this.element.appendChild(wordDiv);
                this.words.push(wordDiv);
                if (i < words.length - 1) {
                    const space = document.createElement('span');
                    space.innerHTML = '&nbsp;';
                    this.element.appendChild(space);
                }
            });
        }
    }
}

function generateLogoFallback(clubName) {
    const initials = (clubName || 'RV').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
    const colors = ['#2B6CB0', '#6B46C1', '#276749', '#C53030', '#DD6B20', '#319795', '#D69E2E'];
    let hash = 0;
    for (let i = 0; i < (clubName || '').length; i++) hash += clubName.charCodeAt(i);
    const color = colors[Math.abs(hash) % colors.length];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="16" fill="${color}"/>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-weight="bold" font-size="30">${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Global logo candidate error handler (tries clubs/<folder>/logo.png, .jpg, .jpeg, .webp, .svg, assets/logos/...)
function handleLogoCandidateError(imgEl, fallbackSvg) {
    let candidates = [];
    try {
        candidates = JSON.parse(imgEl.getAttribute('data-candidates') || '[]');
    } catch(e) {}
    
    let idx = parseInt(imgEl.getAttribute('data-cand-idx') || '0', 10) + 1;
    if (idx < candidates.length) {
        imgEl.setAttribute('data-cand-idx', idx);
        imgEl.src = candidates[idx];
    } else {
        imgEl.onerror = null;
        imgEl.src = fallbackSvg;
    }
}

// Global RVCE center emblem logo candidate handler
function handleRvceLogoError(imgEl) {
    const rvceCandidates = [
        'assets/rvce-logo.png',
        'assets/rvce-logo.jpg',
        'assets/rvce-logo.jpeg',
        'assets/rvce-logo.webp',
        'assets/rvce-logo.svg',
        'assets/logos/rvce-logo.png',
        'clubs/rvce-logo.png'
    ];
    let idx = parseInt(imgEl.getAttribute('data-rvce-idx') || '0', 10) + 1;
    if (idx < rvceCandidates.length) {
        imgEl.setAttribute('data-rvce-idx', idx);
        imgEl.src = rvceCandidates[idx];
    } else {
        imgEl.style.display = 'none';
        const svgEl = document.getElementById('rvce-center-svg');
        if (svgEl) svgEl.style.display = 'block';
    }
}

function renderClubLogoImg(club, style = '') {
    const folder = (club.gallery_folder || club.club_id || '').trim();
    const fallback = generateLogoFallback(club.club_name);

    const candidates = [
        `clubs/${folder}/logo.png`,
        `clubs/${folder}/logo.jpg`,
        `clubs/${folder}/logo.jpeg`,
        `clubs/${folder}/logo.webp`,
        `clubs/${folder}/logo.svg`,
        `assets/logos/${folder}/logo.png`,
        `assets/logos/${folder}.png`,
        `assets/logos/${folder}.jpg`,
        club.logo_path
    ].filter(Boolean);

    const candAttr = JSON.stringify(candidates).replace(/"/g, '&quot;');

    return `<img src="${candidates[0]}" 
                 data-candidates="${candAttr}" 
                 data-cand-idx="0" 
                 alt="${club.club_name}" 
                 loading="lazy" 
                 style="${style}"
                 onerror="handleLogoCandidateError(this, '${fallback.replace(/'/g, "\\'")}');" />`;
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const galleryContainer = document.getElementById('gallery-container');
    const introOverlay = document.getElementById('intro-overlay');
    const heroContentWrap = document.getElementById('hero-content-wrap');
    const mainTitle = document.getElementById('main-title');
    const heroEyebrow = document.getElementById('hero-eyebrow');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroStats = document.getElementById('hero-stats');
    const startBtn = document.getElementById('start-btn');
    
    const categoryPanelsWrap = document.getElementById('category-panels-wrap');
    const catPanels = document.querySelectorAll('.cat-panel');
    const instructionText = document.getElementById('instruction-text');
    
    const resultLayout = document.getElementById('result-layout');
    const resCardTarget = document.getElementById('res-card-target');
    const resMainTitle = document.querySelector('.res-main-title');
    const resBackBtn = document.getElementById('res-back-btn');
    
    const prevCatBtn = document.getElementById('prev-cat-btn');
    const nextCatBtn = document.getElementById('next-cat-btn');

    let cards = [];
    let cardStates = [];

    const state = {
        isAnimating: false,
        isExpanded: false, 
        isIntroDone: false,
        isStarted: false,
        isRevealed: false,
        isInteractionEnabled: true, 
        galleryRotationOffset: 0
    };

    const calculateRadius = () => {
        const w = window.innerWidth;
        if (w <= 430) return Math.min(w * 0.44, 175); 
        if (w <= 768) return Math.min(w * 0.42, 210); 
        if (w >= 769 && w < 1024) return 230; 
        if (w >= 1024 && w <= 1600) return 270; 
        if (w > 1600) return 320; 
        return 250; 
    };

    const params = {
        radius: calculateRadius(), 
        lerpFactor: 0.1
    };

    window.addEventListener('resize', () => {
        params.radius = calculateRadius();
        cards.forEach((card, i) => {
            const count = cards.length;
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            const x = params.radius * Math.cos(angle);
            const y = params.radius * Math.sin(angle);
            gsap.set(card, { x: x, y: y });
        });
    });

    const mouse = {
        targetX: 0, targetY: 0, targetZ: 0,
        currentX: 0, currentY: 0, currentZ: 0
    };

    // 1. Multi-path CSV Loader
    function loadClubs() {
        Papa.parse('clubs/clubs.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results && results.data && results.data.length > 0) {
                    processClubsData(results.data);
                } else {
                    fallbackToDataCsv();
                }
            },
            error: function() {
                fallbackToDataCsv();
            }
        });
    }

    function fallbackToDataCsv() {
        Papa.parse('data/clubs.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(res) {
                processClubsData(res.data);
            }
        });
    }

    function processClubsData(rows) {
        clubsData = rows.map(normalizeRow).filter(r => r.club_id && r.club_name);
        filteredClubs = [...clubsData];
        
        const countEl = document.getElementById('stat-club-count');
        if (countEl) countEl.textContent = clubsData.length;

        const techCount = clubsData.filter(c => c.category === 'Technology').length;
        const nonTechCount = clubsData.filter(c => c.category === 'Non-Technical').length;
        
        const countTechEl = document.getElementById('count-tech');
        const countNonTechEl = document.getElementById('count-nontech');
        if (countTechEl) countTechEl.textContent = `${techCount} Technology Clubs`;
        if (countNonTechEl) countNonTechEl.textContent = `${nonTechCount} Cultural & Non-Tech Clubs`;

        renderCards(filteredClubs);
        runHeroEntrance();
    }

    function normalizeRow(row) {
        const club_id = (row.id || row.club_id || '').trim();
        const club_name = (row.name || row.club_name || '').trim();
        
        let category = (row.category || '').trim();
        if (category.toLowerCase() === 'technical') {
            category = 'Technology';
        }

        const tagline = (row.shortDescription || row.tagline || '').trim();
        const description = (row.fullDescription || row.description || '').trim();

        let logo_path = (row.logo || row.logo_filename || '').trim();

        const gallery_folder = (row.folder || row.gallery_folder || club_id).trim();
        const venue = (row.venue || 'RVCE Campus').trim();

        const events = [];
        if (row.events) {
            const list = row.events.split(';').map(e => e.trim()).filter(Boolean);
            list.forEach(title => events.push({ title, desc: '' }));
        } else {
            for (let i = 1; i <= 4; i++) {
                const title = (row[`event_${i}_title`] || '').trim();
                const desc = (row[`event_${i}_description`] || '').trim();
                if (title) events.push({ title, desc });
            }
        }

        return {
            club_id,
            club_name,
            category,
            tagline,
            description,
            venue,
            events,
            instagram: (row.instagram || '').trim(),
            linkedin: (row.linkedin || '').trim(),
            website: (row.website || '').trim(),
            contact_email: (row.contact_email || '').trim(),
            logo_path,
            gallery_folder
        };
    }

    const hoverTooltip = document.getElementById('hover-club-tooltip');

    function renderCards(clubList) {
        gallery.innerHTML = '';
        clubList.forEach((club) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.clubId = club.club_id;
            card.dataset.category = club.category;
            card.dataset.clubName = club.club_name;

            card.innerHTML = `
                <div class="card-inner">
                    <!-- FRONT FACE: Crisp Logo -->
                    <div class="card-face card-face-front">
                        ${renderClubLogoImg(club)}
                    </div>
                    <!-- BACK FACE: Enlarged Logo + Full Club Name -->
                    <div class="card-face card-face-back">
                        ${renderClubLogoImg(club, 'width: 44px; height: 44px; object-fit: contain;')}
                        <span class="card-back-name">${club.club_name}</span>
                    </div>
                </div>
            `;
            gallery.appendChild(card);
        });

        cards = gsap.utils.toArray('.card');
        cardStates = cards.map(() => ({
            currentRotation: 0, targetRotation: 0,
            currentScale: 1, targetScale: 1,
            currentX: 0, targetX: 0,
            currentY: 0, targetY: 0
        }));

        initCardPositions();
        attachCardClickListeners();
    }

    function initCardPositions() {
        const count = cards.length;
        cards.forEach((card, i) => {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            card.dataset.angle = angle;
            card.style.cursor = 'pointer';

            const x = params.radius * Math.cos(angle);
            const y = params.radius * Math.sin(angle);

            gsap.set(card, {
                x: x, y: y,
                rotationY: 0, rotation: (angle * 180 / Math.PI) + 90,
                transformOrigin: "center center", transformPerspective: 800,
                scale: 1, opacity: 1
            });
        });
    }

    function attachCardClickListeners() {
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', (e) => {
                if (state.isAnimating || state.isRevealed) return;
                const s = cardStates[index];
                if (s) {
                    s.targetRotation = 180;
                    s.targetScale = 1.42;
                }
                const clubName = card.dataset.clubName;
                if (hoverTooltip && clubName) {
                    hoverTooltip.textContent = clubName;
                    const rect = card.getBoundingClientRect();
                    hoverTooltip.style.left = `${rect.left + rect.width / 2}px`;
                    hoverTooltip.style.top = `${rect.top}px`;
                    hoverTooltip.classList.add('is-active');
                }
            });

            card.addEventListener('mousemove', () => {
                if (hoverTooltip && hoverTooltip.classList.contains('is-active')) {
                    const rect = card.getBoundingClientRect();
                    hoverTooltip.style.left = `${rect.left + rect.width / 2}px`;
                    hoverTooltip.style.top = `${rect.top}px`;
                }
            });

            card.addEventListener('mouseleave', () => {
                if (state.isAnimating || state.isRevealed) return;
                const s = cardStates[index];
                if (s) {
                    s.targetRotation = 0;
                    s.targetScale = 1.0;
                }
                if (hoverTooltip) {
                    hoverTooltip.classList.remove('is-active');
                }
            });

            card.addEventListener('click', () => {
                if (hoverTooltip) hoverTooltip.classList.remove('is-active');
                if (state.isAnimating) return;
                const clubId = card.dataset.clubId;
                const idx = filteredClubs.findIndex(c => c.club_id === clubId);
                if (idx !== -1) {
                    selectAndRevealClub(idx, card);
                }
            });
        });
    }



    // 2. 3D Rotation Ticker
    gsap.ticker.add(() => {
        if (state.isExpanded || state.isAnimating) return;

        if (state.isInteractionEnabled) {
            mouse.currentX += (mouse.targetX - mouse.currentX) * params.lerpFactor;
            mouse.currentY += (mouse.targetY - mouse.currentY) * params.lerpFactor;
            mouse.currentZ += (mouse.targetZ - mouse.currentZ) * params.lerpFactor;
        } else {
            mouse.currentZ = 0; mouse.targetZ = 0;
        }

        gsap.set(gallery, {
            rotateX: mouse.currentX,
            rotateY: mouse.currentY,
            rotation: mouse.currentZ + state.galleryRotationOffset,
            transformOrigin: "center center"
        });

        cards.forEach((card, i) => {
            const s = cardStates[i];
            if (!s) return;
            const angle = parseFloat(card.dataset.angle);

            s.currentRotation += (s.targetRotation - s.currentRotation) * params.lerpFactor;
            s.currentScale += (s.targetScale - s.currentScale) * params.lerpFactor;
            s.currentX += (s.targetX - s.currentX) * params.lerpFactor;
            s.currentY += (s.targetY - s.currentY) * params.lerpFactor;

            const baseX = params.radius * Math.cos(angle);
            const baseY = params.radius * Math.sin(angle);

            gsap.set(card, {
                x: baseX + s.currentX,
                y: baseY + s.currentY,
                rotationY: s.currentRotation,
                rotationX: mouse.currentX * 0.35,
                scale: s.currentScale,
                rotation: (angle * 180 / Math.PI) + 90,
                transformPerspective: 1000
            });
        });
    });

    window.addEventListener('mousemove', (e) => {
        if (!state.isInteractionEnabled || state.isExpanded) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouse.targetY = ((e.clientX - cx) / cx) * 32;
        mouse.targetX = -((e.clientY - cy) / cy) * 32;
    });

    window.addEventListener('touchmove', (e) => {
        if (!state.isInteractionEnabled || state.isExpanded || !e.touches[0]) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouse.targetY = ((e.touches[0].clientX - cx) / cx) * 32;
        mouse.targetX = -((e.touches[0].clientY - cy) / cy) * 32;
    });


    // 3. Hero Entrance Animation
    function runHeroEntrance() {
        const splitTitle = new SplitText(mainTitle, { type: "chars" });
        gsap.set(mainTitle, { opacity: 1 });
        gsap.set(splitTitle.chars, { opacity: 0, y: 25, filter: "blur(10px)", force3D: true });

        const tl = gsap.timeline();
        tl.to(splitTitle.chars, {
            opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.05, ease: "power2.out"
        })
        .to([heroEyebrow, heroSubtitle, heroStats], {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out"
        }, "-=0.5")
        .to(startBtn, {
            opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)"
        }, "-=0.4");
    }

    // 4. Hero Start -> Category Panels Transition
    startBtn.addEventListener('click', () => {
        startBtn.classList.add('active');
        audioEffect.play().catch(() => {});

        setTimeout(() => {
            gsap.to(heroContentWrap, {
                opacity: 0, y: -20, duration: 0.6, ease: "power2.inOut",
                onComplete: () => {
                    heroContentWrap.style.display = 'none';
                    categoryPanelsWrap.style.display = 'flex';
                    
                    gsap.fromTo(categoryPanelsWrap, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                    gsap.fromTo(catPanels, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" });
                }
            });
        }, 150);
    });

    // 5. Category Panel Click -> Grid -> 3D Wheel Morph Transition
    catPanels.forEach(panel => {
        panel.addEventListener('click', (e) => {
            const category = panel.dataset.category;
            activeCategory = category;

            if (category === 'All') {
                filteredClubs = [...clubsData];
            } else {
                filteredClubs = clubsData.filter(c => c.category.toLowerCase() === category.toLowerCase());
            }

            audioEffect.play().catch(() => {});
            state.isAnimating = true;

            gsap.to(introOverlay, {
                opacity: 0, scale: 0.95, duration: 0.5, ease: "power2.in",
                onComplete: () => {
                    introOverlay.style.display = 'none';
                    instructionText.textContent = `EXPLORING ${category.toUpperCase()} CLUBS · TAP A LOGO`;

                    renderCards(filteredClubs);
                    galleryContainer.classList.add('is-visible');

                    const isSmallScreen = window.innerWidth < 768;
                    const gridCols = isSmallScreen ? 4 : 5;
                    const cellWidth = isSmallScreen ? 64 : 85;
                    const cellHeight = isSmallScreen ? 82 : 105;

                    // 1. Initial Scattered Positions
                    cards.forEach(card => {
                        const randX = (Math.random() - 0.5) * window.innerWidth * 0.7;
                        const randY = (Math.random() - 0.5) * window.innerHeight * 0.7;
                        gsap.set(card, {
                            x: randX,
                            y: randY,
                            opacity: 0,
                            scale: 0.6,
                            rotation: (Math.random() - 0.5) * 45
                        });
                    });

                    const wheelCenterLogo = document.getElementById('wheel-center-logo');
                    gsap.set([instructionText, wheelCenterLogo], { opacity: 0 });

                    const tl = gsap.timeline({
                        onComplete: () => {
                            state.isAnimating = false;
                            state.isInteractionEnabled = true;
                        }
                    });

                    // 2. Animate into 2D Grid Formation
                    tl.to(cards, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.03,
                        ease: "power2.out"
                    })
                    .to(cards, {
                        x: (i) => {
                            const col = i % gridCols;
                            const totalCols = Math.min(cards.length, gridCols);
                            return (col - (totalCols - 1) / 2) * cellWidth;
                        },
                        y: (i) => {
                            const row = Math.floor(i / gridCols);
                            const totalRows = Math.ceil(cards.length / gridCols);
                            return (row - (totalRows - 1) / 2) * cellHeight;
                        },
                        rotation: 0,
                        rotationY: 0,
                        scale: 1,
                        duration: 1.1,
                        stagger: 0.03,
                        ease: "expo.inOut"
                    }, "<0.2")

                    // 3. Morph from 2D Grid into 3D Circular Wheel!
                    .to(cards, {
                        x: (i) => {
                            const angle = parseFloat(cards[i].dataset.angle);
                            return params.radius * Math.cos(angle);
                        },
                        y: (i) => {
                            const angle = parseFloat(cards[i].dataset.angle);
                            return params.radius * Math.sin(angle);
                        },
                        rotation: (i) => {
                            const angle = parseFloat(cards[i].dataset.angle);
                            return (angle * 180 / Math.PI) + 90;
                        },
                        rotationY: 0,
                        scale: 1,
                        duration: 1.4,
                        stagger: 0.04,
                        ease: "elastic.out(1.1, 0.5)"
                    }, "+=0.3")

                    // 4. Reveal Center Emblem & Bottom Instruction Text
                    .to([instructionText, wheelCenterLogo], {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "power2.out"
                    }, "-=0.8");
                }
            });
        });
    });
    // 6. Select & Reveal Club Detail Page (Giant 3D Arc Floating + Detail Box Below)
    function selectAndRevealClub(index, cardEl) {
        if (state.isAnimating) return;
        currentClubIndex = index;
        const club = filteredClubs[index];
        if (!club) return;

        state.isAnimating = true;
        state.isRevealed = true;
        state.isInteractionEnabled = false;

        audioEffect.currentTime = 0;
        audioEffect.play().catch(() => {});

        const wheelCenterLogo = document.getElementById('wheel-center-logo');
        gsap.to([instructionText, wheelCenterLogo], { opacity: 0, duration: 0.4 });

        // 1. Flip all cards to back side
        cards.forEach((c) => {
            const s = cardStates[cards.indexOf(c)];
            if (s) {
                s.targetRotation = 180;
                s.targetScale = 1.0;
            }
        });

        // 2. Zoom container WAY in so cards form a giant arc across the screen
        const zoomScale = window.innerWidth < 768 ? 1.6 : 2.0;
        const shiftY = window.innerWidth < 768 ? 40 : 60;

        gsap.to(galleryContainer, {
            scale: zoomScale,
            y: shiftY,
            duration: 1.8,
            ease: "power2.inOut"
        });

        gsap.to(gallery, {
            rotateX: 0,
            rotateY: 0,
            duration: 1.0,
            ease: "power2.out"
        });

        // 3. Spin 3D wheel to land on selected card
        const cardAngle = parseFloat(cardEl.dataset.angle);
        const currentRot = gsap.getProperty(gallery, "rotation") || 0;
        const extraSpins = 360 * 3;
        const targetAngle = - (cardAngle * 180 / Math.PI + 90);
        const finalRot = Math.ceil(currentRot / 360) * 360 + extraSpins + targetAngle;

        gsap.to(gallery, {
            rotation: finalRot,
            duration: 1.8,
            ease: "power3.inOut",
            onComplete: () => {
                state.galleryRotationOffset = finalRot;
                
                // 4. Flip selected card back to front face with highlight pop
                const selectedState = cardStates[index];
                if (selectedState) {
                    selectedState.targetRotation = 0;
                    selectedState.targetScale = 1.35;
                }

                cardEl.classList.add('card-selected', 'is-revealed');
                
                gsap.to(cardEl, {
                    scale: 1.35,
                    duration: 0.5,
                    ease: "back.out(2)",
                    onComplete: () => {
                        // 5. Reveal Glassmorphic Detail Box directly underneath the floating 3D card!
                        populateClubDetail(club);
                        
                        resultLayout.style.display = 'flex';
                        gsap.fromTo(resultLayout, { opacity: 0, y: 30 }, { opacity: 1, y: 0, visibility: 'visible', duration: 0.6, ease: "power2.out" });
                        state.isAnimating = false;
                    }
                });
            }
        });
    }

    function populateClubDetail(club) {
        document.getElementById('res-category-label').textContent = `${club.category.toUpperCase()} ｜`;
        document.getElementById('club-title').textContent = club.club_name;
        document.getElementById('club-tagline').textContent = club.tagline;
        document.getElementById('club-category-badge').textContent = club.category;
        document.getElementById('club-venue-badge').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${club.venue || 'RVCE Campus'}`;
        document.getElementById('club-description').textContent = club.description;

        // Events
        const eventsGrid = document.getElementById('events-grid');
        const eventsSec = document.getElementById('events-section');
        if (club.events && club.events.length > 0) {
            eventsGrid.innerHTML = club.events.map(ev => `
                <div class="event-card">
                    <div class="event-title">${ev.title}</div>
                    ${ev.desc ? `<div class="event-desc">${ev.desc}</div>` : ''}
                </div>
            `).join('');
            eventsSec.style.display = 'block';
        } else {
            eventsSec.style.display = 'none';
        }

        // Gallery
        const galleryGrid = document.getElementById('club-gallery-grid');
        const gallerySec = document.getElementById('gallery-section');
        if (club.gallery_folder) {
            let galleryHTML = '';
            for (let i = 1; i <= 8; i++) {
                const imgPath = `assets/gallery/${club.gallery_folder}/${i}.jpg`;
                galleryHTML += `<img class="gallery-img-thumb" src="${imgPath}" alt="${club.club_name} photo" loading="lazy" onerror="this.style.display='none'" />`;
            }
            galleryGrid.innerHTML = galleryHTML;
            gallerySec.style.display = 'block';
        } else {
            gallerySec.style.display = 'none';
        }

        // Socials
        const socialsRow = document.getElementById('socials-row');
        let socialsHTML = '';
        if (club.instagram) socialsHTML += `<a class="social-pill" href="${club.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i> Instagram</a>`;
        if (club.linkedin) socialsHTML += `<a class="social-pill" href="${club.linkedin}" target="_blank"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>`;
        if (club.website) socialsHTML += `<a class="social-pill" href="${club.website}" target="_blank"><i class="fa-solid fa-globe"></i> Website</a>`;
        if (club.contact_email) socialsHTML += `<a class="social-pill" href="mailto:${club.contact_email}"><i class="fa-solid fa-envelope"></i> Email</a>`;
        socialsRow.innerHTML = socialsHTML || '<p style="opacity:0.6;">No social links available.</p>';
    }

    // 7. Detail View Navigation
    if (prevCatBtn) {
        prevCatBtn.addEventListener('click', () => {
            if (filteredClubs.length === 0) return;
            currentClubIndex = (currentClubIndex - 1 + filteredClubs.length) % filteredClubs.length;
            const club = filteredClubs[currentClubIndex];
            populateClubDetail(club);
        });
    }

    if (nextCatBtn) {
        nextCatBtn.addEventListener('click', () => {
            if (filteredClubs.length === 0) return;
            currentClubIndex = (currentClubIndex + 1) % filteredClubs.length;
            const club = filteredClubs[currentClubIndex];
            populateClubDetail(club);
        });
    }

    if (resBackBtn) {
        resBackBtn.addEventListener('click', () => {
            gsap.to(resultLayout, {
                opacity: 0, y: 20, duration: 0.4, ease: "power2.in",
                onComplete: () => {
                    resultLayout.style.display = 'none';
                    instructionText.style.opacity = 1;
                    const wheelCenterLogo = document.getElementById('wheel-center-logo');
                    if (wheelCenterLogo) gsap.to(wheelCenterLogo, { opacity: 1, duration: 0.4 });
                    
                    // Reset 3D wheel zoom & shift back to explorer ring
                    gsap.to(galleryContainer, { scale: 1, y: 0, duration: 0.6, ease: "power2.out" });
                    
                    state.isRevealed = false;
                    state.isInteractionEnabled = true;
                    cards.forEach((c) => {
                        const s = cardStates[cards.indexOf(c)];
                        if (s) {
                            s.targetRotation = 0;
                            s.targetScale = 1.0;
                        }
                    });
                }
            });
        });
    }
  }

    if (resMainTitle) {
        resMainTitle.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // ==========================================
    // PRODUCTION HEADER & DRAWER & SEARCH HANDLERS
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navDrawerOverlay = document.getElementById('nav-drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    let isSoundMuted = false;

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            audioEffect.muted = isSoundMuted;
            if (soundIcon) {
                soundIcon.className = isSoundMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
            }
        });
    }

    function openDrawer() {
        if (navDrawerOverlay) navDrawerOverlay.classList.add('is-open');
    }

    function closeDrawer() {
        if (navDrawerOverlay) navDrawerOverlay.classList.remove('is-open');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (navDrawerOverlay) {
        navDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === navDrawerOverlay) closeDrawer();
        });
    }

    // Drawer Nav Links
    const menuLinkHome = document.getElementById('menu-link-home');
    const menuLinkTech = document.getElementById('menu-link-tech');
    const menuLinkNontech = document.getElementById('menu-link-nontech');
    const menuLinkAll = document.getElementById('menu-link-all');
    const menuLinkSearch = document.getElementById('menu-link-search');

    if (menuLinkHome) menuLinkHome.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); window.location.reload(); });
    if (menuLinkTech) menuLinkTech.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); triggerCategoryExplorer('Technology'); });
    if (menuLinkNontech) menuLinkNontech.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); triggerCategoryExplorer('Non-Technical'); });
    if (menuLinkAll) menuLinkAll.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); triggerCategoryExplorer('All'); });
    if (menuLinkSearch) menuLinkSearch.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); openSearchModal(); });

    function triggerCategoryExplorer(cat) {
        if (resultLayout) resultLayout.style.display = 'none';
        const panel = document.querySelector(`.cat-panel[data-category="${cat}"]`) || catPanels[0];
        if (panel) panel.click();
    }

    // Instant Search Modal Handlers
    const searchTriggerBtn = document.getElementById('search-trigger-btn');
    const searchModalOverlay = document.getElementById('search-modal-overlay');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const clubSearchInput = document.getElementById('club-search-input');
    const searchResultsList = document.getElementById('search-results-list');

    function openSearchModal() {
        if (searchModalOverlay) {
            searchModalOverlay.classList.add('is-open');
            if (clubSearchInput) {
                clubSearchInput.value = '';
                clubSearchInput.focus();
                renderSearchResults('');
            }
        }
    }

    function closeSearchModal() {
        if (searchModalOverlay) searchModalOverlay.classList.remove('is-open');
    }

    if (searchTriggerBtn) searchTriggerBtn.addEventListener('click', openSearchModal);
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchModal);
    if (searchModalOverlay) {
        searchModalOverlay.addEventListener('click', (e) => {
            if (e.target === searchModalOverlay) closeSearchModal();
        });
    }

    if (clubSearchInput) {
        clubSearchInput.addEventListener('input', (e) => {
            renderSearchResults(e.target.value);
        });
    }

    function renderSearchResults(query) {
        if (!searchResultsList) return;
        const q = (query || '').toLowerCase().trim();
        const matches = clubsData.filter(c => 
            c.club_name.toLowerCase().includes(q) || 
            c.category.toLowerCase().includes(q) || 
            c.tagline.toLowerCase().includes(q)
        );

        if (matches.length === 0) {
            searchResultsList.innerHTML = `<div style="padding:20px; text-align:center; color:#64748b;">No clubs found matching "${query}".</div>`;
            return;
        }

        searchResultsList.innerHTML = matches.map(c => `
            <div class="search-result-item" data-id="${c.club_id}">
                <div style="width:36px; height:36px; border-radius:8px; overflow:hidden; background:#fff; flex-shrink:0; border:1px solid #e2e8f0; padding:2px;">
                    ${renderClubLogoImg(c, 'width:100%; height:100%; object-fit:contain;')}
                </div>
                <div style="flex-grow:1;">
                    <div class="search-result-name">${c.club_name}</div>
                    <div class="search-result-cat">${c.category} ｜ ${c.tagline}</div>
                </div>
                <i class="fa-solid fa-chevron-right" style="color:#cbd5e1; font-size:0.85rem;"></i>
            </div>
        `).join('');

        searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const idx = filteredClubs.findIndex(c => c.club_id === id);
                closeSearchModal();
                if (idx !== -1) {
                    const card = cards[idx] || cards[0];
                    selectAndRevealClub(idx, card);
                } else {
                    const globalIdx = clubsData.findIndex(c => c.club_id === id);
                    if (globalIdx !== -1) {
                        populateClubDetail(clubsData[globalIdx]);
                        resultLayout.style.display = 'flex';
                        gsap.fromTo(resultLayout, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, visibility: 'visible', duration: 0.5 });
                    }
                }
            });
        });
    }

    // Start
    loadClubs();
});