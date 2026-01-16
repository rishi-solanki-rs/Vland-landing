// // ============================================================================
// // VLANDS - PROFESSIONAL GSAP ANIMATIONS SUITE
// // Full-featured animation system with advanced GSAP functionality
// // ============================================================================

// // Wait for GSAP and page to load
// window.addEventListener('DOMContentLoaded', () => {
    
//     // Safety check - ensure content is visible even if GSAP fails
//     setTimeout(() => {
//         const allContent = document.querySelectorAll('.hero-section, .map-container, .property-card, .trust-block, .promo-content');
//         allContent.forEach(el => {
//             if (el && el.style.opacity === '0') {
//                 el.style.opacity = '1';
//             }
//         });
//     }, 1000);
    
//     // Check if GSAP is loaded
//     if (typeof gsap === 'undefined') {
//         console.warn('GSAP not loaded, content will be visible without animations');
//         return;
//     }
    
//     // Register GSAP plugins (only if they exist)
//     try {
//         if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
//         if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);
//         if (typeof MorphSVGPlugin !== 'undefined') gsap.registerPlugin(MorphSVGPlugin);
//     } catch(e) {
//         console.warn('Some GSAP plugins not available:', e);
//     }
    
//     // ========================================================================
//     // GLOBAL ANIMATION SETTINGS & UTILS
//     // ========================================================================
    
//     // Global timeline for coordinated animations
//     const masterTimeline = gsap.timeline({ paused: true });
    
//     // Custom easing curves
//     const customEase = {
//         smooth: "power2.inOut",
//         bounce: "back.out(1.7)",
//         elastic: "elastic.out(1, 0.3)",
//         expo: "expo.out",
//         dramatic: "power4.out"
//     };
    
//     // Animation state management
//     const animationState = {
//         pageLoaded: false,
//         heroRevealed: false,
//         mapInitialized: false,
//         statsAnimated: false
//     };
    
//     // Performance optimization
//     gsap.config({ 
//         force3D: true, 
//         nullTargetWarn: false,
//         trialWarn: false 
//     });
    
//     // ========================================================================
//     // 1. ADVANCED LOADING & PRELOADER ANIMATIONS
//     // ========================================================================
    
//     function initPreloader() {
//         // Create dynamic preloader if it doesn't exist
//         if (!document.querySelector('.preloader')) {
//             const preloader = document.createElement('div');
//             preloader.className = 'preloader';
//             preloader.innerHTML = `
//                 <div class="preloader-content">
//                     <div class="vlands-logo">
//                         <span class="logo-v">V</span>
//                         <span class="logo-lands">lands</span>
//                     </div>
//                     <div class="loading-bar">
//                         <div class="loading-fill"></div>
//                     </div>
//                     <div class="loading-text">Loading your future...</div>
//                 </div>
//             `;
            
//             // Add preloader styles
//             const style = document.createElement('style');
//             style.textContent = `
//                 .preloader {
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     width: 100%;
//                     height: 100%;
//                     background: linear-gradient(135deg, var(--color-charcoal-dark) 0%, var(--color-green-vibrant) 100%);
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     z-index: 10000;
//                     opacity: 1;
//                 }
//                 .preloader-content { text-align: center; color: white; }
//                 .vlands-logo { font-size: 4rem; font-weight: 800; margin-bottom: 2rem; }
//                 .logo-v { color: var(--color-gold-warm); }
//                 .logo-lands { color: var(--color-white-soft); }
//                 .loading-bar {
//                     width: 300px;
//                     height: 4px;
//                     background: rgba(255,255,255,0.2);
//                     border-radius: 2px;
//                     overflow: hidden;
//                     margin: 2rem auto;
//                 }
//                 .loading-fill {
//                     width: 0%;
//                     height: 100%;
//                     background: linear-gradient(90deg, var(--color-gold-warm), var(--color-green-sage));
//                     border-radius: 2px;
//                 }
//                 .loading-text {
//                     font-size: 1.2rem;
//                     opacity: 0.8;
//                     font-weight: 500;
//                 }
//             `;
//             document.head.appendChild(style);
//             document.body.appendChild(preloader);
//         }
        
//         // Animate preloader
//         const preloaderTL = gsap.timeline({
//             onComplete: () => {
//                 animationState.pageLoaded = true;
//                 initHeroAnimations();
//             }
//         });
        
//         preloaderTL
//             .from('.vlands-logo', { 
//                 y: 50, 
//                 opacity: 0, 
//                 duration: 1, 
//                 ease: customEase.bounce 
//             })
//             .from('.loading-bar', { 
//                 scaleX: 0, 
//                 duration: 0.5, 
//                 ease: customEase.smooth 
//             }, '-=0.5')
//             .to('.loading-fill', { 
//                 width: '100%', 
//                 duration: 2, 
//                 ease: customEase.smooth 
//             })
//             .from('.loading-text', { 
//                 y: 20, 
//                 opacity: 0, 
//                 duration: 0.8, 
//                 ease: customEase.smooth 
//             }, '-=1.5')
//             .to('.loading-text', {
//                 text: "Welcome to Vlands",
//                 duration: 1,
//                 ease: "none"
//             })
//             .to('.preloader', { 
//                 y: '-100%', 
//                 duration: 1.2, 
//                 ease: customEase.dramatic,
//                 delay: 0.5
//             })
//             .set('.preloader', { display: 'none' });
//     }
    
//     // ========================================================================
//     // 2. ADVANCED HERO SECTION ANIMATIONS
//     // ========================================================================
    
//     function initHeroAnimations() {
//         if (animationState.heroRevealed) return;
//         animationState.heroRevealed = true;
        
//         const heroTL = gsap.timeline();
        
//         // Split text for character-by-character animation
//         const heroTitle = document.querySelector('.hero-section h1');
//         if (heroTitle) {
//             const chars = heroTitle.textContent.split('');
//             heroTitle.innerHTML = chars.map(char => 
//                 char === ' ' ? ' ' : `<span class="char">${char}</span>`
//             ).join('');
//         }
        
//         heroTL
//             // Animate background with parallax effect
//             .fromTo('.hero-section', {
//                 backgroundPosition: 'center 100px'
//             }, {
//                 backgroundPosition: 'center center',
//                 duration: 2,
//                 ease: customEase.smooth
//             })
            
//             // Character-by-character title reveal
//             .from('.hero-section .char', {
//                 y: 100,
//                 opacity: 0,
//                 rotation: 15,
//                 duration: 0.8,
//                 stagger: {
//                     each: 0.02,
//                     from: "start",
//                     ease: customEase.bounce
//                 }
//             }, 0.5)
            
//             // Hero paragraph with morphing effect
//             .from('.hero-section p', {
//                 y: 50,
//                 opacity: 0,
//                 scale: 0.9,
//                 duration: 1.2,
//                 ease: customEase.elastic
//             }, '-=0.5')
            
//             // Add floating particles effect
//             .call(createFloatingParticles, ['.hero-section'], 1);
        
//         // Slow upward scrolling animation for hero images
//         const scrollTrack = document.querySelector('.scroll-image-track');
//         if (scrollTrack) {
//             // Slower animation - 15 seconds for smooth effect
//             gsap.to(scrollTrack, {
//                 y: '-50%',
//                 duration: 15,
//                 repeat: -1,
//                 ease: "none"
//             });
//         }
//     }
    
//     // ========================================================================
//     // 3. ADVANCED HEADER & NAVIGATION ANIMATIONS
//     // ========================================================================
    
//     function initHeaderAnimations() {
//         const header = document.querySelector('.header');
//         if (!header) return;
        
//         // Simple scroll-based header animation that works both ways
//         let lastScrollY = window.scrollY;
        
//         function updateHeader() {
//             const scrollY = window.scrollY;
            
