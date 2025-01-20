// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
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
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    // Common style for creating buttons
    const createButton = (text, icon) => {
        const button = document.createElement('button');
        button.innerHTML = `${icon} ${text}`;
        button.style.cssText = `
            padding: 8px 16px;
            background-color: rgba(76, 175, 80, 0.9);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 140px;
        `;

        button.onmouseover = function () {
            this.style.backgroundColor = 'rgba(69, 160, 73, 0.95)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        };
        button.onmouseout = function () {
            this.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        };

        return button;
    };

    // Create language switch button
    const langButton = createButton('Switch Language', '🇨🇳');

    // Create mode switch button
    const modeButton = createButton('Switch Mode', '📚');

    // Language switch functionality
    langButton.onclick = function () {
        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes('/zh/')) {
            newUrl = currentUrl.replace('/zh/', '/');
            this.innerHTML = '🇺🇸 Switch Language';
        } else {
            newUrl = currentUrl.replace('labex.io/', 'labex.io/zh/');
            this.innerHTML = '🇨🇳 Switch Language';
        }

        window.location.href = newUrl;
    };

    // Mode switch functionality
    modeButton.onclick = function () {
        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes('/tutorials/')) {
            newUrl = currentUrl.replace('/tutorials/', '/labs/');
            this.innerHTML = '💻 Switch Mode';
        } else if (currentUrl.includes('/labs/')) {
            newUrl = currentUrl.replace('/labs/', '/tutorials/');
            this.innerHTML = '📚 Switch Mode';
        }

        if (newUrl) {
            window.location.href = newUrl;
        }
    };

    // Initialize button text
    if (window.location.href.includes('/zh/')) {
        langButton.innerHTML = '🇺🇸 Switch Language';
    } else {
        langButton.innerHTML = '🇨🇳 Switch Language';
    }

    if (window.location.href.includes('/tutorials/')) {
        modeButton.innerHTML = '💻 Switch Mode';
    } else if (window.location.href.includes('/labs/')) {
        modeButton.innerHTML = '📚 Switch Mode';
    }

    // Add buttons to container
    buttonContainer.appendChild(langButton);
    buttonContainer.appendChild(modeButton);

    // Add container to page
    document.body.appendChild(buttonContainer);
})();