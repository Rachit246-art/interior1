document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3D Card Tilt Effect
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation based on cursor position relative to center
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform when mouse leaves
            card.style.transform = 'rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            // Remove transition during hover for instant response
            card.style.transition = 'none';
        });
    });

    // Dynamically add animation classes to elements
    const elementsToAnimate = document.querySelectorAll('.section-header, .service-card, .timeline-item, .card-wrapper, .echo-card, .contact-container');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        const delay = (index % 3) * 100; 
        if(delay > 0) el.classList.add(`delay-${delay}`);
    });

    // Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // ==========================================
    // Royal Hero Showcase: Slider + Parallax + Sparkles Engine
    // ==========================================
    const heroSlider = document.querySelector('.hero-slider');
    const sliderViewport = document.getElementById('sliderViewport');
    const sliderTrack = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dots = document.querySelectorAll('.dot');
    const progressFill = document.getElementById('sliderProgressFill');
    const counterCur = document.querySelector('.slider-counter .cur-index');
    const heroBadge = document.getElementById('heroBadge');
    

    if (sliderTrack && slides.length > 0) {
        let currentIndex = 0;
        let progressAnimFrame = null;
        const autoSlideDelay = 5200; // 5.2s per slide
        let progressStartTime = 0;
        let isPaused = false;
        let elapsedBeforePause = 0;

        // --- Slide Update ---
        const updateSlider = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;

            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            slides.forEach((s, idx) => {
                if (idx === currentIndex) {
                    s.classList.add('active-slide');
                } else {
                    s.classList.remove('active-slide');
                }
            });

            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            if (counterCur) {
                counterCur.textContent = String(currentIndex + 1).padStart(2, '0');
            }

            resetProgress();
        };

        // --- Progress Bar Animation ---
        const startProgress = () => {
            if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);
            progressStartTime = performance.now() - elapsedBeforePause;

            const step = (now) => {
                if (isPaused) return;
                const elapsed = now - progressStartTime;
                const pct = Math.min((elapsed / autoSlideDelay) * 100, 100);

                if (progressFill) {
                    progressFill.style.width = `${pct}%`;
                }

                if (elapsed >= autoSlideDelay) {
                    elapsedBeforePause = 0;
                    updateSlider(currentIndex + 1);
                    startProgress();
                } else {
                    progressAnimFrame = requestAnimationFrame(step);
                }
            };
            progressAnimFrame = requestAnimationFrame(step);
        };

        const resetProgress = () => {
            elapsedBeforePause = 0;
            if (progressFill) progressFill.style.width = '0%';
            if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);
            if (!isPaused) {
                startProgress();
            }
        };

        const pauseSlider = () => {
            if (!isPaused) {
                isPaused = true;
                elapsedBeforePause = performance.now() - progressStartTime;
                if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);
            }
        };

        const resumeSlider = () => {
            if (isPaused) {
                isPaused = false;
                startProgress();
            }
        };

        // Controls
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateSlider(currentIndex + 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateSlider(currentIndex - 1);
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
                updateSlider(targetIdx);
            });
        });

        // Hover pause on slider
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', pauseSlider);
            heroSlider.addEventListener('mouseleave', resumeSlider);
        }

        // Touch swipe gestures
        let touchStartX = 0;
        let touchEndX = 0;
        if (heroSlider) {
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                pauseSlider();
            }, { passive: true });

            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 45) {
                    if (diff > 0) updateSlider(currentIndex + 1);
                    else updateSlider(currentIndex - 1);
                }
                resumeSlider();
            }, { passive: true });
        }

        // Initialize progress
        updateSlider(0);
        startProgress();
    }


    // ---- Occasions slider ----
    const occTrack = document.getElementById("occTrack");
    const occPrev = document.getElementById("occPrev");
    const occNext = document.getElementById("occNext");
    if (occTrack && occPrev && occNext) {
        occPrev.addEventListener("click", () => occTrack.scrollBy({ left: -220, behavior: "smooth" }));
        occNext.addEventListener("click", () => occTrack.scrollBy({ left: 220, behavior: "smooth" }));
    }

    // ---- Featured cards slider (smooth auto-slide + arrow navigation) ----
    const featTrack = document.getElementById("featTrack");
    const featPrev = document.getElementById("featPrev");
    const featNext = document.getElementById("featNext");

    if (featTrack) {
        let featAutoSlideInterval;
        const featDelay = 3200; // 3.2s smooth auto-scroll

        const getScrollAmount = () => {
            const firstCard = featTrack.querySelector(".feat-card");
            return firstCard ? firstCard.offsetWidth + 24 : 224;
        };

        const slideNextCard = () => {
            const step = getScrollAmount();
            const maxScroll = featTrack.scrollWidth - featTrack.clientWidth;
            
            if (featTrack.scrollLeft >= maxScroll - 20) {
                featTrack.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                featTrack.scrollBy({ left: step, behavior: "smooth" });
            }
        };

        const slidePrevCard = () => {
            const step = getScrollAmount();
            if (featTrack.scrollLeft <= 20) {
                featTrack.scrollTo({ left: featTrack.scrollWidth - featTrack.clientWidth, behavior: "smooth" });
            } else {
                featTrack.scrollBy({ left: -step, behavior: "smooth" });
            }
        };

        const startFeatAutoSlide = () => {
            stopFeatAutoSlide();
            featAutoSlideInterval = setInterval(slideNextCard, featDelay);
        };

        const stopFeatAutoSlide = () => {
            if (featAutoSlideInterval) clearInterval(featAutoSlideInterval);
        };

        if (featNext) {
            featNext.addEventListener("click", () => {
                slideNextCard();
                startFeatAutoSlide();
            });
        }

        if (featPrev) {
            featPrev.addEventListener("click", () => {
                slidePrevCard();
                startFeatAutoSlide();
            });
        }

        // Pause on mouse hover & resume on mouse leave
        featTrack.addEventListener("mouseenter", stopFeatAutoSlide);
        featTrack.addEventListener("mouseleave", startFeatAutoSlide);
        featTrack.addEventListener("touchstart", stopFeatAutoSlide, { passive: true });
        featTrack.addEventListener("touchend", startFeatAutoSlide, { passive: true });

        // Start auto-slide on page load
        startFeatAutoSlide();
    }


    // ---- Staggered Occasion items entrance ----
    const occItems = document.querySelectorAll(".occ-item");
    const occObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            occItems.forEach((item, i) => {
                setTimeout(() => {
                    item.classList.add("occ-visible");
                }, i * 80);
            });
            occObserver.disconnect();
        }
    }, { threshold: 0.2 });
    if (occItems.length) occObserver.observe(occItems[0].closest("section"));

    // Occasion click active pulse
    occItems.forEach(item => {
        item.addEventListener("click", () => {
            occItems.forEach(i => i.classList.remove("active-occ"));
            item.classList.add("active-occ");
        });
    });

    // ---- General scroll reveal ----
    const revealEls = document.querySelectorAll(
        ".feat-card, .testi-card, .why-feat, .why-quote, .why-header-wrap, .g-item, .process-card, .process-showcase, .nl-inner, .contact-container, .feat-sidebar"
    );
    revealEls.forEach((el, i) => {
        el.classList.add("reveal");
        if (i % 4 === 1) el.classList.add("reveal-delay-1");
        else if (i % 4 === 2) el.classList.add("reveal-delay-2");
        else if (i % 4 === 3) el.classList.add("reveal-delay-3");
    });

    const revObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(el => revObserver.observe(el));

    // ---- Gallery Category Filter Logic ----
    const filterBtns = document.querySelectorAll(".g-filter");
    const galleryItems = document.querySelectorAll(".g-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            galleryItems.forEach(item => {
                const category = item.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    item.classList.remove("filtered-out");
                    item.style.animation = "fadeInScale 0.45s ease forwards";
                } else {
                    item.classList.add("filtered-out");
                }
            });
        });
    });

    // ---- Gallery Lightbox Modal Controller ----
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxTag = document.getElementById("lightboxTag");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDesc = document.getElementById("lightboxDesc");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    if (lightbox && galleryItems.length > 0) {
        let currentGalleryIndex = 0;

        // Collect visible gallery item data
        const getGalleryData = () => {
            const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains("filtered-out"));
            return visibleItems.map(item => {
                const img = item.querySelector("img");
                const tag = item.querySelector(".g-tag");
                const title = item.querySelector("h3");
                const desc = item.querySelector("p");
                return {
                    src: img ? img.getAttribute("src") : "",
                    alt: img ? img.getAttribute("alt") : "Gallery Image",
                    tag: tag ? tag.textContent : "Real Celebration",
                    title: title ? title.textContent : "",
                    desc: desc ? desc.textContent : ""
                };
            });
        };

        const updateLightboxContent = (index) => {
            const data = getGalleryData();
            if (data.length === 0) return;

            if (index < 0) index = data.length - 1;
            if (index >= data.length) index = 0;
            currentGalleryIndex = index;

            const item = data[currentGalleryIndex];

            // Smooth fade transition
            lightboxImg.style.opacity = "0";
            lightboxImg.style.transform = "scale(0.96)";

            setTimeout(() => {
                lightboxImg.src = item.src;
                lightboxImg.alt = item.alt;
                if (lightboxTag) lightboxTag.textContent = item.tag;
                if (lightboxTitle) lightboxTitle.textContent = item.title;
                if (lightboxDesc) lightboxDesc.textContent = item.desc;
                if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${data.length}`;

                lightboxImg.style.opacity = "1";
                lightboxImg.style.transform = "scale(1)";
            }, 150);
        };

        const openLightbox = (index) => {
            currentGalleryIndex = index;
            updateLightboxContent(currentGalleryIndex);
            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden"; // Lock background scroll
        };

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        };

        // Attach click to all gallery items
        galleryItems.forEach(item => {
            item.addEventListener("click", () => {
                const data = getGalleryData();
                const imgSrc = item.querySelector("img")?.getAttribute("src");
                const idx = data.findIndex(d => d.src === imgSrc);
                openLightbox(idx !== -1 ? idx : 0);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener("click", () => updateLightboxContent(currentGalleryIndex - 1));
        if (lightboxNext) lightboxNext.addEventListener("click", () => updateLightboxContent(currentGalleryIndex + 1));

        // Click outside image to close
        const backdrop = lightbox.querySelector(".lightbox-backdrop");
        if (backdrop) backdrop.addEventListener("click", closeLightbox);

        // Keyboard navigation (Esc to close, Left/Right arrows)
        window.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            if (e.key === "Escape") closeLightbox();
            else if (e.key === "ArrowLeft") updateLightboxContent(currentGalleryIndex - 1);
            else if (e.key === "ArrowRight") updateLightboxContent(currentGalleryIndex + 1);
        });
    }



    // ---- Premium Occasions Slider (Manual) ----
    const occT = document.getElementById("occTrack");
    const occP = document.getElementById("occPrev");
    const occN = document.getElementById("occNext");
    const occItemEls = document.querySelectorAll(".occ-item");

    if (occT && occP && occN) {
        let occActiveIdx = 0;

        function scrollToOccItem(idx) {
            if (idx < 0) idx = occItemEls.length - 1;
            if (idx >= occItemEls.length) idx = 0;
            occActiveIdx = idx;

            occItemEls.forEach(i => i.classList.remove("selected"));
            occItemEls[occActiveIdx].classList.add("selected");

            const item = occItemEls[occActiveIdx];
            const trackRect = occT.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const scrollLeft = occT.scrollLeft + (itemRect.left - trackRect.left) - (trackRect.width / 2) + (itemRect.width / 2);
            occT.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }

        occP.addEventListener("click", () => scrollToOccItem(occActiveIdx - 1));
        occN.addEventListener("click", () => scrollToOccItem(occActiveIdx + 1));

        occItemEls.forEach((item, i) => {
            item.addEventListener("click", () => scrollToOccItem(i));
        });

        // Init first item selected
        if (occItemEls.length > 0) {
            occItemEls[0].classList.add("selected");
        }
    }




    // ==========================================
    // Inner Pages Interactions & Micro-animations
    // ==========================================

    // Active Navigation Link Highlight
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanPath = rawPath.replace(/\.html$/, '');

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        link.style.color = '';
        const href = (link.getAttribute('href') || '').split('#')[0];
        const cleanHref = href.replace(/\.html$/, '');

        const isHome = (cleanPath === '' || cleanPath === 'index') && (cleanHref === '' || cleanHref === 'index');
        const isPage = cleanPath !== '' && cleanPath !== 'index' && cleanHref === cleanPath;

        if (isHome || isPage) {
            link.classList.add('active');
            link.style.color = 'var(--gold-bright, #B89344)';
        }
    });

    // FAQ Accordion Interaction
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close other items
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Filter Pills Interaction (Portfolio & Spaces Pages)
    const portfolioFilters = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');
    if (portfolioFilters.length && projectCards.length) {
        const applyFilter = (filter) => {
            let matchedPill = false;
            portfolioFilters.forEach(p => {
                if (p.getAttribute('data-filter') === filter) {
                    p.classList.add('active');
                    matchedPill = true;
                } else {
                    p.classList.remove('active');
                }
            });
            if (!matchedPill && portfolioFilters[0]) {
                portfolioFilters[0].classList.add('active');
                filter = 'all';
            }

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        portfolioFilters.forEach(pill => {
            pill.addEventListener('click', () => {
                const filter = pill.getAttribute('data-filter');
                applyFilter(filter);
            });
        });

        // Check if filter parameter is provided in URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilter = urlParams.get('filter');
        if (urlFilter) {
            applyFilter(urlFilter);
        }
    }

    // VIP Contact Form Pill Selection
    const vipPills = document.querySelectorAll('.vip-pill-btn');
    vipPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = pill.closest('.vip-pills-row');
            if (parent) {
                parent.querySelectorAll('.vip-pill-btn').forEach(p => p.classList.remove('active'));
            }
            pill.classList.add('active');
            const hiddenInput = parent ? parent.previousElementSibling : null;
            if (hiddenInput && hiddenInput.tagName === 'INPUT') {
                hiddenInput.value = pill.textContent.trim();
            }
        });
    });

    // Smooth Form Submissions with Toast
    const formsToHandle = document.querySelectorAll('.vip-contact-form, .nl-form');
    formsToHandle.forEach(f => {
        if (!f.hasAttribute('data-handled')) {
            f.setAttribute('data-handled', 'true');
            f.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = f.querySelector('button[type="submit"]');
                const originalText = btn ? btn.innerHTML : 'Submit';
                if (btn) {
                    btn.innerHTML = '&#10003; Request Received';
                    btn.style.background = 'linear-gradient(135deg, #1C3B2F, #2A5A48)';
                }
                setTimeout(() => {
                    alert('Thank you for connecting with the Amanthran Atelier. A principal architect will contact you directly within 24 hours.');
                    f.reset();
                    if (btn) btn.innerHTML = originalText;
                }, 400);
            });
        }
    });

});