//             if (scrollY > 50) {
//                 // Scrolled down - make header white
//                 if (!header.classList.contains('scrolled')) {
//                     gsap.to(header, {
//                         background: "rgba(255, 255, 255, 0.95)",
//                         backdropFilter: "blur(20px) saturate(180%)",
//                         borderBottom: "1px solid rgba(60, 141, 124, 0.2)",
//                         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
//                         duration: 0.5,
//                         ease: customEase.smooth
//                     });
                    
//                     gsap.to('.nav-menu a', {
//                         color: 'var(--color-charcoal-dark)',
//                         duration: 0.5,
//                         stagger: 0.1
//                     });
                    
//                     gsap.to('.logo', {
//                         color: 'var(--color-green-vibrant)',
//                         scale: 1.05,
//                         duration: 0.5,
//                         ease: customEase.bounce
//                     });
                    
//                     header.classList.add('scrolled');
//                 }
//             } else {
//                 // At top - make header transparent
//                 if (header.classList.contains('scrolled')) {
//                     gsap.to(header, {
//                         background: "transparent",
//                         backdropFilter: "none",
//                         borderBottom: "1px solid transparent",
//                         boxShadow: "none",
//                         duration: 0.5,
//                         ease: customEase.smooth
//                     });
                    
//                     gsap.to('.nav-menu a', {
//                         color: 'var(--color-white-soft)',
//                         duration: 0.5,
//                         stagger: 0.1
//                     });
                    
//                     gsap.to('.logo', {
//                         color: 'var(--color-white-soft)',
//                         scale: 1,
//                         duration: 0.5,
//                         ease: customEase.smooth
//                     });
                    
//                     header.classList.remove('scrolled');
//                 }
//             }
//             lastScrollY = scrollY;
//         }
        
//         // Initial check
//         updateHeader();
        
//         // Listen to scroll events
//         window.addEventListener('scroll', updateHeader, { passive: true });
        
//         // Also use ScrollTrigger for better performance
//         ScrollTrigger.create({
//             trigger: "body",
//             start: "top -50px",
//             end: "bottom bottom",
//             onEnter: () => updateHeader(),
//             onLeaveBack: () => updateHeader(),
//             onUpdate: () => updateHeader()
//         });
        
//         // Navigation hover animations
//         document.querySelectorAll('.nav-menu a').forEach(link => {
//             const underline = document.createElement('span');
//             underline.className = 'nav-underline';
//             underline.style.cssText = `
//                 position: absolute;
//                 bottom: -5px;
//                 left: 0;
//                 width: 100%;
//                 height: 2px;
//                 background: var(--color-green-vibrant);
//                 transform: scaleX(0);
//                 transform-origin: left;
//             `;
//             link.style.position = 'relative';
//             link.appendChild(underline);
            
//             link.addEventListener('mouseenter', () => {
//                 gsap.to(underline, {
//                     scaleX: 1,
//                     duration: 0.3,
//                     ease: customEase.smooth
//                 });
                
//                 gsap.to(link, {
//                     y: -2,
//                     duration: 0.3,
//                     ease: customEase.smooth
//                 });
//             });
            
//             link.addEventListener('mouseleave', () => {
//                 gsap.to(underline, {
//                     scaleX: 0,
//                     duration: 0.3,
//                     ease: customEase.smooth
//                 });
                
//                 gsap.to(link, {
//                     y: 0,
//                     duration: 0.3,
//                     ease: customEase.smooth
//                 });
//             });
//         });
        
//         // CTA Button advanced hover
//         const ctaButton = document.querySelector('.cta-button');
//         if (ctaButton) {
//             // Create ripple effect element
//             const ripple = document.createElement('span');
//             ripple.className = 'button-ripple';
//             ripple.style.cssText = `
//                 position: absolute;
//                 border-radius: 50%;
//                 background: rgba(255,255,255,0.6);
//                 transform: scale(0);
//                 animation: ripple 0.6s linear;
//                 pointer-events: none;
//             `;
//             ctaButton.style.position = 'relative';
//             ctaButton.style.overflow = 'hidden';
            
//             ctaButton.addEventListener('mouseenter', () => {
//                 gsap.to(ctaButton, {
//                     scale: 1.05,
//                     backgroundColor: '#2d6f63',
//                     boxShadow: '0 10px 30px rgba(60, 141, 124, 0.4)',
//                     duration: 0.4,
//                     ease: customEase.elastic
//                 });
//             });
            
//             ctaButton.addEventListener('mouseleave', () => {
//                 gsap.to(ctaButton, {
//                     scale: 1,
//                     backgroundColor: 'var(--color-green-vibrant)',
//                     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//                     duration: 0.4,
//                     ease: customEase.smooth
//                 });
//             });
            
//             ctaButton.addEventListener('click', (e) => {
//                 const rect = ctaButton.getBoundingClientRect();
//                 const size = Math.max(rect.width, rect.height);
//                 const x = e.clientX - rect.left - size / 2;
//                 const y = e.clientY - rect.top - size / 2;
                
//                 ripple.style.width = size + 'px';
//                 ripple.style.height = size + 'px';
//                 ripple.style.left = x + 'px';
//                 ripple.style.top = y + 'px';
                
//                 ctaButton.appendChild(ripple);
                
//                 gsap.to(ripple, {
//                     scale: 1,
//                     opacity: 0,
//                     duration: 0.6,
//                     ease: "power2.out",
//                     onComplete: () => ripple.remove()
//                 });
//             });
//         }
//     }
    
//     // ========================================================================
//     // 4. ADVANCED PLOT MAP ANIMATIONS
//     // ========================================================================
    
//     function initPlotMapAnimations() {
//         if (animationState.mapInitialized) return;
//         animationState.mapInitialized = true;
        
//         const mapSection = document.querySelector('.plot-map-section');
//         if (!mapSection) return;
        
//         // CRITICAL: Ensure map container is visible by default
//         gsap.set('.map-container, .map-wrapper, #plot-canvas', { 
//             opacity: 1, 
//             visibility: 'visible',
//             display: 'block'
//         });
        
//         // Map container entrance - only animate if not already visible
//         const mapTL = gsap.timeline({
//             scrollTrigger: {
//                 trigger: mapSection,
//                 start: "top 80%",
//                 end: "bottom 20%",
//                 toggleActions: "play none none none",
//                 onEnter: () => {
//                     // Force visibility when entering viewport
//                     gsap.set('.map-container, .map-wrapper, #plot-canvas', { 
//                         opacity: 1, 
//                         visibility: 'visible' 
//                     });
//                 }
//             }
//         });
        
//         // Only animate if element is not already visible
//         const mapContainer = document.querySelector('.map-container');
//         if (mapContainer && mapContainer.style.opacity !== '0') {
//             mapTL
//                 .from('.map-container', {
//                     y: 100,
//                     opacity: 0,
//                     scale: 0.9,
//                     duration: 1.2,
//                     ease: customEase.elastic,
//                     immediateRender: false
//                 })
//                 .from('.plot-labels span', {
//                     x: -50,
//                     opacity: 0,
//                     rotation: -10,
//                     duration: 0.8,
//                     stagger: 0.2,
//                     ease: customEase.bounce,
//                     immediateRender: false
//                 }, '-=0.8')
//                 .from('.conversion-panel', {
//                     x: 100,
//                     opacity: 0,
//                     scale: 0.95,
//                     duration: 1,
//                     ease: customEase.smooth,
//                     immediateRender: false
//                 }, '-=0.6');
//         } else {
//             // If already visible, just ensure it stays visible
//             gsap.set('.map-container, .plot-labels, .conversion-panel', { opacity: 1 });
//         }
        
