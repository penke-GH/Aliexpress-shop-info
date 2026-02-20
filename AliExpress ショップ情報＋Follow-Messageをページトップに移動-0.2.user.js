// ==UserScript==
// @name         AliExpress ショップ情報＋Follow/Messageをページトップに移動
// @namespace    https://example.com
// @version      0.2
// @description  AliExpressストアページで店情報＋Follow/Messageボタン全体を一番上に持ってくる
// @author       You
// @match        https://*.aliexpress.com/item/*
// @match        https://*.aliexpress.com/*/store/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function moveStoreBlock() {
        // 優先順位の高いセレクタ（2025-2026年頃の傾向に合わせた広めのパターン）
        const selectors = [
            'div[class*="store-info--container"]',
            'div[class*="store-header--"]',
            'div[class*="seller-info--"]',
            'section[class*="store-info"]',
            'div[class*="store--info"]',
            'div[class*="storeTop"]',
            'div[class*="store-info"]',           // 部分一致
            'div[class*="store-header"]'
        ];

        let block = null;

        // セレクタを順に試す
        for (const sel of selectors) {
            block = document.querySelector(sel);
            if (block) break;
        }

        // さらに確実にするため、Follow/Messageボタンが子孫に含まれる要素を探す
        if (!block) {
            const followBtn = document.querySelector('button[class*="follow"], button[class*="subscribe"], [class*="follow-btn"], [aria-label*="Follow"], [data-pl*="follow"]');
            const messageBtn = document.querySelector('button[class*="message"], button[class*="chat"], button[class*="contact"], [aria-label*="Message"], [data-pl*="message"]');

            if (followBtn || messageBtn) {
                const candidate = (followBtn || messageBtn).closest('div[class*="store"], section, header, .seller-info');
                if (candidate) block = candidate;
            }
        }

        if (!block) return; // 見つからなければ終了

        // 既にbody直下orトップにある場合はスキップ（ループ防止）
        if (document.body.contains(block) &&
            (!document.body.firstElementChild ||
             block === document.body.firstElementChild ||
             document.body.firstElementChild.contains(block))) {
            return;
        }

        // bodyの一番上に移動
        document.body.insertBefore(block, document.body.firstChild);

        // 見た目を整える（必要に応じてコメントアウトや調整）
        Object.assign(block.style, {
            //margin: '10px auto',
            margin: '10px 0 15px 0',
            maxWidth: '1000px',       // AliExpressの標準幅に近づける
            width: '100%',
            padding: '15px 20px',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e8e8e8',
            zIndex: '998',
            position: 'relative'
        });

        console.log('ショップ情報ブロックをトップに移動しました');
    }

    // ページ読み込み後すぐ + 動的追加対策
    function init() {
        moveStoreBlock();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // MutationObserverで後から追加された場合も対応
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('button[class*="follow"]') || document.querySelector('div[class*="store-info"]')) {
            moveStoreBlock();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();