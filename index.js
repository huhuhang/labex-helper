// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.8.7
// @description  Helper script for labex.io website
// @author       huhuhang
// @match        https://labex.io/*
// @match        https://labex.io/zh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labex.io
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 将主要逻辑封装成函数以便重用
    function initializeHelper() {
        // 移除现有的按钮容器（如果存在）
        const existingContainer = document.querySelector('.labex-helper-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('labex-helper-container');
        buttonContainer.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 9999;
            font-family: -apple-system, Maple Mono NF CN, IBM Plex Mono, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        `;

        // Create menu container with modern design
        const menuContainer = document.createElement('div');
        menuContainer.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 4px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 8px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 8px;
            min-width: 160px;
            border: 1px solid rgba(0, 0, 0, 0.05);
            transform-origin: bottom left;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // Modern style for menu items
        const createMenuItem = (text, icon, isDisabled = false) => {
            const item = document.createElement('button');
            item.innerHTML = `${icon} ${text}`;

            const baseStyles = `
                padding: 6px 10px;
                background: transparent;
                border: none;
                border-radius: 8px;
                cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
                font-size: 12px;
                font-weight: 500;
                color: ${isDisabled ? '#9CA3AF' : '#374151'};
                display: flex;
                align-items: center;
                gap: 6px;
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
                    this.style.backgroundColor = 'rgba(75, 85, 99, 0.08)';
                    this.style.transform = 'translateX(4px)';
                    this.style.color = '#4B5563';
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
        floatingButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>`;
        floatingButton.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 14px;
            background: linear-gradient(135deg, #4B5563, #374151);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(75, 85, 99, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
            position: relative;
        `;

        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        // 处理鼠标按下事件，开始拖动
        buttonContainer.addEventListener('mousedown', function (e) {
            // 只在点击悬浮球而不是菜单时启用拖动
            if (!menuContainer.contains(e.target)) {
                isDragging = true;
                // 记录鼠标与按钮容器左上角的相对位置
                offsetX = e.clientX - buttonContainer.getBoundingClientRect().left;
                offsetY = e.clientY - buttonContainer.getBoundingClientRect().top;

                // 更改光标样式
                buttonContainer.style.cursor = 'grabbing';

                // 防止拖动时触发按钮点击
                e.preventDefault();
            }
        });

        // 处理鼠标移动事件，实现拖动
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                // 计算新位置
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // 限制不超出视口
                newLeft = Math.max(10, Math.min(window.innerWidth - buttonContainer.offsetWidth - 10, newLeft));
                newTop = Math.max(10, Math.min(window.innerHeight - buttonContainer.offsetHeight - 10, newTop));

                // 更新位置
                buttonContainer.style.left = newLeft + 'px';
                buttonContainer.style.bottom = (window.innerHeight - newTop - buttonContainer.offsetHeight) + 'px';
            }
        });

        // 处理鼠标释放事件，停止拖动
        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                buttonContainer.style.cursor = 'default';
            }
        });

        // 鼠标离开窗口时停止拖动
        document.addEventListener('mouseleave', function () {
            if (isDragging) {
                isDragging = false;
                buttonContainer.style.cursor = 'default';
            }
        });

        // Toggle menu visibility
        let isMenuVisible = false;
        floatingButton.onclick = function (e) {
            // 只有在非拖动状态下才触发菜单显示/隐藏
            if (!isDragging) {
                e.stopPropagation();
                isMenuVisible = !isMenuVisible;
                menuContainer.style.display = isMenuVisible ? 'flex' : 'none';
            }
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
            this.style.boxShadow = '0 6px 24px rgba(75, 85, 99, 0.4)';
        };

        floatingButton.onmouseout = function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(75, 85, 99, 0.3)';
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

        // IBM Plex Mono Font Toggle functionality
        let isPlexFontEnabled = localStorage.getItem('labex_use_plex_font') === 'true';
        const plexFontMenuItem = createMenuItem(
            isPlexFontEnabled ? 'Disable Mono' : 'Enable Mono',
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>'
        );

        // Function to apply IBM Plex Mono font
        const applyPlexFont = () => {
            const styleId = 'labex-plex-font-style';

            if (isPlexFontEnabled) {
                // Create style element if it doesn't exist
                if (!document.getElementById(styleId)) {
                    const styleElement = document.createElement('style');
                    styleElement.id = styleId;
                    styleElement.textContent = `
                        * {
                            font-family: 'Maple Mono NF CN','IBM Plex Mono', monospace !important;
                        }
                    `;
                    document.head.appendChild(styleElement);
                }
            } else {
                // Remove style if it exists
                const existingStyle = document.getElementById(styleId);
                if (existingStyle) {
                    existingStyle.remove();
                }
            }
        };

        // Toggle IBM Plex Mono font
        plexFontMenuItem.onclick = function (e) {
            e.stopPropagation();
            isPlexFontEnabled = !isPlexFontEnabled;
            localStorage.setItem('labex_use_plex_font', isPlexFontEnabled);

            // Update menu item text
            this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg> ${isPlexFontEnabled ? 'Disable Mono' : 'Enable Mono'}`;

            // Apply or remove the font
            applyPlexFont();
        };

        // Apply font on page load if enabled
        applyPlexFont();

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
        menuContainer.appendChild(plexFontMenuItem);  // Add the IBM Plex Mono font toggle
        menuContainer.appendChild(clearCacheMenuItem);
        menuContainer.appendChild(closeMenuItem);

        // Add elements to container
        buttonContainer.appendChild(menuContainer);
        buttonContainer.appendChild(floatingButton);

        // Add container to page
        document.body.appendChild(buttonContainer);
    }

    // 初始化悬浮球
    initializeHelper();

    // 监听 URL 变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initializeHelper();
        }
    }).observe(document, { subtree: true, childList: true });

})();