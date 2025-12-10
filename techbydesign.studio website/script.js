let mousePos = { x: 0, y: 0 };
let currentSection = 'home';

// 1. BUBBLES
const bubbleCanvas = document.getElementById('hero-bubbles');
const bubbleCtx = bubbleCanvas.getContext('2d');

function resizeBubbleCanvas() {
    bubbleCanvas.width = window.innerWidth;
    bubbleCanvas.height = window.innerHeight;
}
resizeBubbleCanvas();
window.addEventListener('resize', resizeBubbleCanvas);

class Bubble {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * bubbleCanvas.width;
        this.y = bubbleCanvas.height + Math.random() * 100;
        this.radius = 12 + Math.random() * 16;
        this.speed = 0.4 + Math.random() * 0.8;
        this.alpha = 0.15 + Math.random() * 0.25;
    }
    update() {
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 3;
            this.y += (dy / dist) * force * 3;
        }
        this.y -= this.speed;
        if (this.y + this.radius < 0) this.reset();
    }
    draw() {
        const gradient = bubbleCtx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `rgba(255,255,255,${this.alpha + 0.15})`);
        gradient.addColorStop(0.4, `rgba(186,230,253,${this.alpha})`);
        gradient.addColorStop(1, `rgba(56,189,248,0)`);
        bubbleCtx.beginPath();
        bubbleCtx.fillStyle = gradient;
        bubbleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        bubbleCtx.fill();
    }
}

const bubbles = [];
for (let i = 0; i < 18; i++) bubbles.push(new Bubble());

function animateBubbles() {
    bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
    bubbles.forEach(b => { b.update(); b.draw(); });
    requestAnimationFrame(animateBubbles);
}
animateBubbles();

// 2. CURSOR TRAIL
const trailCanvas = document.getElementById('cursor-trail');
const trailCtx = trailCanvas.getContext('2d');
let trails = [];

trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

window.addEventListener('mousemove', e => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    trails.push({ x: e.clientX, y: e.clientY, alpha: 0.4, life: 60 });
    if (trails.length > 10) trails.shift();
});

window.addEventListener('resize', () => {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
});

function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    trails.forEach((trail, i) => {
        trail.life--;
        trail.alpha *= 0.95;
        trailCtx.beginPath();
        trailCtx.arc(trail.x, trail.y, 8, 0, Math.PI * 2);
        trailCtx.fillStyle = `rgba(14, 165, 233, ${trail.alpha})`;
        trailCtx.fill();
    });
    trails = trails.filter(t => t.life > 0);
    requestAnimationFrame(animateTrail);
}
animateTrail();

// 3. TYPEWRITER LOGO (JUST LOGO - NO EXTRA WORDS)
const typewriterText = document.querySelector('.typewriter-text');
const fullText = 'techbydesign.studio';
let i = 0;

function typeWriter() {
    if (i < fullText.length) {
        typewriterText.textContent += fullText[i];
        i++;
        setTimeout(typeWriter, 100);
    } else {
        setTimeout(() => {
            typewriterText.textContent = '';
            i = 0;
            typeWriter();
        }, 3000);
    }
}
setTimeout(typeWriter, 1500);

// 4. QUIZ
document.querySelectorAll('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const results = {
            sprint: "Sprint Studio: 2-week cycles, daily syncs, rapid prototypes",
            precision: "Precision Build: Fixed scope, detailed specs, pixel-perfect delivery", 
            creative: "Creative Flow: Open iterations, design sprints, evolving vision"
        };
        
        const quizResult = document.getElementById('quiz-result');
        quizResult.innerHTML = `
            <div>${results[btn.dataset.mode]}</div>
            <button class="btn btn-primary" onclick="document.querySelector('#contact').scrollIntoView({behavior: 'smooth'})" style="margin-top: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                Let's work this way →
            </button>
        `;
        quizResult.style.display = 'block';
    });
});

// 5. RADAR CHART
const radarCanvas = document.getElementById('skill-radar');
const radarCtx = radarCanvas.getContext('2d');
const skills = ['Java', 'Swing', 'HTML/CSS', 'JavaScript', 'Figma', 'NetBeans'];