//         // Canvas loading animation
//         const canvas = document.getElementById('plot-canvas');
//         if (canvas) {
//             // Create loading overlay
//             const loadingOverlay = document.createElement('div');
//             loadingOverlay.style.cssText = `
//                 position: absolute;
//                 top: 0;
//                 left: 0;
//                 right: 0;
//                 bottom: 0;
//                 background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 border-radius: 15px;
//                 z-index: 10;
//             `;
//             loadingOverlay.innerHTML = `
//                 <div style="text-align: center;">
//                     <div class="map-loading-spinner" style="
//                         width: 50px;
//                         height: 50px;
//                         border: 4px solid #e0e0e0;
//                         border-top: 4px solid var(--color-green-vibrant);
//                         border-radius: 50%;
//                         margin: 0 auto 1rem;
//                     "></div>
//                     <p style="color: var(--color-charcoal-dark); font-weight: 600;">Rendering 3D Map...</p>
//                 </div>
//             `;
//             canvas.parentNode.appendChild(loadingOverlay);
            
//             // Animate spinner
//             gsap.to('.map-loading-spinner', {
//                 rotation: 360,
//                 duration: 1,
//                 repeat: -1,
//                 ease: "none"
//             });
            
//             // Remove overlay after 3 seconds
//             gsap.to(loadingOverlay, {
//                 opacity: 0,
//                 duration: 0.5,
//                 delay: 3,
//                 onComplete: () => loadingOverlay.remove()
//             });
//         }
        
//         // Conversion panel form animations
//         initFormAnimations();
//     }
    
//     // ========================================================================
//     // 5. ADVANCED FORM ANIMATIONS
//     // ========================================================================
    
//     function initFormAnimations() {
//         const form = document.querySelector('.conversion-panel form');
//         if (!form) return;
        
//         const inputs = form.querySelectorAll('input');
//         const submitButton = form.querySelector('.submit-button');
        
//         inputs.forEach((input, index) => {
//             // Initial state
//             gsap.set(input, { 
//                 borderColor: 'var(--color-green-sage)',
//                 boxShadow: 'none'
//             });
            
//             // Focus animations
//             input.addEventListener('focus', () => {
//                 gsap.to(input, {
//                     borderColor: 'var(--color-green-vibrant)',
//                     boxShadow: '0 0 0 3px rgba(60, 141, 124, 0.1)',
//                     scale: 1.02,
//                     duration: 0.3,
//                     ease: customEase.smooth
//                 });
                
//                 // Label animation if exists
//                 const label = input.previousElementSibling;
//                 if (label && label.tagName === 'LABEL') {
//                     gsap.to(label, {
//                         color: 'var(--color-green-vibrant)',
//                         y: -5,
//                         duration: 0.3,
//                         ease: customEase.smooth
//                     });
//                 }
//             });
            
//             input.addEventListener('blur', () => {
//                 gsap.to(input, {
//                     borderColor: 'var(--color-green-sage)',
//                     boxShadow: 'none',
//                     scale: 1,
//                     duration: 0.3,
//                     ease: customEase.smooth
//                 });
                
//                 const label = input.previousElementSibling;
//                 if (label && label.tagName === 'LABEL') {
//                     gsap.to(label, {
//                         color: 'var(--color-charcoal-dark)',
//                         y: 0,
//                         duration: 0.3,
//                         ease: customEase.smooth
//                     });
//                 }
//             });
            
//             // Typing animation
//             input.addEventListener('input', () => {
//                 if (input.value.length > 0) {
//                     gsap.to(input, {
//                         backgroundColor: 'rgba(60, 141, 124, 0.05)',
//                         duration: 0.2
//                     });
//                 } else {
//                     gsap.to(input, {
//                         backgroundColor: 'var(--color-white-soft)',
//                         duration: 0.2
//                     });
//                 }
//             });
//         });
        
//         // Submit button animations
//                 // Submit button animations
//                 if (submitButton) {
//                     submitButton.addEventListener('click', (e) => {
//                         // Don't prevent by default — only prevent when validation fails.
                        
//                         // Validation check animation
//                         let isValid = true;
//                         const invalidInputs = [];
                        
//                         inputs.forEach(input => {
//                             if (input.required && !input.value.trim()) {
//                                 isValid = false;
//                                 invalidInputs.push(input);
//                             }
//                         });
                        
//                         if (!isValid) {
//                             // Shake animation for invalid inputs
//                             invalidInputs.forEach(input => {
//                                 gsap.to(input, {
//                                     x: [-10, 10, -10, 10, 0],
//                                     borderColor: '#ff4444',
//                                     duration: 0.5,
//                                     ease: "power2.inOut"
//                                 });
//                             });
                            
//                             // Error message animation
//                             const errorMsg = document.createElement('div');
//                             errorMsg.textContent = 'Please fill in all required fields';
//                             errorMsg.style.cssText = `
//                                 color: #ff4444;
//                                 font-size: 0.9rem;
//                                 margin-top: 0.5rem;
//                                 opacity: 0;
//                             `;
//                             form.appendChild(errorMsg);
                            
//                             gsap.to(errorMsg, {
//                                 opacity: 1,
//                                 y: -10,
//                                 duration: 0.3,
//                                 ease: customEase.smooth,
//                                 onComplete: () => {
//                                     setTimeout(() => {
//                                         gsap.to(errorMsg, {
//                                             opacity: 0,
//                                             duration: 0.3,
//                                             onComplete: () => errorMsg.remove()
//                                         });
//                                     }, 3000);
//                                 }
//                             });
//                             e.preventDefault();
//                             return;
//                         }
                        
//                         // Success animation
//                         const originalText = submitButton.textContent;
//                         const originalBg = submitButton.style.backgroundColor;
                        
//                         gsap.timeline()
//                             .to(submitButton, {
//                                 scale: 0.95,
//                                 duration: 0.1
//                             })
//                             .to(submitButton, {
//                                 scale: 1.05,
//                                 backgroundColor: '#4CAF50',
//                                 duration: 0.3,
//                                 ease: customEase.bounce
//                             })
//                             .to(submitButton, {
//                                 innerHTML: '✓ Submitted!',
//                                 duration: 0.2
//                             })
//                             .to(submitButton, {
//                                 scale: 1,
//                                 duration: 0.5,
//                                 ease: customEase.elastic
//                             })
//                             .to(submitButton, {
//                                 backgroundColor: originalBg,
//                                 innerHTML: originalText,
//                                 delay: 2,
//                                 duration: 0.5
//                             });

//                         // After starting the success animation, trigger the form's submit event
//                         // so the application's submit handler (which calls the API) runs.
//                         try {
//                             if (typeof form.requestSubmit === 'function') {
//                                 form.requestSubmit();
//                             } else {
//                                 // Fallback for older browsers
//                                 form.submit();
//                             }
//                         } catch (err) {
//                             console.warn('Could not programmatically submit form', err);
//                         }
                        
//                         // Form success animation
//                         gsap.to(form, {
//                             y: -20,
//                             duration: 0.5,
//                             ease: customEase.smooth,
//                             onComplete: () => {
//                                 gsap.to(form, {
//                                     y: 0,
//                                     duration: 0.5,
//                                     ease: customEase.bounce
//                                 });
//                             }
//                         });
                        
//                         // Clear form with animation
//                         setTimeout(() => {
//                             inputs.forEach((input, index) => {
//                                 gsap.to(input, {
//                                     opacity: 0.5,
//                                     duration: 0.2,
//                                     delay: index * 0.1,
//                                     onComplete: () => {
//                                         input.value = '';
//                                         gsap.to(input, {
//                                             opacity: 1,
//                                             duration: 0.2
//                                         });
//                                     }
//                                 });
//                             });
//                         }, 1000);
//                     });
//                 }
//             }
            
//             // ========================================================================
//             // 6. ADVANCED TRUST SECTION ANIMATIONS
//             // ========================================================================
            
//             function initTrustSectionAnimations() {
//                 const trustSection = document.querySelector('.trust-section');
//                 if (!trustSection) return;
                
//                 // Section entrance
//                 ScrollTrigger.create({
//                     trigger: trustSection,
//                     start: "top 85%",
//                     onEnter: () => {
//                         // Title animation with split text
//                         const title = trustSection.querySelector('h2');
//                         if (title) {
//                             const words = title.textContent.split(' ');
//                             title.innerHTML = words.map(word => 
//                                 `<span class="word">${word}</span>`
//                             ).join(' ');
                            
