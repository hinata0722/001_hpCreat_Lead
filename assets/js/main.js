/* ==========================================================================
   Body Make Gym LEAD
   assets/js/main.js

   外部ライブラリ（jQuery等）は一切使用していません。素のJavaScriptのみです。
   すべての処理は DOMContentLoaded 後に実行され、JSが動かない環境でも
   ページの内容はそのまま読める設計にしています。

   ▼このファイルがやっていること
   01. ヘッダーのスクロール状態（背景を少し濃くする）
   02. スマホ用ハンバーガーメニューの開閉
   03. スクロールに合わせた要素のフェードイン
   04. 現在表示中のセクションをナビで示す
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* JSが有効なときだけフェードインの初期状態を有効にする（内容が消えるのを防ぐ） */
  body.classList.add('lead-js');


  /* ------------------------------------------------------------------
     01. ヘッダーのスクロール状態
     ------------------------------------------------------------------ */
  var header = document.getElementById('lead-header');

  if (header) {
    var ticking = false;

    var updateHeader = function () {
      if (window.scrollY > 12) {
        header.classList.add('lead-is-scrolled');
      } else {
        header.classList.remove('lead-is-scrolled');
      }
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateHeader);
      }
    }, { passive: true });

    updateHeader();
  }


  /* ------------------------------------------------------------------
     02. ハンバーガーメニューの開閉
     ------------------------------------------------------------------ */
  var toggle = document.querySelector('.lead-header__toggle');
  var nav = document.getElementById('lead-nav');

  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('lead-is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
    };

    var openNav = function () {
      nav.classList.add('lead-is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'メニューを閉じる');
    };

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      } else {
        openNav();
      }
    });

    /* メニュー内のリンクを押したら閉じる */
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        closeNav();
      }
    });

    /* Escキーで閉じる */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    /* PC幅に広がったら開閉状態をリセット */
    var desktop = window.matchMedia('(min-width: 1024px)');
    var onBreakpoint = function (mq) {
      if (mq.matches) { closeNav(); }
    };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onBreakpoint);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onBreakpoint);
    }
  }


  /* ------------------------------------------------------------------
     03. スクロールに合わせたフェードイン
     IntersectionObserver が使えない環境／モーション低減設定では
     最初からすべて表示します。
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('.lead-reveal');

  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(revealTargets, function (el) {
        el.classList.add('lead-is-in');
      });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('lead-is-in');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      Array.prototype.forEach.call(revealTargets, function (el) {
        revealObserver.observe(el);
      });
    }
  }


  /* ------------------------------------------------------------------
     04. 現在表示中のセクションをナビで示す
     ------------------------------------------------------------------ */
  var navLinks = document.querySelectorAll('.lead-nav__link[href^="#"]');

  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkMap = {};
    var watched = [];

    Array.prototype.forEach.call(navLinks, function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = id ? document.getElementById(id) : null;
      if (section) {
        linkMap[id] = link;
        watched.push(section);
      }
    });

    if (watched.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = linkMap[entry.target.id];
          if (!link) { return; }
          if (entry.isIntersecting) {
            Array.prototype.forEach.call(navLinks, function (other) {
              other.classList.remove('lead-is-active');
            });
            link.classList.add('lead-is-active');
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

      watched.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }
  }

});