function drawRadar() {
    radarCtx.clearRect(0, 0, 300, 300);
    const cx = 150, cy = 150, maxRadius = 110;
    
    radarCtx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    radarCtx.lineWidth = 1;
    for (let r = 1; r <= 5; r++) {
        radarCtx.beginPath();
        radarCtx.arc(cx, cy, (maxRadius * r) / 5, 0, Math.PI * 2);
        radarCtx.stroke();
    }
    
    radarCtx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    for (let i = 0; i < skills.length; i++) {
        const angle = (Math.PI * 2 * i) / skills.length;
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius);
        radarCtx.stroke();
    }
    
    radarCtx.fillStyle = '#0f172a';
    radarCtx.font = 'bold 11px monospace';
    radarCtx.textAlign = 'center';
    radarCtx.textBaseline = 'middle';
    for (let i = 0; i < skills.length; i++) {
        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
        const x = cx + Math.cos(angle) * (maxRadius + 20);
        const y = cy + Math.sin(angle) * (maxRadius + 20);
        radarCtx.fillText(skills[i], x, y);
    }
    
    const time = Date.now() * 0.001;
    const levels = [0.95, 0.92, 0.88, 0.85, 0.82, 0.78];
    radarCtx.strokeStyle = `rgba(14, 165, 233, 0.8)`;
    radarCtx.lineWidth = 3;
    radarCtx.lineCap = 'round';
    radarCtx.beginPath();
    for (let i = 0; i < skills.length; i++) {
        const angle = (Math.PI * 2 * i) / skills.length;
        const level = levels[i] + Math.sin(time + i) * 0.02;
        const x = cx + Math.cos(angle) * maxRadius * level;
        const y = cy + Math.sin(angle) * maxRadius * level;
        if (i === 0) radarCtx.moveTo(x, y);
        else radarCtx.lineTo(x, y);
    }
    radarCtx.closePath();
    radarCtx.stroke();
    
    const gradient = radarCtx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
    radarCtx.fillStyle = gradient;
    radarCtx.fill();
    
    requestAnimationFrame(drawRadar);
}
drawRadar();

// 6. DARK MODE TOGGLE
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

// 7. STATS COUNTER (2 stats only)
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const current = parseInt(counter.textContent) || 0;
        const increment = target / 100;
        if (current < target) {
            counter.textContent = Math.ceil(current + increment);
            requestAnimationFrame(animateCounters);
        } else {
            counter.textContent = target + (target === 100 ? '%' : '');
        }
    });
}

// 8. LIVE CODING MODAL
const liveCodingBtn = document.getElementById('live-coding-btn');
const liveModal = document.getElementById('live-coding-modal');
const liveTerminalBody = document.getElementById('live-terminal-body');

const liveCodeLines = [
    'npm start // Studio server live [00:01]',
    'mvn clean compile // Java build OK [1.2s]',
    'git add . && git commit -m "feat: radar chart"',
    'deploy to Vercel // Live in 2s [SUCCESS]',
    'yarn add glassmorphism-ui // v2.1.3',
    'java -jar StudioApp.jar // Swing UI ready',
    'echo "50+ projects shipped" // Complete!'
];

function startLiveCoding() {
    liveTerminalBody.innerHTML = '';
    let lineIndex = 0;
    
    function typeNextLine() {
        if (lineIndex < liveCodeLines.length) {
            const line = document.createElement('div');
            line.className = 'terminal-line demo';
            liveTerminalBody.appendChild(line);
            
            let charIndex = 0;
            function typeChar() {
                if (charIndex < liveCodeLines[lineIndex].length) {
                    line.textContent += liveCodeLines[lineIndex][charIndex];
                    charIndex++;
                    setTimeout(typeChar, 30);
                } else {
                    lineIndex++;
                    setTimeout(typeNextLine, 1000);
                }
            }
            typeChar();
        } else {
            setTimeout(startLiveCoding, 2000);
        }
    }
    typeNextLine();
}

liveCodingBtn.addEventListener('click', () => {
    liveModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    startLiveCoding();
});

// Close modal
liveModal.addEventListener('click', (e) => {
    if (e.target === liveModal) {
        liveModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && liveModal.classList.contains('active')) {
        liveModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// 9. GLOBAL EFFECTS
window.addEventListener('load', () => {
    document.getElementById('loader').style.opacity = '0';
    setTimeout(() => document.getElementById('loader').remove(), 500);
    setTimeout(animateCounters, 2500);
});

window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 100);
    
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !el.classList.contains('active')) {
            el.classList.add('active');
            if (el.querySelector('.stats-counter')) animateCounters();
        }
    });
});

// 10. NAVBAR SMOOTH SCROLL
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