//                             gsap.from('.word', {
//                                 y: 50,
//                                 opacity: 0,
//                                 rotation: 5,
//                                 duration: 0.8,
//                                 stagger: 0.2,
//                                 ease: customEase.bounce
//                             });
//                         }
                        
//                         // Enhanced carousel animations
//                         initAdvancedCarousel();
//                     }
//                 });
//             }
            
//             function initAdvancedCarousel() {
//                 const carousel = document.querySelector('.trust-carousel');
//                 const container = document.querySelector('.trust-carousel-container');
//                 if (!carousel || !container) return;
                
//                 // Pause carousel on hover with smooth transition
//                 container.addEventListener('mouseenter', () => {
//                     gsap.to(carousel, {
//                         animationPlayState: 'paused',
//                         duration: 0.5,
//                         ease: customEase.smooth
//                     });
                    
//                     // Individual card hover effects
//                     const cards = carousel.querySelectorAll('.trust-block');
//                     cards.forEach(card => {
//                         card.addEventListener('mouseenter', () => {
//                             gsap.to(card, {
//                                 scale: 1.05,
//                                 y: -15,
//                                 rotationY: 5,
//                                 boxShadow: '0 20px 50px rgba(60, 141, 124, 0.2)',
//                                 duration: 0.5,
//                                 ease: customEase.elastic
//                             });
                            
//                             // Icon animation
//                             const icon = card.querySelector('.icon-wrapper');
//                             if (icon) {
//                                 gsap.to(icon, {
//                                     scale: 1.1,
//                                     rotation: 10,
//                                     duration: 0.3,
//                                     ease: customEase.bounce
//                                 });
//                             }
                            
//                             // Text reveal animation
//                             const text = card.querySelector('p');
//                             if (text) {
//                                 gsap.to(text, {
//                                     color: 'var(--color-charcoal-dark)',
//                                     duration: 0.3
//                                 });
//                             }
//                         });
                        
//                         card.addEventListener('mouseleave', () => {
//                             gsap.to(card, {
//                                 scale: 1,
//                                 y: 0,
//                                 rotationY: 0,
//                                 boxShadow: '0 8px 25px rgba(60, 141, 124, 0.08)',
//                                 duration: 0.5,
//                                 ease: customEase.smooth
//                             });
                            
//                             const icon = card.querySelector('.icon-wrapper');
//                             if (icon) {
//                                 gsap.to(icon, {
//                                     scale: 1,
//                                     rotation: 0,
//                                     duration: 0.3,
//                                     ease: customEase.smooth
//                                 });
//                             }
                            
//                             const text = card.querySelector('p');
//                             if (text) {
//                                 gsap.to(text, {
//                                     color: 'initial',
//                                     duration: 0.3
//                                 });
//                             }
//                         });
//                     });
//                 });
                
//                 container.addEventListener('mouseleave', () => {
//                     gsap.to(carousel, {
//                         animationPlayState: 'running',
//                         duration: 0.5,
//                         ease: customEase.smooth
//                     });
//                 });
                
//                 // Add intersection observer for card entrance animations
//                 const cards = carousel.querySelectorAll('.trust-block');
//                 const cardObserver = new IntersectionObserver((entries) => {
//                     entries.forEach(entry => {
//                         if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
//                             entry.target.classList.add('animated');
                            
//                             const tl = gsap.timeline();
//                             tl.from(entry.target, {
//                                 opacity: 0,
//                                 scale: 0.8,
//                                 rotationY: -30,
//                                 duration: 0.8,
//                                 ease: customEase.elastic
//                             })
//                             .from(entry.target.querySelector('.icon-wrapper'), {
//                                 scale: 0,
//                                 rotation: 180,
//                                 duration: 0.6,
//                                 ease: customEase.bounce
//                             }, '-=0.4')
//                             .from(entry.target.querySelector('h4'), {
//                                 y: 20,
//                                 opacity: 0,
//                                 duration: 0.5
//                             }, '-=0.3')
//                             .from(entry.target.querySelector('p'), {
//                                 y: 15,
//                                 opacity: 0,
//                                 duration: 0.5
//                             }, '-=0.2');
//                         }
//                     });
//                 }, { threshold: 0.5 });
                
//                 cards.forEach(card => cardObserver.observe(card));
//             }
            
//             // ========================================================================
//             // 7. ADVANCED PROMOTIONAL SECTION ANIMATIONS
//             // ========================================================================
            
//             function initPromoSectionAnimations() {
//                 const promoSection = document.querySelector('.promo-section');
//                 if (!promoSection) return;
                
//                 // Advanced background animations
//                 initPromoBackground();
                
//                 // Content animations
//                 ScrollTrigger.create({
//                     trigger: promoSection,
//                     start: "top 80%",
//                     onEnter: () => {
//                         animatePromoContent();
//                         initStatsCounter();
//                         animateFloatingCards();
//                     }
//                 });
                
//                 // Continuous background effects
//                 gsap.to('.promo-section::before', {
//                     backgroundPosition: '0% 50%',
//                     duration: 10,
//                     repeat: -1,
//                     yoyo: true,
//                     ease: "sine.inOut"
//                 });
//             }
            
//             function initPromoBackground() {
//                 // Animated particles
//                 const particleContainer = document.querySelector('.particles-container');
//                 if (particleContainer) {
//                     // Create additional particles dynamically
//                     for (let i = 6; i < 20; i++) {
//                         const particle = document.createElement('div');
//                         particle.className = 'particle';
//                         particle.style.cssText = `
//                             position: absolute;
//                             width: ${Math.random() * 6 + 2}px;
//                             height: ${Math.random() * 6 + 2}px;
//                             background: var(--color-green-vibrant);
//                             border-radius: 50%;
//                             opacity: ${Math.random() * 0.8 + 0.2};
//                             left: ${Math.random() * 100}%;
//                         `;
//                         particleContainer.appendChild(particle);
                        
//                         // Animate each particle
//                         gsap.to(particle, {
//                             y: '-100vh',
//                             x: `+=${Math.random() * 100 - 50}px`,
//                             rotation: 360,
//                             duration: Math.random() * 10 + 10,
//                             repeat: -1,
//                             delay: Math.random() * 5,
//                             ease: "none"
//                         });
//                     }
//                 }
                
//                 // Gradient animations
//                 const gradients = document.querySelectorAll('.promo-gradient');
//                 gradients.forEach((gradient, index) => {
//                     gsap.to(gradient, {
//                         scale: [1, 1.3, 1],
//                         opacity: [0.4, 0.8, 0.4],
//                         rotation: 360,
//                         duration: 15 + index * 3,
//                         repeat: -1,
//                         ease: "sine.inOut"
//                     });
//                 });
//             }
            
//             function animatePromoContent() {
//                 const tl = gsap.timeline();
                
//                 tl
//                 // Badge animation with morphing
//                 .from('.promo-badge', {
//                     scale: 0,
//                     rotation: -180,
//                     duration: 0.8,
//                     ease: customEase.elastic
//                 })
//                 .to('.promo-badge', {
//                     rotationY: 360,
//                     duration: 1,
//                     ease: "power2.inOut"
//                 }, '-=0.5')
                
//                 // Title with advanced text effects
//                 .from('.title-line', {
//                     y: 100,
//                     opacity: 0,
//                     skewY: 5,
//                     duration: 1,
//                     stagger: 0.3,
//                     ease: customEase.dramatic
//                 }, '-=0.5')
                
//                 // Description with typewriter effect
//                 .call(() => {
//                     const desc = document.querySelector('.promo-description');
//                     if (desc) {
//                         const text = desc.textContent;
//                         desc.textContent = '';
//                         desc.style.opacity = '1';
                        
//                         gsap.to(desc, {
//                             duration: text.length * 0.03,
//                             ease: "none",
//                             onUpdate: function() {
//                                 const progress = this.progress();
//                                 const currentLength = Math.round(progress * text.length);
//                                 desc.textContent = text.slice(0, currentLength);
//                             }
//                         });
//                     }
//                 }, null, 0.5)
                
