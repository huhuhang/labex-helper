// ==UserScript==
// @name         LabEx Helper
// @namespace    http://tampermonkey.net/
// @version      1.8.8
// @description  Helper script for labex.io website
// @author       huhuhang
// @match        https://labex.io/*
// @match        https://labex.io/zh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labex.io
// @grant        GM_xmlhttpRequest
// @connect      labex-api-proxy.huhuhang.workers.dev
// ==/UserScript==

(function () {
    'use strict';

    // Function to fetch and display lab data
    async function fetchAndDisplayLabData(labAlias, buttonContainer) {
        const apiUrl = `https://labex-api-proxy.huhuhang.workers.dev/feishu/labs/${labAlias}`;

        // Remove existing data container if any
        const existingDataContainer = buttonContainer.querySelector('.labex-stats-container');
        if (existingDataContainer) {
            existingDataContainer.remove();
        }

        const labDataContainer = document.createElement('div');
        labDataContainer.classList.add('labex-stats-container');
        labDataContainer.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 10px 12px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            font-size: 12px;
            color: #374151;
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 250px;
            width: 280px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
            z-index: 9998;
        `;

        buttonContainer.appendChild(labDataContainer);

        labDataContainer.innerHTML = '<div class="loading-stats"><span class="pulse-dot"></span> Loading stats...</div>';

        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function (response) {
                    labDataContainer.style.opacity = '1';
                    labDataContainer.style.transform = 'translateY(0)';

                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const learned = data.ALL_LEARNED || 0;
                        const passed = data.ALL_PASSED || 0;
                        const githubLink = data.GITHUB?.link;
                        const githubText = data.GITHUB?.text || 'GitHub';
                        const feeType = data.FEE_TYPE || 'N/A';
                        const positiveReviews = data.POSITIVE_REVIEW || 0;
                        const neutralReviews = data.NEUTRAL_REVIEW || 0;
                        const negativeReviews = data.NEGATIVE_REVIEW || 0;
                        const isVerified = data.VERIFIED === true;
                        const isOpenNetwork = data.OPEN_NETWORK === true;

                        const totalReviews = positiveReviews + neutralReviews + negativeReviews;
                        const passRate = learned > 0 ? ((passed / learned) * 100).toFixed(1) : '0.0';
                        const positiveRate = totalReviews > 0 ? ((positiveReviews / totalReviews) * 100).toFixed(1) : '0.0';
                        const negativeRate = totalReviews > 0 ? ((negativeReviews / totalReviews) * 100).toFixed(1) : '0.0';

                        // Build HTML structure for compact floating display
                        // Inject CSS for styling the stats
                        const styleSheet = document.createElement('style');
                        styleSheet.textContent = `
                            .labex-stats-container {
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            }
                            .labex-stats-container strong { 
                                font-weight: 600; 
                                color: #1f2937; 
                            }
                            .labex-stats-container .title {
                                font-size: 13px;
                                font-weight: 600;
                                color: #1f2937;
                                margin-bottom: 6px;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                padding: 2px 0;
                            }
                            .stats-row {
                                display: flex;
                                width: 100%;
                                justify-content: space-between;
                                margin-bottom: 8px;
                                padding: 5px;
                                border-radius: 8px;
                            }
                            .stats-row:nth-of-type(1) {
                                background-color: rgba(239, 246, 255, 0.6); /* 浅蓝色背景 */
                            }
                            .stats-row:nth-of-type(2) {
                                background-color: rgba(236, 253, 245, 0.6); /* 浅绿色背景 */
                            }
                            .badge-row {
                                background-color: rgba(254, 243, 199, 0.3); /* 浅黄色背景 */
                                border-radius: 8px;
                                padding: 5px;
                            }
                            .stat-item {
                                flex: 1;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                background: rgba(255, 255, 255, 0.7);
                                padding: 6px 4px;
                                border-radius: 6px;
                                min-width: 0;
                                transition: all 0.2s ease;
                                text-align: center;
                                margin: 0 3px;
                            }
                            .stat-item:first-child {
                                margin-left: 0;
                            }
                            .stat-item:last-child {
                                margin-right: 0;
                            }
                            .stat-item:hover {
                                background: rgba(243, 244, 246, 0.9);
                                transform: translateY(-2px);
                            }
                            .stat-item .value {
                                font-weight: 600;
                                color: #1f2937;
                                font-size: 13px;
                                text-align: center;
                                width: 100%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .stat-item .label {
                                font-size: 10px;
                                color: #6b7280;
                                margin-top: 2px;
                                text-align: center;
                                width: 100%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .divider {
                                height: 1px;
                                background: rgba(229, 231, 235, 0.5);
                                margin: 6px 0;
                                width: 100%;
                            }
                            .badge {
                                flex: 1;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                gap: 4px;
                                padding: 5px 3px;
                                border-radius: 6px;
                                font-size: 10px;
                                font-weight: 500;
                                cursor: help;
                                transition: all 0.2s ease;
                                margin: 0 3px;
                                text-align: center;
                                background: rgba(255, 255, 255, 0.7);
                            }
                            .badge:first-child {
                                margin-left: 0;
                            }
                            .badge:last-child {
                                margin-right: 0;
                            }
                            .badge:hover {
                                transform: translateY(-1px);
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                            }
                            .badge.verified { background-color: #e0f2fe; color: #0c4a6e; }
                            .badge.fee { background-color: #f3f4f6; color: #4b5563; }
                            .badge.network { background-color: #fef3c7; color: #713f12; }
                            .badge.network.disabled { background-color: #f3f4f6; color: #6b7280; }
                            .badge.github {
                                background-color: #eff6ff;
                                color: #3b82f6;
                                text-decoration: none;
                                cursor: pointer;
                            }
                            .badge.github svg {
                                width: 11px; height: 11px;
                            }
                            .loading-stats {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                font-size: 12px;
                                color: #6b7280;
                            }
                            .pulse-dot {
                                width: 8px;
                                height: 8px;
                                background-color: #3b82f6;
                                border-radius: 50%;
                                animation: pulse 1.5s infinite;
                            }
                            @keyframes pulse {
                                0% {
                                    transform: scale(0.8);
                                    opacity: 0.5;
                                }
                                50% {
                                    transform: scale(1.1);
                                    opacity: 1;
                                }
                                100% {
                                    transform: scale(0.8);
                                    opacity: 0.5;
                                }
                            }
                        `;

                        labDataContainer.innerHTML = ``; // Clear previous content
                        labDataContainer.appendChild(styleSheet);

                        const contentWrapper = document.createElement('div');
                        contentWrapper.innerHTML = `
                            <div class="title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                </svg>
                                Lab Statistics
                            </div>
                            
                            <!-- 第一排：学习人数、通过人数、通过率 -->
                            <div class="stats-row">
                                <div class="stat-item" title="Total Learners">
                                    <div class="value">${learned.toLocaleString()}</div>
                                    <div class="label">Learners</div>
                                </div>
                                <div class="stat-item" title="Students Passed">
                                    <div class="value">${passed.toLocaleString()}</div>
                                    <div class="label">Passed</div>
                                </div>
                                <div class="stat-item" title="Success Rate">
                                    <div class="value">${passRate}%</div>
                                    <div class="label">Pass Rate</div>
                                </div>
                            </div>
                            
                            <div class="divider"></div>
                            
                            <!-- 第二排：好评、中立评价、差评 -->
                            <div class="stats-row">
                                <div class="stat-item" title="Positive Reviews (${positiveRate}%)">
                                    <div class="value">${positiveReviews.toLocaleString()}</div>
                                    <div class="label">👍 Likes</div>
                                </div>
                                <div class="stat-item" title="Neutral Reviews">
                                    <div class="value">${neutralReviews.toLocaleString()}</div>
                                    <div class="label">😐 Neutral</div>
                                </div>
                                <div class="stat-item" title="Negative Reviews (${negativeRate}%)">
                                    <div class="value">${negativeReviews.toLocaleString()}</div>
                                    <div class="label">👎 Dislikes</div>
                                </div>
                            </div>
                            
                            <div class="divider"></div>
                            
                            <!-- 第三排：验证状态、网络需求、GitHub 链接 -->
                            <div class="badge-row">
                                <span class="badge verified" title="${isVerified ? 'Verified Lab' : 'Not Verified'}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    ${isVerified ? 'Verified' : 'Not Verified'}
                                </span>
                                <span class="badge network ${!isOpenNetwork ? 'disabled' : ''}" title="${isOpenNetwork ? 'Open Network Required' : 'No Open Network Required'}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                    ${isOpenNetwork ? 'OpenNet' : 'No OpenNet'}
                                </span>
                                ${githubLink ? `
                                <a class="badge github" href="${githubLink}" target="_blank" title="${githubText}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    GitHub
                                </a>` : `
                                <span class="badge fee">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    ${feeType}
                                </span>`}
                            </div>
                        `;
                        labDataContainer.appendChild(contentWrapper);

                        // Add hover effects for Github link
                        const githubAnchor = labDataContainer.querySelector('a.github');
                        if (githubAnchor) {
                            githubAnchor.onmouseover = () => {
                                githubAnchor.style.backgroundColor = '#dbeafe';
                                githubAnchor.style.transform = 'translateY(-2px)';
                                githubAnchor.style.boxShadow = '0 2px 5px rgba(59, 130, 246, 0.2)';
                            };
                            githubAnchor.onmouseout = () => {
                                githubAnchor.style.backgroundColor = '#eff6ff';
                                githubAnchor.style.transform = 'translateY(-1px)';
                                githubAnchor.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
                            };
                        }
                    } else {
                        console.error('Failed to fetch lab data:', response.statusText);
                        labDataContainer.innerHTML = `<div class="loading-stats" style="color: #ef4444;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Failed to load stats</div>`;
                    }
                },
                onerror: function (error) {
                    console.error('Error fetching lab data:', error);
                    labDataContainer.style.opacity = '1';
                    labDataContainer.style.transform = 'translateY(0)';
                    labDataContainer.innerHTML = `<div class="loading-stats" style="color: #ef4444;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Failed to load stats</div>`;
                }
            });

        } catch (error) {
            console.error('Error fetching or processing lab data:', error);
            labDataContainer.style.opacity = '1'; // Ensure visibility on error
            labDataContainer.style.transform = 'translateY(0)';
            labDataContainer.innerHTML = `<div class="loading-stats" style="color: #ef4444;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Failed to load stats</div>`;
        }
    }

    // 将主要逻辑封装成函数以便重用
    function initializeHelper() {
        // 移除现有的按钮容器（如果存在）
        const existingContainer = document.querySelector('.labex-helper-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // 从 localStorage 中获取信息卡片显示状态，默认为显示
        let isStatsCardVisible = localStorage.getItem('labex_stats_card_visible') !== 'false';

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
            if (!isDragging) {
                e.stopPropagation();
                isMenuVisible = !isMenuVisible;
                menuContainer.style.display = isMenuVisible ? 'flex' : 'none';
                const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
                if (labDataContainer) {
                    labDataContainer.style.opacity = isMenuVisible ? '0' : '1';
                    labDataContainer.style.transform = isMenuVisible ? 'translateY(10px)' : 'translateY(0)';
                }
            }
        };

        // Close menu when clicking outside
        document.addEventListener('click', function () {
            if (isMenuVisible) {
                isMenuVisible = false;
                menuContainer.style.display = 'none';
                const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
                if (labDataContainer) {
                    labDataContainer.style.opacity = '1';
                    labDataContainer.style.transform = 'translateY(0)';
                }
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

        // 添加信息卡片切换菜单项
        const toggleStatsCardMenuItem = createMenuItem(
            isStatsCardVisible ? 'Hide Stats Card' : 'Show Stats Card',
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
            !isLabsRoute
        );

        // 信息卡片切换功能
        toggleStatsCardMenuItem.onclick = function (e) {
            e.stopPropagation();
            isStatsCardVisible = !isStatsCardVisible;
            localStorage.setItem('labex_stats_card_visible', isStatsCardVisible.toString());

            // 更新菜单项文本
            this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> ${isStatsCardVisible ? 'Hide Stats Card' : 'Show Stats Card'}`;

            // 隐藏或显示统计卡片
            const labDataContainer = buttonContainer.querySelector('.labex-stats-container');
            if (labDataContainer) {
                if (isStatsCardVisible) {
                    labDataContainer.style.display = 'flex';
                    setTimeout(() => {
                        labDataContainer.style.opacity = '1';
                        labDataContainer.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    labDataContainer.style.opacity = '0';
                    labDataContainer.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        labDataContainer.style.display = 'none';
                    }, 300); // 等待过渡动画完成
                }
            } else if (isStatsCardVisible && isLabsRoute) {
                // 如果卡片不存在但用户选择显示且在实验室页面，则重新获取数据
                const currentUrl = window.location.href;
                const labMatch = currentUrl.match(/\/labs\/([^\/?#]+)/);
                if (labMatch && labMatch[1]) {
                    const labAlias = labMatch[1];
                    fetchAndDisplayLabData(labAlias, buttonContainer);
                }
            }
        };

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
        menuContainer.appendChild(toggleStatsCardMenuItem); // 添加信息卡片切换选项
        menuContainer.appendChild(clearCacheMenuItem);
        menuContainer.appendChild(closeMenuItem);

        // Add elements to container
        buttonContainer.appendChild(menuContainer);
        buttonContainer.appendChild(floatingButton);

        // Add container to page
        document.body.appendChild(buttonContainer);

        // --- Lab Data Fetching Logic ---
        const currentUrl = window.location.href;
        const labMatch = currentUrl.match(/\/labs\/([^\/?#]+)/);
        if (labMatch && labMatch[1] && isStatsCardVisible) {
            const labAlias = labMatch[1];
            fetchAndDisplayLabData(labAlias, buttonContainer);
        }
        // --- End Lab Data Fetching Logic ---
    }

    // Wait for the page to fully load before initializing the helper initially
    window.addEventListener('load', () => {
        initializeHelper();
    });

    // 监听 URL 变化 (for SPA navigations)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initializeHelper();
        }
    }).observe(document, { subtree: true, childList: true });

})();