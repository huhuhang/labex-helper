// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.4
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
    floatingButton.innerHTML = '⚙️';
    floatingButton.style.cssText = `
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(76, 175, 80, 0.9);
        border: none;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    // Create menu items
    const langMenuItem = createMenuItem('Switch Language', '🌐');
    const modeMenuItem = createMenuItem('Switch Mode', '📚');
    const clearCacheMenuItem = createMenuItem('Clear Cache', '🗑️');

    // Language switch functionality
    langMenuItem.onclick = function () {
        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes('/zh/')) {
            newUrl = currentUrl.replace('/zh/', '/');
        } else {
            newUrl = currentUrl.replace('labex.io/', 'labex.io/zh/');
        }

        window.location.href = newUrl;
    };

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

    // Add items to menu
    menuContainer.appendChild(langMenuItem);
    menuContainer.appendChild(modeMenuItem);
    menuContainer.appendChild(clearCacheMenuItem);

    // Add elements to container
    buttonContainer.appendChild(menuContainer);
    buttonContainer.appendChild(floatingButton);

    // Add container to page
    document.body.appendChild(buttonContainer);
})();