//                 // Features with stagger
//                 .from('.feature-tag', {
//                     x: -50,
//                     opacity: 0,
//                     rotation: -10,
//                     duration: 0.6,
//                     stagger: 0.1,
//                     ease: customEase.bounce
//                 }, '-=1')
                
//                 // Buttons with magnetic effect
//                 .from('.promo-button', {
//                     y: 50,
//                     opacity: 0,
//                     scale: 0.8,
//                     duration: 0.8,
//                     stagger: 0.2,
//                     ease: customEase.elastic
//                 }, '-=0.5');
                
//                 // Add magnetic effect to buttons
//                 initMagneticButtons();
//             }
            
//             function initMagneticButtons() {
//                 const buttons = document.querySelectorAll('.promo-button');
                
//                 buttons.forEach(button => {
//                     button.addEventListener('mousemove', (e) => {
//                         const rect = button.getBoundingClientRect();
//                         const x = e.clientX - rect.left - rect.width / 2;
//                         const y = e.clientY - rect.top - rect.height / 2;
                        
//                         gsap.to(button, {
//                             x: x * 0.3,
//                             y: y * 0.3,
//                             duration: 0.3,
//                             ease: "power2.out"
//                         });
//                     });
                    
//                     button.addEventListener('mouseleave', () => {
//                         gsap.to(button, {
//                             x: 0,
//                             y: 0,
//                             duration: 0.5,
//                             ease: customEase.elastic
//                         });
//                     });
//                 });
//             }
            
//             function initStatsCounter() {
//                 if (animationState.statsAnimated) return;
//                 animationState.statsAnimated = true;
                
//                 const statNumbers = document.querySelectorAll('.stat-number');
                
//                 statNumbers.forEach(stat => {
//                     const target = parseInt(stat.getAttribute('data-target'));
//                     const obj = { value: 0 };
                    
//                     gsap.to(obj, {
//                         value: target,
//                         duration: 2.5,
//                         ease: "power2.out",
//                         onUpdate: () => {
//                             stat.textContent = Math.round(obj.value).toLocaleString();
//                         },
//                         delay: 0.5
//                     });
                    
//                     // Add pulsing effect during animation
//                     gsap.to(stat, {
//                         scale: [1, 1.1, 1],
//                         duration: 0.5,
//                         repeat: 4,
//                         ease: "power2.inOut",
//                         delay: 0.5
//                     });
//                 });
                
//                 // Animate stat items entrance
//                 gsap.from('.stat-item', {
//                     y: 30,
//                     opacity: 0,
//                     scale: 0.9,
//                     duration: 0.8,
//                     stagger: 0.2,
//                     ease: customEase.bounce
//                 });
//             }
            
//             function animateFloatingCards() {
//                 const cards = document.querySelectorAll('.floating-card');
                
//                 cards.forEach((card, index) => {
//                     // Entrance animation
//                     gsap.from(card, {
//                         opacity: 0,
//                         scale: 0.3,
//                         rotation: Math.random() * 60 - 30,
//                         duration: 1,
//                         delay: index * 0.3,
//                         ease: customEase.elastic
//                     });
                    
//                     // Continuous floating with unique patterns
//                     gsap.to(card, {
//                         y: `+=${Math.random() * 40 + 20}px`,
//                         x: `+=${Math.random() * 20 - 10}px`,
//                         rotation: `+=${Math.random() * 20 - 10}deg`,
//                         duration: 4 + Math.random() * 3,
//                         repeat: -1,
//                         yoyo: true,
//                         ease: "sine.inOut",
//                         delay: index * 0.5
//                     });
                    
//                     // Interactive hover effects
//                     card.addEventListener('mouseenter', () => {
//                         gsap.to(card, {
//                             scale: 1.1,
//                             z: 50,
//                             boxShadow: '0 40px 80px rgba(0, 0, 0, 0.3)',
//                             duration: 0.5,
//                             ease: customEase.elastic
//                         });
//                     });
                    
//                     card.addEventListener('mouseleave', () => {
//                         gsap.to(card, {
//                             scale: 1,
//                             z: 0,
//                             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
//                             duration: 0.5,
//                             ease: customEase.smooth
//                         });
//                     });
//                 });
//             }
            
//             // ========================================================================
//             // 8. ADVANCED FOOTER ANIMATIONS
//             // ========================================================================
            
//             function initFooterAnimations() {
//                 const footer = document.querySelector('.footer');
//                 if (!footer) return;
                
//                 // Ensure footer is visible by default
//                 gsap.set('.footer, .footer-content, .footer-section', { 
//                     opacity: 1, 
//                     visibility: 'visible',
//                     y: 0 
//                 });
                
//                 ScrollTrigger.create({
//                     trigger: footer,
//                     start: "top 90%",
//                     onEnter: () => {
//                         // Animate footer sections
//                         const sections = footer.querySelectorAll('.footer-section');
                        
//                         gsap.from(sections, {
//                             y: 50,
//                             opacity: 0,
//                             duration: 0.8,
//                             stagger: 0.2,
//                             ease: customEase.bounce,
//                             immediateRender: false
//                         });
                        
//                         // Animate footer links
//                         const links = footer.querySelectorAll('.footer-links-list a');
//                         links.forEach(link => {
//                             link.addEventListener('mouseenter', () => {
//                                 gsap.to(link, {
//                                     x: 10,
//                                     color: 'var(--color-green-vibrant)',
//                                     duration: 0.3,
//                                     ease: customEase.smooth
//                                 });
//                             });
                            
//                             link.addEventListener('mouseleave', () => {
//                                 gsap.to(link, {
//                                     x: 0,
//                                     color: 'rgba(255, 255, 255, 0.75)',
//                                     duration: 0.3,
//                                     ease: customEase.smooth
//                                 });
//                             });
//                         });
                        
//                         // Social icons hover effects
//                         const socialIcons = footer.querySelectorAll('.social-icon');
//                         socialIcons.forEach(icon => {
//                             icon.addEventListener('mouseenter', () => {
//                                 gsap.to(icon, {
//                                     scale: 1.2,
//                                     rotation: 10,
//                                     backgroundColor: 'var(--color-green-vibrant)',
//                                     duration: 0.3,
//                                     ease: customEase.elastic
//                                 });
//                             });
                            
//                             icon.addEventListener('mouseleave', () => {
//                                 gsap.to(icon, {
//                                     scale: 1,
//                                     rotation: 0,
//                                     backgroundColor: 'rgba(60, 141, 124, 0.1)',
//                                     duration: 0.3,
//                                     ease: customEase.smooth
//                                 });
//                             });
//                         });
                        
//                         // Newsletter form animation
//                         initNewsletterAnimation();
//                     }
//                 });
//             }
            
//             function initNewsletterAnimation() {
//                 const form = document.querySelector('.newsletter-signup');
//                 if (!form) return;
                
//                 const input = form.querySelector('input');
//                 const button = form.querySelector('.newsletter-button');
                
//                 // Focus animations
//                 input.addEventListener('focus', () => {
//                     gsap.to([input, button], {
//                         scale: 1.02,
//                         duration: 0.3,
//                         ease: customEase.smooth
//                     });
//                 });
                
//                 input.addEventListener('blur', () => {
//                     gsap.to([input, button], {
//                         scale: 1,
//                         duration: 0.3,
//                         ease: customEase.smooth
//                     });
//                 });
                
//                 // Submit animation
//                 form.addEventListener('submit', (e) => {
//                     e.preventDefault();
                    
//                     if (!input.value.trim()) {
//                         gsap.to(input, {
//                             x: [-5, 5, -5, 5, 0],
//                             borderColor: '#ff4444',
//                             duration: 0.5
//                         });
//                         return;
//                     }
                    
//                     // Success animation
//                     const originalText = button.textContent;
                    
