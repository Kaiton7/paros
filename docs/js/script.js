const DOM_SELECTORS = {
  headerPlaceholder: "#header-placeholder",
  footerPlaceholder: "#footer-placeholder",
  burgerMenu: ".burger",
  navLinks: ".nav-links",
  navLinksItems: ".nav-links li",
  header: "header",
  smoothScrollLinks: 'a[href^="#"]',
};


document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
  initSmoothScroll();
  initHeaderScroll();
  updateActiveNavLink();
  if (window.location.pathname.endsWith("/facility.html")) {
    initModalSwiper();
  }
});


function initBurgerMenu() {
  const burger = document.querySelector(DOM_SELECTORS.burgerMenu);
  const nav = document.querySelector(DOM_SELECTORS.navLinks);
  const navLinks = document.querySelectorAll(DOM_SELECTORS.navLinksItems);

  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");

    navLinks.forEach((link, index) => {
      const animationDelay = `${index / 7 + 0.3}s`;
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation =
          `navLinkFade 0.5s ease forwards ${animationDelay}`;
      }
    });
  });
}


// 既存のDOM_SELECTORSの下や、他の関数の下など、適切な位置に新しい関数を追加
function updateActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a"); // ナビゲーションの<a>要素をすべて取得
  const currentPath = window.location.pathname; // 現在のページのパスを取得 (例: /index.html, /company.html)
  const rootPath = "/"; // ルートパス (index.html がルートになる場合)

  navLinks.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname; // 各リンクのパスを取得

    // 既存のIDによるスタイル指定の影響を避けるため、一度リセットする（必要に応じて）
    // もしCSSで #nav-home が他のスタイルを上書きしている場合は、
    // #nav-home のスタイル指定をコメントアウトまたは削除してください。

    // 現在のパスとリンクのパスが一致するか、
    // または現在のパスがルートでリンクがホーム（index.html）の場合に 'active-nav' クラスを付与
    if (linkPath === currentPath || (currentPath === rootPath && link.getAttribute('href') === 'index.html')) {
      link.classList.add("active-nav");
    } else {
      link.classList.remove("active-nav"); // それ以外のリンクからはクラスを削除
    }
  });
}
function initHeaderScroll() {
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const header = document.querySelector(DOM_SELECTORS.header);
    if (!header) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    header.style.transform = scrollTop > lastScrollTop
      ? "translateY(-100%)"
      : "translateY(0)";

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });
}

function initSmoothScroll() {
  document.querySelectorAll(DOM_SELECTORS.smoothScrollLinks).forEach(
    (anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    },
  );
}

