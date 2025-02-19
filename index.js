// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.5
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
    const createMenuItem = (text, icon) => {
        const item = document.createElement('button');
        item.innerHTML = `${icon} ${text}`;
        item.style.cssText = `
            padding: 10px 14px;
            background: transparent;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            text-align: left;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        `;

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

        return item;
    };

    // Modern floating button
    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C7.58172 3 4 6.58172 4 11C4 15.4183 7.58172 19 12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3ZM3 11C3 6.02944 7.02944 2 12 2C16.9706 2 21 6.02944 21 11C21 15.9706 16.9706 20 12 20C7.02944 20 3 15.9706 3 11ZM12 7C12.5523 7 13 7.44772 13 8V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V8C11 7.44772 11.4477 7 12 7ZM12 16C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16Z" fill="currentColor"/>
    </svg>`;
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
    `;

    floatingButton.onmouseover = function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 6px 24px rgba(46, 126, 238, 0.4)';
    };

    floatingButton.onmouseout = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(46, 126, 238, 0.3)';
    };

    // Create menu items
    const langMenuItem = createMenuItem('Switch Language', '🌐');
    const modeMenuItem = createMenuItem('Switch Mode', '📚');
    const clearCacheMenuItem = createMenuItem('Clear Cache', '🗑');

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
        { code: 'en', name: 'English' },
        { code: 'zh', name: '中文' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'ja', name: '日本語' },
        { code: 'ru', name: 'Русский' }
    ];

    languages.forEach(lang => {
        const langOption = createMenuItem(lang.name, '🌐');
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

    // Toggle menu visibility
    let isMenuVisible = false;
    floatingButton.onclick = function (e) {
        e.stopPropagation();
        isMenuVisible = !isMenuVisible;
        menuContainer.style.display = isMenuVisible ? 'flex' : 'none';
        floatingButton.style.transform = isMenuVisible ? 'rotate(180deg)' : 'rotate(0)';
    };

    // Close menu when clicking outside
    document.addEventListener('click', function () {
        if (isMenuVisible) {
            isMenuVisible = false;
            menuContainer.style.display = 'none';
            floatingButton.style.transform = 'rotate(0)';
        }
    });

    menuContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Update menu items addition
    menuContainer.appendChild(langMenuWrapper);
    menuContainer.appendChild(modeMenuItem);
    menuContainer.appendChild(clearCacheMenuItem);

    // Add elements to container
    buttonContainer.appendChild(menuContainer);
    buttonContainer.appendChild(floatingButton);

    // Add container to page
    document.body.appendChild(buttonContainer);
})();