//                     gsap.timeline()
//                     .to(button, {
//                         innerHTML: '✓ Subscribed!',
//                         backgroundColor: '#4CAF50',
//                         scale: 1.1,
//                         duration: 0.3,
//                         ease: customEase.bounce
//                     })
//                     .to(input, {
//                         value: '',
//                         duration: 0.5
//                     })
//                     .to(button, {
//                         innerHTML: originalText,
//                         backgroundColor: 'var(--color-green-vibrant)',
//                         scale: 1,
//                         duration: 0.5,
//                         delay: 2,
//                         ease: customEase.smooth
//                     });
                
//                 // Confetti effect
//                 createConfetti(button);
//             });
//         }
        
//         // ========================================================================
//         // 9. UTILITY FUNCTIONS & SPECIAL EFFECTS
//         // ========================================================================
        
//         function createFloatingParticles(container) {
//             const containerEl = document.querySelector(container);
//             if (!containerEl) return;
            
//             for (let i = 0; i < 15; i++) {
//                 const particle = document.createElement('div');
//                 particle.style.cssText = `
//                     position: absolute;
//                     width: ${Math.random() * 4 + 2}px;
//                     height: ${Math.random() * 4 + 2}px;
//                     background: rgba(255, 255, 255, 0.7);
//                     border-radius: 50%;
//                     pointer-events: none;
//                     z-index: 1;
//                 `;
//                 containerEl.appendChild(particle);
                
//                 gsap.set(particle, {
//                     x: Math.random() * window.innerWidth,
//                     y: window.innerHeight + 50
//                 });
                
//                 gsap.to(particle, {
//                     y: -50,
//                     x: `+=${Math.random() * 200 - 100}`,
//                     opacity: [0, 1, 0],
//                     duration: Math.random() * 8 + 5,
//                     repeat: -1,
//                     delay: Math.random() * 5,
//                     ease: "none"
//                 });
//             }
//         }
        
//         function createConfetti(element) {
//             const colors = ['var(--color-green-vibrant)', 'var(--color-gold-warm)', 'var(--color-coral-muted)', 'var(--color-green-sage)'];
//             const rect = element.getBoundingClientRect();
//             const centerX = rect.left + rect.width / 2;
//             const centerY = rect.top + rect.height / 2;
            
//             for (let i = 0; i < 30; i++) {
//                 const confetti = document.createElement('div');
//                 confetti.style.cssText = `
//                     position: fixed;
//                     width: 8px;
//                     height: 8px;
//                     background: ${colors[Math.floor(Math.random() * colors.length)]};
//                     border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
//                     pointer-events: none;
//                     z-index: 10000;
//                     left: ${centerX}px;
//                     top: ${centerY}px;
//                 `;
//                 document.body.appendChild(confetti);
                
//                 gsap.to(confetti, {
//                     x: (Math.random() - 0.5) * 400,
//                     y: (Math.random() - 0.5) * 400,
//                     rotation: Math.random() * 720,
//                     opacity: 0,
//                     duration: Math.random() * 2 + 1,
//                     ease: "power2.out",
//                     onComplete: () => confetti.remove()
//                 });
//             }
//         }
        
//         // ========================================================================
//         // 10. ADVANCED SCROLL ANIMATIONS & PARALLAX
//         // ========================================================================
        
//         function initAdvancedScrollAnimations() {
//             // Smooth scroll for internal links
//             document.querySelectorAll('a[href^="#"]').forEach(link => {
//                 link.addEventListener('click', (e) => {
//                     e.preventDefault();
//                     const target = document.querySelector(link.getAttribute('href'));
//                     if (target) {
//                         gsap.to(window, {
//                             scrollTo: {
//                                 y: target,
//                                 offsetY: 100
//                             },
//                             duration: 1.5,
//                             ease: customEase.smooth
//                         });
//                     }
//                 });
//             });
            
//             // Parallax effects for various elements
//             gsap.utils.toArray('.parallax-element').forEach(element => {
//                 gsap.to(element, {
//                     yPercent: -50,
//                     ease: "none",
//                     scrollTrigger: {
//                         trigger: element,
//                         start: "top bottom",
//                         end: "bottom top",
//                         scrub: true
//                     }
//                 });
//             });
            
//             // Advanced scroll progress indicator
//             createScrollProgress();
            
//             // Section-based animations
//             initSectionReveal();
//         }
        
//         function createScrollProgress() {
//             const progressBar = document.createElement('div');
//             progressBar.style.cssText = `
//                 position: fixed;
//                 top: 0;
//                 left: 0;
//                 width: 0%;
//                 height: 3px;
//                 background: linear-gradient(90deg, var(--color-green-vibrant), var(--color-gold-warm));
//                 z-index: 9999;
//                 transition: width 0.1s ease;
//             `;
//             document.body.appendChild(progressBar);
            
//             ScrollTrigger.create({
//                 trigger: "body",
//                 start: "top top",
//                 end: "bottom bottom",
//                 onUpdate: (self) => {
//                     gsap.to(progressBar, {
//                         width: `${self.progress * 100}%`,
//                         duration: 0.1,
//                         ease: "none"
//                     });
//                 }
//             });
//         }
        
//         function initSectionReveal() {
//             gsap.utils.toArray('section').forEach(section => {
//                 ScrollTrigger.create({
//                     trigger: section,
//                     start: "top 85%",
//                     onEnter: () => {
//                         gsap.from(section.children, {
//                             y: 60,
//                             opacity: 0,
//                             duration: 1,
//                             stagger: 0.2,
//                             ease: customEase.smooth
//                         });
//                     },
//                     once: true
//                 });
//             });
//         }
        
//         // ========================================================================
//         // 11. PERFORMANCE MONITORING & OPTIMIZATION
//         // ========================================================================
        
//         function initPerformanceOptimizations() {
//             // Intersection Observer for lazy animations
//             const animationObserver = new IntersectionObserver((entries) => {
//                 entries.forEach(entry => {
//                     if (entry.isIntersecting) {
//                         const element = entry.target;
//                         const animationType = element.dataset.animation;
                        
//                         switch (animationType) {
//                             case 'fadeUp':
//                                 gsap.from(element, {
//                                     y: 50,
//                                     opacity: 0,
//                                     duration: 0.8,
//                                     ease: customEase.smooth
//                                 });
//                                 break;
//                             case 'scaleIn':
//                                 gsap.from(element, {
//                                     scale: 0.8,
//                                     opacity: 0,
//                                     duration: 0.6,
//                                     ease: customEase.elastic
//                                 });
//                                 break;
//                             case 'slideRight':
//                                 gsap.from(element, {
//                                     x: -100,
//                                     opacity: 0,
//                                     duration: 0.8,
//                                     ease: customEase.smooth
//                                 });
//                                 break;
//                         }
                        
//                         animationObserver.unobserve(element);
//                     }
//                 });
//             }, { threshold: 0.1 });
            
//             // Observe elements with animation attributes
//             document.querySelectorAll('[data-animation]').forEach(el => {
//                 animationObserver.observe(el);
//             });
            
//             // Memory management for animations
//             window.addEventListener('beforeunload', () => {
//                 ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//                 gsap.globalTimeline.clear();
//             });
            
//             // FPS monitoring
//             if (window.location.search.includes('debug=true')) {
//                 initFPSMonitor();
//             }
//         }
        
//         function initFPSMonitor() {
//             const fpsCounter = document.createElement('div');
//             fpsCounter.style.cssText = `
//                 position: fixed;
//                 top: 10px;
//                 right: 10px;
//                 background: rgba(0,0,0,0.8);
//                 color: white;
//                 padding: 10px;
//                 border-radius: 5px;
//                 font-family: monospace;
//                 z-index: 10001;
//             `;
//             document.body.appendChild(fpsCounter);
            
//             let fps = 0;
//             let lastTime = performance.now();
            