function initModalSwiper() {
  const modal = document.getElementById("imageModal");
  const closeButton = document.querySelector(".modal .close-button");
  const modalSwiperContainer = document.querySelector(".modal-swiper");
  const swiperWrapper = modalSwiperContainer.querySelector(".swiper-wrapper");
  const captionText = document.getElementById("caption");

  let modalSwiper = null;

  function initializeModalSwiper(images, startIndex = 0) {
    if (modalSwiper !== null) {
      modalSwiper.destroy(true, true);
      modalSwiper = null;
    }

    swiperWrapper.innerHTML = "";
    images.forEach((imageData) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      const img = document.createElement("img");
      img.src = imageData.src;
      img.alt = imageData.alt;
      slide.appendChild(img);
      swiperWrapper.appendChild(slide);
    });

    modalSwiper = new Swiper(modalSwiperContainer, {
      loop: true,
      speed: 500,
      initialSlide: startIndex,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    modalSwiper.on("slideChange", function () {
      const currentSlide = modalSwiper.slides[modalSwiper.realIndex];
      const currentImage = currentSlide.querySelector("img");
      if (currentImage) {
        captionText.innerHTML = currentImage.alt;
      } else {
        captionText.innerHTML = "";
      }
    });

    const initialImage = modalSwiper.slides[modalSwiper.realIndex]
      .querySelector("img");
    if (initialImage) {
      captionText.innerHTML = initialImage.alt;
    } else {
      captionText.innerHTML = "";
    }

    // 画像が1枚以下の場合はナビゲーションを非表示 (SwiperのCSSでも可能)
    const navPrev = modalSwiperContainer.querySelector(".swiper-button-prev");
    const navNext = modalSwiperContainer.querySelector(".swiper-button-next");
    const pagination = modalSwiperContainer.querySelector(".swiper-pagination");
    if (images.length <= 1) {
      if (navPrev) navPrev.style.display = "none";
      if (navNext) navNext.style.display = "none";
      if (pagination) pagination.style.display = "none";
    } else {
      if (navPrev) navPrev.style.display = "";
      if (navNext) navNext.style.display = "";
      if (pagination) pagination.style.display = "";
    }
  }

  // モーダルを開く関数
  function openModal(images, startIndex = 0) {
    if (images.length === 0) return;
    initializeModalSwiper(images, startIndex);
    modal.style.display = "flex";
  }

  // モーダルを閉じる関数
  function closeModal() {
    modal.style.display = "none";
    if (modalSwiper !== null) {
      modalSwiper.destroy(true, true);
      modalSwiper = null;
    }
    swiperWrapper.innerHTML = "";
    captionText.innerHTML = "";
    // 非表示にしたナビゲーションやページネーションを戻す
    const navPrev = modalSwiperContainer.querySelector(".swiper-button-prev");
    const navNext = modalSwiperContainer.querySelector(".swiper-button-next");
    const pagination = modalSwiperContainer.querySelector(".swiper-pagination");
    if (navPrev) navPrev.style.display = "";
    if (navNext) navNext.style.display = "";
    if (pagination) pagination.style.display = "";
  }
  const featureCards = document.querySelectorAll(".feature-card-facility");

  featureCards.forEach((card) => {
    const mainImage = card.querySelector(".main-printer-image");
    const thumbnailSwiperContainer = card.querySelector(".thumbnail-swiper");
    const thumbnails = card.querySelectorAll(".thumbnail-image"); // サムネイル画像要素自体を取得
    const viewLargerText = card.querySelector(".view-larger-text"); // テキスト要素を取得

    const cardImages = [];
    thumbnails.forEach((thumbnail) => {
      cardImages.push({
        src: thumbnail.src,
        alt: thumbnail.alt,
      });
    });

    // サムネイル用Swiperを初期化（各カードに1つずつ）
    const thumbnailSwiper = new Swiper(thumbnailSwiperContainer, {
      slidesPerView: "auto", // スライドの数を固定せず、幅に応じて表示
      spaceBetween: 5, // スライド間の余白
      freeMode: true, // ドラッグで自由にスクロール（カルーセルというよりギャラリー表示に近く）
    });

    // --- サムネイル画像クリックでメイン画像を更新 ---
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", function () {
        mainImage.src = this.src;
        mainImage.alt = this.alt;
        // アクティブなサムネイルのスタイルを更新
        thumbnails.forEach((thumb) => thumb.classList.remove("active"));
        this.classList.add("active");

        // オプション: メイン画像が更新されたら、サムネイルカルーセルをその画像の位置に少しスクロールする
        thumbnailSwiper.slideTo(index, 300); // 300msかけてスライド
      });
    });

    // --- メイン画像クリックでモーダルを開く ---
    if (mainImage) {
      mainImage.addEventListener("click", function () {
        // 現在メイン画像に表示されている画像のsrcを取得
        const currentMainSrc = this.src;

        // この画像が cardImages の中で何番目かを見つける
        let startIndex = 0;
        for (let i = 0; i < cardImages.length; i++) {
          // 絶対パスと相対パスの違いを考慮してendsWithなどで比較するのが安全だが、
          // シンプルにsrcが一致するかで判定
          if (cardImages[i].src === currentMainSrc) {
            startIndex = i;
            break;
          }
          // より厳密な比較が必要な場合、パスの正規化などを検討
        }

        // 見つかった開始インデックスでモーダルを開く
        openModal(cardImages, startIndex);
      });
    }
    // --- 「大きい画像で見る」テキストクリックでモーダルを開く ---
    if (viewLargerText) {
      viewLargerText.addEventListener("click", function () {
        if (cardImages.length > 0) {
          openModal(cardImages, 0); // 常に最初の画像から開始
        }
      });

    }
  });

  // --- モーダル閉じるイベント ---
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // モーダル背景クリックで閉じる処理
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // ESCキーで閉じる処理
  document.addEventListener("keydown", function (event) {
    if (modal.style.display === "flex" && event.key === "Escape") {
      closeModal();
    }
  });
}
document.getElementById('current-year').textContent = new Date().getFullYear();