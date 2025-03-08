// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Helper script for labex.io website
// @author       huhuhang
// @match        https://labex.io/*
// @match        https://labex.io/zh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labex.io
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 9999;
        font-family: -apple-system, IBM Plex Mono, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    `;

    // Create menu container with modern design
    const menuContainer = document.createElement('div');
    menuContainer.style.cssText = `
        display: none;
        flex-direction: column;
        gap: 8px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 12px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        margin-bottom: 16px;
        min-width: 220px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        transform-origin: bottom left;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Modern style for menu items
    const createMenuItem = (text, icon, isDisabled = false) => {
        const item = document.createElement('button');
        item.innerHTML = `${icon} ${text}`;

        const baseStyles = `
            padding: 10px 14px;
            background: transparent;
            border: none;
            border-radius: 12px;
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
            font-size: 14px;
            font-weight: 500;
            color: ${isDisabled ? '#9CA3AF' : '#374151'};
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            text-align: left;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            opacity: ${isDisabled ? '0.6' : '1'};
        `;

        item.style.cssText = baseStyles;

        if (!isDisabled) {
            item.onmouseover = function () {
                this.style.backgroundColor = 'rgba(46, 126, 238, 0.08)';
                this.style.transform = 'translateX(4px)';
                this.style.color = '#2E7EEE';
            };
            item.onmouseout = function () {
                this.style.backgroundColor = 'transparent';
                this.style.transform = 'translateX(0)';
                this.style.color = '#374151';
            };
        }

        return item;
    };

    // Modern floating button
    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>`;
    floatingButton.style.cssText = `
        width: 56px;
        height: 56px;
        border-radius: 28px;
        background: linear-gradient(135deg, #2E7EEE, #1E63C4);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(46, 126, 238, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: white;
        position: relative;
    `;

    // Toggle menu visibility
    let isMenuVisible = false;
    floatingButton.onclick = function (e) {
        e.stopPropagation();
        isMenuVisible = !isMenuVisible;
        menuContainer.style.display = isMenuVisible ? 'flex' : 'none';
    };

    // Close menu when clicking outside
    document.addEventListener('click', function () {
        if (isMenuVisible) {
            isMenuVisible = false;
            menuContainer.style.display = 'none';
        }
    });

    menuContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Button hover effect
    floatingButton.onmouseover = function () {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 6px 24px rgba(46, 126, 238, 0.4)';
    };

    floatingButton.onmouseout = function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(46, 126, 238, 0.3)';
    };

    // Create menu items with Feather icons - check routes for disabled state
    const isLabsRoute = window.location.href.includes('/labs/');
    const isTutorialsRoute = window.location.href.includes('/tutorials/');

    const langMenuItem = createMenuItem('Switch Language', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>');
    const modeMenuItem = createMenuItem('Lab ⇌ Tutorial', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', !(isLabsRoute || isTutorialsRoute));
    const clearCacheMenuItem = createMenuItem('Clear Cache', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>');
    const quickStartMenuItem = createMenuItem('Quick Start', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>');
    const zenModeMenuItem = createMenuItem('Zen Mode', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>', !isLabsRoute);
    const closeMenuItem = createMenuItem('Close Helper', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');

    // Modern language submenu
    const langSubmenu = document.createElement('div');
    langSubmenu.style.cssText = `
        display: none;
        position: absolute;
        left: -12px;
        right: -12px;
        bottom: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 10px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        margin-bottom: 24px;
        flex-direction: column;
        gap: 4px;
        border: 1px solid rgba(0, 0, 0, 0.05);
    `;

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    languages.forEach(lang => {
        const langOption = createMenuItem(lang.name, lang.flag);
        langOption.onclick = function (e) {
            e.stopPropagation();
            const currentUrl = window.location.href;
            const baseUrl = 'labex.io/';
            const urlParts = currentUrl.split(baseUrl);

            if (urlParts.length > 1) {
                let path = urlParts[1];
                path = path.replace(/^(zh|es|fr|de|ja|ru)\//, '');
                const newPath = lang.code === 'en' ? path : `${lang.code}/${path}`;
                const newUrl = `${urlParts[0]}${baseUrl}${newPath}`;
                window.location.href = newUrl;
            }
        };
        langSubmenu.appendChild(langOption);
    });

    // Toggle language submenu on click
    let isLangSubmenuVisible = false;
    langMenuItem.onclick = function (e) {
        e.stopPropagation();
        isLangSubmenuVisible = !isLangSubmenuVisible;
        langSubmenu.style.display = isLangSubmenuVisible ? 'flex' : 'none';
    };

    const langMenuWrapper = document.createElement('div');
    langMenuWrapper.style.position = 'relative';
    langMenuWrapper.appendChild(langMenuItem);
    langMenuWrapper.appendChild(langSubmenu);

    // Close language submenu when clicking outside
    document.addEventListener('click', function () {
        if (isLangSubmenuVisible) {
            isLangSubmenuVisible = false;
            langSubmenu.style.display = 'none';
        }
    });

    langSubmenu.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Mode switch functionality
    modeMenuItem.onclick = function () {
        // Skip if disabled
        if (!(isLabsRoute || isTutorialsRoute)) return;

        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes('/tutorials/')) {
            newUrl = currentUrl.replace('/tutorials/', '/labs/');
        } else if (currentUrl.includes('/labs/')) {
            newUrl = currentUrl.replace('/labs/', '/tutorials/');
        }

        if (newUrl) {
            window.location.href = newUrl;
        }
    };

    // Clear cache functionality
    clearCacheMenuItem.onclick = async function () {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload(true);
        } catch (error) {
            console.error('Failed to clear cache:', error);
            alert('Failed to clear cache. Please try again.');
        }
    };

    // Zen Mode functionality
    zenModeMenuItem.onclick = function () {
        // Skip if disabled
        if (!isLabsRoute) return;

        const currentUrl = window.location.href;
        // Only work on lab pages
        if (currentUrl.includes('/labs/')) {
            const url = new URL(currentUrl);
            const hasParams = url.searchParams.has('hidelabby') || url.searchParams.has('hideheader');

            if (hasParams) {
                // Remove zen mode parameters
                url.searchParams.delete('hidelabby');
                url.searchParams.delete('hideheader');
            } else {
                // Add zen mode parameters
                url.searchParams.set('hidelabby', 'true');
                url.searchParams.set('hideheader', 'true');
            }

            window.location.href = url.toString();
        }
    };

    // Add tooltips to explain disabled state
    if (!isLabsRoute) {
        zenModeMenuItem.title = "Zen Mode is only available on Lab pages";
    }

    if (!(isLabsRoute || isTutorialsRoute)) {
        modeMenuItem.title = "Mode switch is only available on Lab or Tutorial pages";
    }

    // Hide the entire button container when close menu item is clicked
    closeMenuItem.onclick = function (e) {
        e.stopPropagation();
        buttonContainer.style.display = 'none';
    };

    // Quick Start functionality
    quickStartMenuItem.onclick = function (e) {
        e.stopPropagation();
        window.open('https://labex.io/labs/linux-your-first-linux-lab-270253?hidelabby=true&hideheader=true', '_blank');
    };

    // Update menu items addition
    menuContainer.appendChild(langMenuWrapper);
    menuContainer.appendChild(modeMenuItem);
    menuContainer.appendChild(quickStartMenuItem);
    menuContainer.appendChild(zenModeMenuItem);
    menuContainer.appendChild(clearCacheMenuItem);
    menuContainer.appendChild(closeMenuItem);

    // Add elements to container
    buttonContainer.appendChild(menuContainer);
    buttonContainer.appendChild(floatingButton);

    // Add container to page
    document.body.appendChild(buttonContainer);
})();