//             function updateFPS() {
//                 const currentTime = performance.now();
//                 fps = Math.round(1000 / (currentTime - lastTime));
//                 lastTime = currentTime;
//                 fpsCounter.textContent = `FPS: ${fps}`;
//                 requestAnimationFrame(updateFPS);
//             }
//             updateFPS();
//         }
        
//         // ========================================================================
//         // 12. RESPONSIVE ANIMATIONS
//         // ========================================================================
        
//         function initResponsiveAnimations() {
//             const mm = gsap.matchMedia();
            
//             // Desktop animations
//             mm.add("(min-width: 1024px)", () => {
//                 // Complex animations for desktop
//                 gsap.to('.floating-card', {
//                     rotationY: 360,
//                     duration: 20,
//                     repeat: -1,
//                     ease: "none",
//                     stagger: 2
//                 });
                
//                 // Advanced hover effects
//                 document.querySelectorAll('.trust-block').forEach(block => {
//                     block.addEventListener('mouseenter', () => {
//                         gsap.to(block, {
//                             rotationX: 10,
//                             rotationY: 10,
//                             duration: 0.5,
//                             ease: customEase.smooth
//                         });
//                     });
                    
//                     block.addEventListener('mouseleave', () => {
//                         gsap.to(block, {
//                             rotationX: 0,
//                             rotationY: 0,
//                             duration: 0.5,
//                             ease: customEase.smooth
//                         });
//                     });
//                 });
//             });
            
//             // Tablet animations
//             mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
//                 // Simplified animations for tablet
//                 gsap.set('.floating-card', { scale: 0.9 });
                
//                 // Touch-friendly interactions
//                 document.querySelectorAll('.promo-button').forEach(button => {
//                     button.addEventListener('touchstart', () => {
//                         gsap.to(button, {
//                             scale: 0.95,
//                             duration: 0.1
//                         });
//                     });
                    
//                     button.addEventListener('touchend', () => {
//                         gsap.to(button, {
//                             scale: 1,
//                             duration: 0.2,
//                             ease: customEase.bounce
//                         });
//                     });
//                 });
//             });
            
//             // Mobile animations
//             mm.add("(max-width: 767px)", () => {
//                 // Minimal animations for mobile performance
//                 gsap.set('.floating-card', { 
//                     animation: 'none',
//                     position: 'relative',
//                     transform: 'none'
//                 });
                
//                 // Simplified scroll animations
//                 ScrollTrigger.batch('.trust-block', {
//                     onEnter: (elements) => {
//                         gsap.from(elements, {
//                             y: 30,
//                             opacity: 0,
//                             duration: 0.6,
//                             stagger: 0.1,
//                             ease: customEase.smooth
//                         });
//                     },
//                     once: true
//                 });
//             });
//         }
        
//         // ========================================================================
//         // 13. ADVANCED CURSOR INTERACTIONS
//         // ========================================================================
        
//         function initAdvancedCursor() {
//             // Only on desktop
//             if (window.innerWidth < 1024) return;
            
//             const cursor = document.createElement('div');
//             cursor.className = 'custom-cursor';
//             cursor.style.cssText = `
//                 position: fixed;
//                 width: 20px;
//                 height: 20px;
//                 background: var(--color-green-vibrant);
//                 border-radius: 50%;
//                 pointer-events: none;
//                 z-index: 10000;
//                 mix-blend-mode: difference;
//                 transition: transform 0.1s ease;
//             `;
//             document.body.appendChild(cursor);
            
//             const cursorFollower = document.createElement('div');
//             cursorFollower.className = 'cursor-follower';
//             cursorFollower.style.cssText = `
//                 position: fixed;
//                 width: 8px;
//                 height: 8px;
//                 background: var(--color-gold-warm);
//                 border-radius: 50%;
//                 pointer-events: none;
//                 z-index: 9999;
//             `;
//             document.body.appendChild(cursorFollower);
            
//             let mouseX = 0, mouseY = 0;
//             let followerX = 0, followerY = 0;
            
//             document.addEventListener('mousemove', (e) => {
//                 mouseX = e.clientX;
//                 mouseY = e.clientY;
                
//                 gsap.to(cursor, {
//                     x: mouseX - 10,
//                     y: mouseY - 10,
//                     duration: 0.1
//                 });
//             });
            
//             gsap.ticker.add(() => {
//                 followerX += (mouseX - followerX) * 0.1;
//                 followerY += (mouseY - followerY) * 0.1;
                
//                 gsap.set(cursorFollower, {
//                     x: followerX - 4,
//                     y: followerY - 4
//                 });
//             });
            
//             // Cursor interactions
//             document.querySelectorAll('button, a, .clickable').forEach(element => {
//                 element.addEventListener('mouseenter', () => {
//                     gsap.to(cursor, {
//                         scale: 1.5,
//                         backgroundColor: 'var(--color-coral-muted)',
//                         duration: 0.3
//                     });
//                 });
                
//                 element.addEventListener('mouseleave', () => {
//                     gsap.to(cursor, {
//                         scale: 1,
//                         backgroundColor: 'var(--color-green-vibrant)',
//                         duration: 0.3
//                     });
//                 });
//             });
//         }
        
//         // ========================================================================
//         // 14. MASTER INITIALIZATION
//         // ========================================================================
        
//         function initAllAnimations() {
//             // Initialize preloader first
//             initPreloader();
            
//             // Initialize other animations after a short delay
//             setTimeout(() => {
//                 initHeaderAnimations();
//                 initPlotMapAnimations();
//                 initTrustSectionAnimations();
//                 initPromoSectionAnimations();
//                 initFooterAnimations();
//                 initAdvancedScrollAnimations();
//                 initPerformanceOptimizations();
//                 initResponsiveAnimations();
//                 initAdvancedCursor();
//             }, 500);
            
//             // Refresh ScrollTrigger after all animations are set
//             setTimeout(() => {
//                 ScrollTrigger.refresh();
//             }, 1000);
//         }
        
//         // ========================================================================
//         // 15. ERROR HANDLING & FALLBACKS
//         // ========================================================================
        
//         function setupErrorHandling() {
//             // GSAP error handling
//             window.addEventListener('error', (e) => {
//                 if (e.message.includes('gsap') || e.message.includes('ScrollTrigger')) {
//                     console.warn('GSAP Animation Error:', e.message);
//                     // Fallback to CSS animations or basic interactions
//                     document.body.classList.add('gsap-fallback');
//                 }
//             });
            
//             // Performance fallback
//             if (navigator.hardwareConcurrency < 4) {
//                 gsap.config({ force3D: false });
//                 document.body.classList.add('low-performance');
//             }
            
//             // Reduce motion preference
//             if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
//                 gsap.config({ nullTargetWarn: false });
//                 ScrollTrigger.config({ limitCallbacks: true });
//                 document.body.classList.add('reduced-motion');
//             }
//         }
        
//         // ========================================================================
//         // START EVERYTHING
//         // ========================================================================
        
//         setupErrorHandling();
//         initAllAnimations();
        
//         // Export for debugging
//         window.VlandsAnimations = {
//             animationState,
//             customEase,
//             initAllAnimations,
//             ScrollTrigger,
//             gsap
//         };
    
//     }); // End DOMContentLoaded
    
//     // ========================================================================
//     // 16. CSS ADDITIONS FOR GSAP ANIMATIONS
//     // ========================================================================
    
//     // Add critical CSS for animations
//     const animationStyles = document.createElement('style');
//     animationStyles.textContent = `
//         /* GSAP Animation Enhancements */
//         .char {
//             display: inline-block;
//             transform-origin: center bottom;
//         }
        
//         .word {
//             display: inline-block;
//             transform-origin: center bottom;
//         }
        
//         .gsap-fallback * {
//             animation-duration: 0.01ms !important;
//             animation-delay: -0.01ms !important;
//             transition-duration: 0.01ms !important;
//         }
        
//         .reduced-motion * {
//             animation-duration: 0.01ms !important;
//             animation-delay: -0.01ms !important;
//             transition-duration: 0.01ms !important;
//         }
        
