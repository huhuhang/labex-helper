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
    `;

    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.style.cssText = `
        display: none;
        flex-direction: column;
        gap: 8px;
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 10px;
    `;

    // Common style for creating menu items
    const createMenuItem = (text, icon) => {
        const item = document.createElement('button');
        item.innerHTML = `${icon} ${text}`;
        item.style.cssText = `
            padding: 8px 12px;
            background: none;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            text-align: left;
            transition: background-color 0.2s;
        `;

        item.onmouseover = function () {
            this.style.backgroundColor = '#f0f0f0';
        };
        item.onmouseout = function () {
            this.style.backgroundColor = 'transparent';
        };

        return item;
    };

    // Create floating button
    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 0C22.3284 0 23 0.671573 23 1.5V6.5C23 7.32843 22.3284 8 21.5 8H20.997V9.515L29.7172 21.6234C29.8704 21.8362 29.9647 22.0846 29.9918 22.3436L30 22.5V28.5C30 29.3284 29.3284 30 28.5 30H1.5C0.671573 30 0 29.3284 0 28.5V22.5C0 22.1854 0.098913 21.8788 0.282747 21.6235L9.001 9.515V8H8.5C7.7203 8 7.07955 7.40511 7.00687 6.64446L7 6.5V1.5C7 0.671573 7.67157 0 8.5 0H21.5ZM20 3H10V5H10.5011C11.2807 5 11.9215 5.59489 11.9942 6.35554L12.0011 6.5V9.87827C12.0011 10.272 11.8773 10.6558 11.6472 10.9753L3 22.983V27H27V22.984L18.3519 10.9754C18.1547 10.7015 18.0355 10.3804 18.0055 10.0463L17.998 9.87826V6.5C17.998 5.67157 18.6695 5 19.498 5H20V3ZM19.3999 21C20.2283 21 20.8999 21.6716 20.8999 22.5C20.8999 23.3284 20.2283 24 19.3999 24H15.8C14.9716 24 14.3 23.3284 14.3 22.5C14.3 21.6716 14.9716 21 15.8 21H19.3999ZM11.729 15.4393L14.3973 18.1077C14.9831 18.6935 14.9831 19.6432 14.3973 20.229L11.729 22.8973C11.1432 23.4831 10.1935 23.4831 9.60767 22.8973C9.02188 22.3115 9.02188 21.3618 9.60767 20.776L11.2149 19.1687L9.60767 17.5607C9.05634 17.0093 9.02391 16.1356 9.51037 15.5463L9.60767 15.4393C10.1935 14.8536 11.1432 14.8536 11.729 15.4393Z" fill="white"/>
    </svg>`;
    floatingButton.style.cssText = `
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(76, 175, 80, 0.9);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    // Create menu items
    const langMenuItem = createMenuItem('Switch Language', '🌐');
    const modeMenuItem = createMenuItem('Switch Mode', '📚');
    const clearCacheMenuItem = createMenuItem('Clear Cache', '🗑');

    // Create language submenu
    const langSubmenu = document.createElement('div');
    langSubmenu.style.cssText = `
        display: none;
        position: absolute;
        left: 0;
        bottom: 100%;
        background: white;
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 8px;
        flex-direction: column;
        gap: 4px;
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