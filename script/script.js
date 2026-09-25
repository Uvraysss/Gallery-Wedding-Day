// ============ ระบุหน้าปัจจุบัน และไฮไลต์เมนูที่ตรงกัน ============

document.addEventListener('DOMContentLoaded', () => {
    const current = document.body.dataset.page;
    document.querySelectorAll('.navlink, .bottom-nav a').forEach(el => {
        if (el.dataset.page === current) {
            el.classList.add('active');
        }
    });
});

// ============ หัวใจลอย ============
const ambient = document.getElementById('ambientHeart');
if (ambient) {
    const heartChars = [
        '💗', '💕', '🤍', '💛',
        '♡', '♥', '💜', '💖'
    ];
    
    for (let i = 0; i < 14; i++) {
        const s = document.createElement('span');
        s.textContent = heartChars[i % heartChars.length];
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDuration =
            (14 + Math.random() * 10) + 's';
        s.style.animationDelay =
            (Math.random() * 14) + 's';
        s.style.fontSize =
            (14 + Math.random() * 14) + 'px';
        ambient.appendChild(s);
    }
}

// ============ Gallery Lightbox ============
document
    .querySelectorAll('.photo-slot:not(.empty) img')
    .forEach(img => {
        img.addEventListener('click', () => {
            const lightbox =
                document.getElementById('lightbox');
            const lightboxImg =
                document.getElementById('lightboxImg');
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('show');
        });
    });

    const lightbox =
        document.getElementById('lightbox');
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
        if (
            e.target === lightbox ||
            e.target.classList.contains('lightbox-close')
        ) {
            lightbox.classList.remove('show');
        }
    });
}

// ============ ระบบแตะหัวใจ (เฉพาะหน้าครอบครัว) ============
const heartBtn =
    document.getElementById('heartBtn');

if (heartBtn) {
    const TARGET = 27;
    let taps = 0;
    const heartFill =
        document.getElementById('heartFill');
    const heartLabel =
        document.getElementById('heartLabel');
    const heartHint =
        document.getElementById('heartHint');
    const familyReveal =
        document.getElementById('familyReveal');
    const wishButton =
        document.getElementById('wishButton');

    heartBtn.addEventListener('click', (e) => {
        if (taps >= TARGET) return;
        taps++;
        const pct =
            Math.min(taps / TARGET, 1);

        if (heartFill) {
            heartFill.setAttribute(
                'y',
                100 - pct * 100
            );
            heartFill.setAttribute(
                'height',
                pct * 100
            );
        }

        if (heartLabel) {
            heartLabel.textContent =
                taps + ' / ' + TARGET;
        }

        // หัวใจเล็ก ๆ ลอยขึ้นตอนแตะ
        const mini =
            document.createElement('div');
        mini.className = 'mini-heart';
        mini.textContent = '💖';
        mini.style.left =
            e.clientX + 'px';
        mini.style.top =
            e.clientY + 'px';
        mini.style.setProperty(
            '--dx',
            (Math.random() * 60 - 30) + 'px'
        );
        
        document.body.appendChild(mini);
        setTimeout(() => {
            mini.remove();
        }, 900);

        // เมื่อกดครบ 27 ครั้ง
        if (taps === TARGET) {
            if (heartHint) {
                heartHint.textContent =
                    'ครบแล้ว! 🎉';
            }
            if (familyReveal) {
                familyReveal.classList.add('show');
            }
            if (wishButton) {
                wishButton.classList.add('show');
            }
        } else if (taps > TARGET * 0.6) {
            if (heartHint) {
                heartHint.textContent =
                    'ใกล้แล้ว อีกนิดเดียว...';
            }
        }
    });
}

// ============ Timeline Animation ============
const tlItems =
    document.querySelectorAll('.tl-item');
if (tlItems.length) {
    const tlObserver =
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    tlObserver.unobserve(
                        entry.target
                    );
                }
            });
        }, {
            threshold: 0.2
        });
        
    tlItems.forEach((item, i) => {
        item.style.transitionDelay =
            (i * 0.12) + 's';
        tlObserver.observe(item);
    });
}

// ============ กระดานฝากคำอวยพร ============
const wishGrid = document.getElementById('wishGrid');
const submitWish = document.getElementById('submitWish');

if (wishGrid && submitWish) {
    const STORAGE_KEY = 'anniversary_guest_wishes';
    function makeWishCard(name, message, animate, id) {
        const card = document.createElement('div');
        card.className =
            'wish-card' + (animate ? ' new' : '');
        card.innerHTML =
            '<div class="wish-from"></div>' +
            '<div class="wish-text"></div>' +
            '<button class="delete-wish" type="button">ยกเลิกคำอวยพร 🥺</button>';
        card.querySelector('.wish-from').textContent =
            name ? 'จาก ' + name : 'จากแขกในงาน';
        card.querySelector('.wish-text').textContent =
            message;

        // ปุ่มลบ
        card.querySelector('.delete-wish').addEventListener(
            'click',
            () => {
                const saved = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) || '[]'
                );
                saved.splice(id, 1);
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(saved)
                );
                card.remove();
            }
        );
        return card;
    }

    // โหลดคำอวยพร
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        );
        saved.forEach((w, index) => {
            wishGrid.appendChild(
                makeWishCard(
                    w.name,
                    w.message,
                    false,
                    index
                )
            );
        });
    } catch (err) {
        console.error(
            'โหลดคำอวยพรไม่สำเร็จ',
            err
        );
    }

    // ฝากคำอวยพร
    submitWish.addEventListener('click', () => {
        const nameInput =
            document.getElementById('guestName');
        const messageInput =
            document.getElementById('guestMessage');
        const message =
            messageInput.value.trim();
        if (!message) {
            messageInput.focus();
            return;
        }

        const name =
            nameInput.value.trim();

        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || '[]'
            );
            saved.unshift({
                name: name,
                message: message
            });
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(saved)
            );

            // เพิ่มการ์ดใหม่ด้านบน
            wishGrid.prepend(
                makeWishCard(
                    name,
                    message,
                    true,
                    0
                )
            );

            nameInput.value = '';
            messageInput.value = '';

        } catch (err) {
            console.error(
                'บันทึกคำอวยพรไม่สำเร็จ',
                err
            );
        }
    });
}

const sendLoveBtn = document.getElementById('submitWish');
if (sendLoveBtn) {
  const loveEmojis = ['💗', '🌸', '🌷', '💐', '🌼'];
  sendLoveBtn.addEventListener('click', () => {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'love-burst-piece';
      piece.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.fontSize = (16 + Math.random() * 16) + 'px';
      piece.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4200);
    }
  });
}