//         .low-performance .floating-card {
//             animation: none !important;
//             transform: none !important;
//         }
        
//         .custom-cursor {
//             mix-blend-mode: difference;
//             filter: blur(0.5px);
//         }
        
//         .nav-underline {
//             position: absolute;
//             bottom: -5px;
//             left: 0;
//             width: 100%;
//             height: 2px;
//             background: var(--color-green-vibrant);
//             transform: scaleX(0);
//             transform-origin: left;
//             transition: transform 0.3s ease;
//         }
        
//         @keyframes ripple {
//             to {
//                 transform: scale(4);
//                 opacity: 0;
//             }
//         }
        
//         /* Responsive animation adjustments */
//         @media (max-width: 768px) {
//             .floating-card {
//                 animation: none !important;
//                 position: relative !important;
//                 transform: none !important;
//             }
            
//             .custom-cursor,
//             .cursor-follower {
//                 display: none !important;
//             }
//         }
        
//         /* Performance optimizations */
//         .will-change-transform {
//             will-change: transform;
//         }
        
//         .will-change-opacity {
//             will-change: opacity;
//         }
        
//         /* Smooth scrolling */
//         html {
//             scroll-behavior: smooth;
//         }
        
//         @media (prefers-reduced-motion: reduce) {
//             html {
//                 scroll-behavior: auto;
//             }
//         }
//     `;
    
//     document.head.appendChild(animationStyles);
// ============================================================================
// VLANDS - LANDING & HERO ANIMATIONS ONLY
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SAFETY CHECK: Ensure non-animated sections are visible ---
    // Since we removed specific animations for these, we must force them to be visible
    // otherwise they might stay hidden if CSS has opacity: 0
    setTimeout(() => {
        const content = document.querySelectorAll('.map-container, .property-card, .trust-block, .promo-content, .footer-content, .conversion-panel, .plot-labels');
        content.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    }, 100);

    // --- 2. GSAP CHECK ---
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded.');
        return;
    }
    
    // Register plugins if available
    try {
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);
    } catch(e) { console.warn(e); }
    
    const customEase = {
        smooth: "power2.inOut",
        bounce: "back.out(1.7)",
        dramatic: "power4.out"
    };

    // ========================================================================
    // 3. PRELOADER (Entry Animation)
    // ========================================================================
    function initPreloader() {
        // Inject Preloader HTML if not present (Optional, can be removed if hardcoded in HTML)
        if (!document.querySelector('.preloader')) {
            const preloader = document.createElement('div');
            preloader.className = 'preloader';
            preloader.innerHTML = `
                <div class="preloader-content">
                    <div class="vlands-logo"><span style="color:#F5C77E">V</span><span style="color:#F9F9F9">lands</span></div>
                    <div class="loading-bar"><div class="loading-fill"></div></div>
                    <div class="loading-text">Loading...</div>
                </div>`;
            
            // Basic Preloader CSS
            const style = document.createElement('style');
            style.textContent = `
                .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #1A2328; display: flex; align-items: center; justify-content: center; z-index: 9999; }
                .preloader-content { text-align: center; color: white; }
                .vlands-logo { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; font-family: 'Poppins', sans-serif; }
                .loading-bar { width: 200px; height: 3px; background: rgba(255,255,255,0.1); margin: 0 auto 1rem; border-radius: 2px; overflow: hidden; }
                .loading-fill { width: 0%; height: 100%; background: #3C8D7C; }
                .loading-text { font-size: 0.9rem; opacity: 0.7; }
            `;
            document.head.appendChild(style);
            document.body.appendChild(preloader);
        }

        const preloaderTL = gsap.timeline({
            onComplete: () => {
                initHeroAnimations(); // Trigger Hero after preloader
            }
        });

        preloaderTL
            .to('.loading-fill', { width: '100%', duration: 1.5, ease: "power2.inOut" })
            .to('.preloader', { y: '-100%', duration: 0.8, ease: "power4.inOut", delay: 0.2 })
            .set('.preloader', { display: 'none' });
    }

    // ========================================================================
    // 4. HERO SECTION ANIMATION (The "Landing" Animation)
    // ========================================================================
    function initHeroAnimations() {
        const heroTitle = document.querySelector('.hero-section h1');
        const heroDesc = document.querySelector('.hero-section p');
        
        // Ensure visibility before animating
        gsap.set([heroTitle, heroDesc], { opacity: 1 });

        const tl = gsap.timeline();

        // Animate Title
        if (heroTitle) {
            tl.from(heroTitle, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: customEase.dramatic
            });
        }

        // Animate Description
        if (heroDesc) {
            tl.from(heroDesc, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.8"); // Overlap slightly with title
        }

        // Background Scroll Effect (Slow movement)
        const scrollTrack = document.querySelector('.scroll-image-track');
        if (scrollTrack) {
            gsap.to(scrollTrack, {
                y: '-50%',
                duration: 20, // Slow smooth scroll
                repeat: -1,
                ease: "none"
            });
        }
    }

    // ========================================================================
    // 5. TRUST CAROUSEL MOBILE TOUCH HANDLER
    // ========================================================================
    
    function initTrustCarouselTouch() {
        const carousel = document.querySelector('.trust-carousel');
        const container = document.querySelector('.trust-carousel-container');
        
        if (!carousel || !container) return;
        
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;
        let touchTimeout = null;
        
        // Enable horizontal scroll on container
        container.style.overflowX = 'auto';
        container.style.scrollBehavior = 'smooth';
        container.style.WebkitOverflowScrolling = 'touch';
        
        // Hide scrollbar on mobile but keep functionality
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .trust-carousel-container::-webkit-scrollbar {
                    display: none;
                }
                .trust-carousel-container {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Pause animation on touch/scroll
        const pauseAnimation = () => {
            carousel.style.animationPlayState = 'paused';
            isScrolling = true;
        };
        
        // Resume animation after touch ends
        const resumeAnimation = () => {
            if (touchTimeout) clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                if (!isScrolling) return;
                carousel.style.animationPlayState = 'running';
                isScrolling = false;
            }, 2000); // Resume 2 seconds after user stops interacting
        };
        
        // Touch events
        container.addEventListener('touchstart', (e) => {
            pauseAnimation();
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            container.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            resumeAnimation();
        }, { passive: true });
        
        // Also handle scroll event for when user scrolls
        container.addEventListener('scroll', () => {
            pauseAnimation();
            resumeAnimation();
        }, { passive: true });
        
        // Mouse events for desktop (existing hover behavior)
        container.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                carousel.style.animationPlayState = 'paused';
            }
        });
        
        container.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                carousel.style.animationPlayState = 'running';
            }
        });
    }
    
    // Initialize touch handler
    initTrustCarouselTouch();

    // ========================================================================
    // 6. REQUIRED UTILITIES (Form Success)
    // ========================================================================
    
    // We must keep this because index.html calls it when the API returns success
    window.playFormSuccessAnimation = function() {
        const form = document.querySelector('.conversion-panel form');
        const submitButton = form ? form.querySelector('.submit-button') : null;
        
        if(submitButton) {
            const originalText = submitButton.textContent;
            const originalBg = submitButton.style.backgroundColor;

            gsap.timeline()
                .to(submitButton, { scale: 0.95, duration: 0.1 })
                .to(submitButton, { 
                    scale: 1.05, 
                    backgroundColor: '#4CAF50', 
                    duration: 0.3, 
                    ease: "back.out(1.7)" 
                })
                .to(submitButton, { 
                    text: "✓ Subscribed!", 
                    duration: 0.2 
                })
                .to(submitButton, { 
                    scale: 1, 
                    delay: 2, 
                    duration: 0.5, 
                    backgroundColor: originalBg,
                    text: originalText,
                    // Clear inputs
                    onComplete: () => { 
                        if(form) form.querySelectorAll('input').forEach(i => i.value = ""); 
                    }
                });
        }
    };

    // ========================================================================
    // INIT
    // ========================================================================
    initPreloader();
});