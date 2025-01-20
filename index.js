// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  labex.io 网页助手
// @author       huhuhang
// @match        https://labex.io/*
// @match        https://labex.io/zh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labex.io
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮容器
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

    // 创建按钮的通用样式
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

    // 创建语言切换按钮
    const langButton = createButton('切换语言', '🇨🇳');

    // 创建模式切换按钮
    const modeButton = createButton('切换模式', '📚');

    // 语言切换功能
    langButton.onclick = function () {
        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes('/zh/')) {
            newUrl = currentUrl.replace('/zh/', '/');
            this.innerHTML = '🇺🇸 切换语言';
        } else {
            newUrl = currentUrl.replace('labex.io/', 'labex.io/zh/');
            this.innerHTML = '🇨🇳 切换语言';
        }

        window.location.href = newUrl;
    };

    // 模式切换功能
    modeButton.onclick = function () {
        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes('/tutorials/')) {
            newUrl = currentUrl.replace('/tutorials/', '/labs/');
            this.innerHTML = '💻 切换模式';
        } else if (currentUrl.includes('/labs/')) {
            newUrl = currentUrl.replace('/labs/', '/tutorials/');
            this.innerHTML = '📚 切换模式';
        }

        if (newUrl) {
            window.location.href = newUrl;
        }
    };

    // 初始化按钮文本
    if (window.location.href.includes('/zh/')) {
        langButton.innerHTML = '🇺🇸 切换语言';
    } else {
        langButton.innerHTML = '🇨🇳 切换语言';
    }

    if (window.location.href.includes('/tutorials/')) {
        modeButton.innerHTML = '💻 切换模式';
    } else if (window.location.href.includes('/labs/')) {
        modeButton.innerHTML = '📚 切换模式';
    }

    // 将按钮添加到容器中
    buttonContainer.appendChild(langButton);
    buttonContainer.appendChild(modeButton);

    // 将容器添加到页面
    document.body.appendChild(buttonContainer);
})();