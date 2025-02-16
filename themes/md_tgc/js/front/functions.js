(function ($) {
  "use strict";
  window.isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
  window.windowHeight = window.innerHeight;
  window.windowWidth = window.innerWidth;

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.

  const MathUtils = {
    // map number x from range [a, b] to [c, d]
    map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
    // linear interpolation
    lerp: (a, b, n) => (1 - n) * a + n * b,
    // Random float
    getRandomFloat: (min, max) =>
      (Math.random() * (max - min) + min).toFixed(2),
  };

  if (history.scrollRestoration) {
    // history.scrollRestoration = 'manual';
    history.scrollRestoration = "auto";
  }

  const windowHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--window-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", windowHeight);
  windowHeight();

  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  const cancelAnimationFrame =
    window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function dataImageMobileUrl() {
    var update = function () {
      var ww = $(window).width();
      if (ww < 600) {
        $("[data-img-mb]").each(function () {
          var self = $(this),
            url = self.attr("data-img-mb");
          self.attr("src", url);
        });

        $("[data-bg-mb]").each(function () {
          var self = $(this),
            url = self.attr("data-bg-mb");
          self.css("background-image", "url(" + url + ")");
        });
      } else {
        $("[data-img-pc]").each(function () {
          var self = $(this),
            url = self.attr("data-img-pc");
          self.attr("src", url);
        });

        $("[data-bg-pc]").each(function () {
          var self = $(this),
            url = self.attr("data-bg-pc");
          self.css("background-image", "url(" + url + ")");
        });
      }
    };
    update();
    $(window).on("resize", debounce(update, 200));
  }

  function headerJs() {
    var header = $(".header");
    var meagamenu = $(".mobileMenu");

    var megamenuJs = function () {
      $(".mobileMenu__language .texts").on("click", function () {
        $(this).closest(".mobileMenu__language").toggleClass("active");
      });
    };

    var humnberger = function () {
      var tl = new TimelineMax({ paused: true });
      tl.to($(".header__humberger").find(".icon-1")[0], 0.3, {
        y: 8,
        transformOrigin: "center center",
      });
      tl.to(
        $(".header__humberger").find(".icon-3")[0],
        0.3,
        { y: -8, transformOrigin: "center center" },
        "-=.3"
      );
      tl.to($(".header__humberger").find(".icon-2")[0], 0.01, { autoAlpha: 0 });
      tl.to(
        $(".header__humberger").find(".icon-3")[0],
        0.01,
        { width: 23 },
        "-=0.01"
      );
      tl.to($(".header__humberger").find(".icon-1")[0], 0.3, { rotation: 45 });
      tl.to(
        $(".header__humberger").find(".icon-3")[0],
        0.3,
        { rotation: -45 },
        "-=.3"
      );

      $(".header__humberger").on("click", function () {
        var self = $(this);
        if (self.hasClass("active")) {
          tl.reverse();
          header.removeClass("header--showmenu");
          meagamenu.removeClass("megmenu--active");
          self.removeClass("active");
          $("body").removeClass("body-fix-scroll");
          TweenMax.to(meagamenu[0], 0.5, {
            x: "100%",
            onComplete: function () {
              TweenMax.set(meagamenu[0], { autoAlpha: 0 });
            },
          });
        } else {
          tl.play();
          $("body").addClass("body-fix-scroll");
          header.addClass("header--showmenu");
          meagamenu.addClass("megmenu--active");
          self.addClass("active");
          TweenMax.to(meagamenu[0], 0.5, {
            x: "0%",
            onStart: function () {
              TweenMax.set(meagamenu[0], { autoAlpha: 1 });
            },
          });
        }
      });
    };
    humnberger();

    $(window).on("load", function () {
      megamenuJs();
    });
  }

  function heroJs() {
    const wrap = $(".hero");

    if (wrap.length) {
      const getWidth = wrap.width();
      const getHeight = wrap.height();
      const setWdith = Math.floor((getHeight / 55.5) * 100);

      if (setWdith < getWidth && getHeight < getWidth) {
        $(".hero__video").css("width", getWidth + "px");
      } else {
        $(".hero__video").css("width", setWdith + "px");
      }
    }
  }

  function townshipIntro() {
    const ww = $(window).width();
    const wrap = $(".townshipIntro");
    if (wrap.length) {
      var bgDom = wrap.find(".townshipIntro__bgSlide");
      var thumdDom = wrap.find(".item-thumbnal");

      var swiperBg = new Swiper(bgDom[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 0,
        allowTouchMove: false,
        effect: "fade",
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
      });

      const firstLoad = bgDom.find(".swiper-slide-active").attr("data-index");
      thumdDom.find(`span[data-index="${firstLoad}"]`).addClass("current");

      swiperBg.on("slideChange", function (e) {
        e.$el.find(".swiper-slide-active").addClass("last-active");
      });

      swiperBg.on("slideNextTransitionStart", function (e) {
        var active = bgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
          { clipPath: "inset(0 0% 0 0)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              thumdDom.find("span").addClass("none-click");
            },
            onComplete: function () {
              bgDom.find(".swiper-slide").removeClass("last-active");
              thumdDom.find("span").removeClass("none-click");
            },
          }
        );
        thumdDom.find("span").removeClass("current");
        thumdDom
          .find(`span[data-index="${e.activeIndex}"]`)
          .addClass("current");
        // swiperThumb.slideTo(e.activeIndex);
      });
      swiperBg.on("slidePrevTransitionStart", function (e) {
        var active = bgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 0 0 100%)", scale: 1.2 },
          { clipPath: "inset(0 0 0 0%)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              thumdDom.find("span").addClass("none-click");
            },
            onComplete: function () {
              bgDom.find(".swiper-slide").removeClass("last-active");
              thumdDom.find("span").removeClass("none-click");
            },
          }
        );
        thumdDom.find("span").removeClass("current");
        thumdDom
          .find(`span[data-index="${e.activeIndex}"]`)
          .addClass("current");
        // swiperThumb.slideTo(e.activeIndex-1);
      });

      thumdDom.find("span").on("click", function () {
        const getIndex = $(this).attr("data-index");
        swiperBg.slideTo(getIndex);
      });
    }
  }

  let partnerSwiper;
  function partnerSlide() {
    const wraps = $(".partnerSlide");
    if (wraps.length) {
      const slideBig = () => {
        wraps.each((index, wrapEl) => {
          var wrap = $(wrapEl);
          partnerSwiper = new Swiper(wrap[0], {
            // loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 0,
            effect: "fade",
            allowTouchMove: false,
            navigation: {
              prevEl: wrap.find(".slide-buttonCustomB-prev")[0],
              nextEl: wrap.find(".slide-buttonCustomB-next")[0],
            },
            // autoplay: {
            //     delay: 9000,
            //     disableOnInteraction: false,
            // }
          });

          partnerSwiper.autoplay.stop();

          partnerSwiper.on("slideChange", function (e) {
            e.$el
              .find(".swiper-slide-cha.swiper-slide-active")
              .addClass("last-active");
          });

          wrap.find(".slide-buttonCustomB-prev").addClass("fix");

          partnerSwiper.on("slideChangeTransitionStart", function (e) {
            var active = wrap.find(".swiper-slide-cha.swiper-slide-active");
            TweenMax.fromTo(
              active[0],
              0.7,
              { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
              { clipPath: "inset(0 0% 0 0)", scale: 1 }
            );
            TweenMax.fromTo(
              active.find(".bg")[0],
              0.7,
              { scale: 1.2 },
              {
                scale: 1,
                onStart: function () {
                  wrap.find(".slide-buttonCustomB").addClass("none-click");
                  wrap.find(".slide-buttonCustomMb").addClass("none-click");
                  wrap.find(".slide-buttonCustomB-next").removeClass("fix");
                  wrap.find(".slide-buttonCustomB-prev").removeClass("fix");
                },
                onComplete: function () {
                  wrap.find(".swiper-slide-cha").removeClass("last-active");
                  wrap.find(".slide-buttonCustomB").removeClass("none-click");
                  wrap.find(".slide-buttonCustomMb").removeClass("none-click");

                  if (e.activeIndex === 2) {
                    wrap.find(".slide-buttonCustomB-next").addClass("fix");
                  }

                  if (e.activeIndex === 0) {
                    wrap.find(".slide-buttonCustomB-prev").addClass("fix");
                  }
                },
              }
            );
          });

          wrap.find(".slide-buttonCustomB-next").on("click", function () {
            const self = $(this);
            setTimeout(function () {
              if (self.hasClass("fix")) {
                partnerSwiper.slideTo(0);
              }
            }, 100);
          });

          wrap.find(".slide-buttonCustomB-prev").on("click", function () {
            const self = $(this);
            setTimeout(function () {
              if (self.hasClass("fix")) {
                partnerSwiper.slideTo(2);
              }
            }, 100);
          });

          wrap.find(".slide-buttonCustomMb-next").on("click", function () {
            wrap.find(".slide-buttonCustomB-next").trigger("click");
          });

          wrap.find(".slide-buttonCustomMb-prev").on("click", function () {
            wrap.find(".slide-buttonCustomB-prev").trigger("click");
          });
          const slides = partnerSwiper.slides.length;
          const prevButton = wrap.find(".slide-buttonCustomB-prev")[0];
          const nextButton = wrap.find(".slide-buttonCustomB-next")[0];

          if (slides <= 1) {
            // Hide the navigation buttons if there is 1 or fewer slides
            prevButton.style.display = "none";
            nextButton.style.display = "none";
          } else {
            // Show the navigation buttons if there are multiple slides
            prevButton.style.display = "flex";
            nextButton.style.display = "flex";
          }
        });
      };
      slideBig();

      const thumbnal = () => {
        const smallSlides = $(".partnerSlide-thumbnal");
        if (smallSlides.length) {
          smallSlides.each((index, smallSlideEl) => {
            var smallSlide = $(smallSlideEl);
            var slide = smallSlide.find(".swiper");
            var swiper = new Swiper(slide[0], {
              slidesPerView: 3,
              spaceBetween: 8,
              speed: 700,
              navigation: {
                prevEl: smallSlide.find(".slide-buttonCustom-prev")[0],
                nextEl: smallSlide.find(".slide-buttonCustom-next")[0],
              },
              breakpoints: {
                768: {
                  spaceBetween: 10,
                  slidesPerView: 4,
                },
                991: {
                  spaceBetween: 10,
                  slidesPerView: 4,
                },
                1260: {
                  spaceBetween: 10,
                  slidesPerView: 4,
                },
                1700: {
                  spaceBetween: 10,
                  slidesPerView: 4,
                },
              },
            });
          });
        }
      };
      thumbnal();
    }
  }

  let exuberanceSwiper;
  let exuberanceI = 0;
  let exuberanceFix = false;
  function exuberanceInfo() {
    const wrap = $(".exuberanceInfo-left .swiper");
    const ww = $(window).width();

    if (wrap.length) {
      const setDelay = 30000;
      const setRender = (index) => {
        wrap
          .closest(".exuberanceInfo-left")
          .find(".slide-bg-left .bg")
          .removeClass("active");
        wrap
          .closest(".exuberanceInfo")
          .find(".swiper-pagination li")
          .removeClass("active");
        wrap
          .closest(".exuberanceInfo-left")
          .find('.slide-bg-left .bg[data-index="' + index + '"]')
          .addClass("active");
        wrap
          .closest(".exuberanceInfo")
          .find('.swiper-pagination li[data-index="' + index + '"]')
          .addClass("active");
        wrap
          .closest(".exuberanceInfo")
          .find(".swiper-pagination li span")
          .css("--delay", setDelay + "ms");
      };

      exuberanceSwiper = new Swiper(wrap[0], {
        // loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 700,
        navigation: {
          prevEl: wrap.find(".slide-buttonCustomB-prev")[0],
          nextEl: wrap.find(".slide-buttonCustomB-next")[0],
        },
        autoplay: {
          // delay: setDelay,
          // disableOnInteraction: false
        },
      });
      exuberanceSwiper.autoplay.stop();

      const getActive = wrap.find(".swiper-slide-active").attr("data-index");
      setRender(getActive);

      exuberanceSwiper.on("slideChangeTransitionStart", function () {
        var getActive = wrap.find(".swiper-slide-active").attr("data-index");
        setRender(getActive);

        if (Number(getActive) === 1) {
          $(".exuberanceInfo").addClass("hide-fix");
          exuberanceFix = false;
        } else {
          $(".exuberanceInfo").removeClass("hide-fix");
          exuberanceFix = true;
          exuberanceI = 0;
        }
      });
      $(".exuberanceInfo .swiper-pagination li").on("click", function () {
        if (!$(this).hasClass(".active")) {
          const getIndex = $(this).attr("data-index");
          exuberanceSwiper.slideTo(getIndex);
        }
      });

      if (ww > 1259) {
        const scrollFix = function () {
          const wrap = $(".exuberanceInfo-right");
          const inner = wrap.find(".item-scroll__inner");
          const itemAll = wrap.find(".item-box");
          const getFirst = itemAll.first();
          const getFirstNext = getFirst.next();
          // inner.append(getFirst.clone().addClass('clone-1')).append(getFirstNext.clone().addClass('clone-2'));

          const groupTop = Math.floor(
            wrap.find(".item-group").offset().top - wrap.offset().top
          );

          let firstRun;
          let getScrollTop = 0;
          let first = 0;
          let firstFix = false;

          $(".exuberanceInfo-right .item-scroll").on("scroll", function () {
            getScrollTop = $(this).scrollTop();
            const getHeight = Math.floor(
              inner.height() - wrap.find(".item-scroll").height()
            );

            // console.log(inner.height() - wrap.find('.item-scroll').height());
            // const getClone1 = inner.find('.item-box.clone-1');
            // const getTop = getClone1[0].getBoundingClientRect().top;
            // if( getTop <=  groupTop ) {
            //     $('.exuberanceInfo-right .item-scroll').scrollTop(0);
            //     i = groupTop;
            // }
            if (getScrollTop >= getHeight) {
              if (firstFix == false) {
                setTimeout(function () {
                  $.fn.fullpage.moveSectionDown();
                }, 500);
              }
              firstFix = true;
            } else {
              firstFix = false;
            }

            // console.log(getScrollTop);
          });

          function step() {
            if (exuberanceFix == true) {
              exuberanceI++;
              $(".exuberanceInfo-right .item-scroll").scrollTop(
                exuberanceI / 1.5
              );
              const getHeight = Math.floor(
                inner.height() - wrap.find(".item-scroll").height()
              );
            }
            firstRun = requestAnimationFrame(step);
          }
          firstRun = requestAnimationFrame(step);
          let checkHover = false;
          wrap.find(".item-group").on("mouseenter", function () {
            if (checkHover === false) {
              cancelAnimationFrame(firstRun);
              checkHover = true;
            }
          });

          wrap.find(".item-group").on("mouseleave", function () {
            if (checkHover === true) {
              firstRun = requestAnimationFrame(step);
              checkHover = false;
              exuberanceI = getScrollTop * 1.5;
            }
          });
        };
        scrollFix();
      }

      if (ww < 1260) {
        const getHtml = $(".exuberanceInfo-right")[0].outerHTML;
        const renderHtml = `
                    <div class="exuberanceInfo-popup">
                        <span class="item-close"><i class="icon-close"></i></span>
                        ${getHtml}
                    </div>
                `;
        $("body").append(renderHtml);

        $(".exuberanceInfo-right .item-box").on("click", function () {
          const getIndex = $(this).index();
          const getWidth =
            $(
              ".exuberanceInfo-popup .exuberanceInfo-right .item-box"
            ).outerWidth() + 12;
          $(
            ".exuberanceInfo-popup .exuberanceInfo-right .item-scroll"
          ).scrollLeft(getWidth * getIndex);
          TweenMax.to(".exuberanceInfo-popup", 0.2, {
            scale: 1,
            onStart: function () {
              TweenMax.set(".exuberanceInfo-popup", { autoAlpha: 1 });
              $(".page-content").addClass("exube-active");
            },
          });
        });

        $(".exuberanceInfo-popup .item-close").on("click", function () {
          TweenMax.to(".exuberanceInfo-popup", 0.2, {
            scale: 0,
            onComplete: function () {
              TweenMax.set(".exuberanceInfo-popup", { autoAlpha: 0 });
              $(".page-content").removeClass("exube-active");
            },
          });
        });
      }
    }
  }

  let zoomInfoBg;

  function zoneInfo() {
    const ww = $(window).width();
    const wrap = $(".zoneInfo");
    if (wrap.length) {
      const bgDom = wrap.find(".zoneInfo__slideImg .swiper");
      const thumbDom = wrap.find(".zoneInfo__slideThumb .swiper");

      zoomInfoBg = new Swiper(bgDom[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 0,
        allowTouchMove: false,
        effect: "fade",
        autoplay: {
          delay: 7000,
          disableOnInteraction: false,
        },
      });

      zoomInfoBg.autoplay.stop();

      zoomInfoBg.on("slideChange", function (e) {
        e.$el.find(".swiper-slide-active").addClass("last-active");
      });

      const firstLoad = bgDom.find(".swiper-slide-active").attr("data-index");
      thumbDom
        .find(`.swiper-slide[data-index="${firstLoad}"]`)
        .addClass("current");

      const swiperThumb = new Swiper(thumbDom[0], {
        slidesPerView: 4,
        spaceBetween: 6,
        speed: 700,
        breakpoints: {
          768: {
            spaceBetween: 6,
            slidesPerView: 6,
          },
          991: {
            spaceBetween: 6,
            slidesPerView: 6,
          },
          1260: {
            spaceBetween: 6,
            slidesPerView: 6,
          },
          1700: {
            spaceBetween: 8,
            slidesPerView: 6,
          },
        },
        on: {
          init: function (e) {
            const getIndex = e.activeIndex;
            zoomInfoBg.slideTo(getIndex);
            thumbDom
              .find(`.swiper-slide[data-index="${getIndex}"]`)
              .addClass("current");
          },
        },
      });

      zoomInfoBg.on("slideNextTransitionStart", function (e) {
        const active = bgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
          { clipPath: "inset(0 0% 0 0)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              thumbDom.find(".swiper-slide").addClass("none-click");
            },
            onComplete: function () {
              bgDom.find(".swiper-slide").removeClass("last-active");
              thumbDom.find(".swiper-slide").removeClass("none-click");
            },
          }
        );
        thumbDom.find(".swiper-slide").removeClass("current");
        thumbDom
          .find(`.swiper-slide[data-index="${e.activeIndex}"]`)
          .addClass("current");
        swiperThumb.slideTo(e.activeIndex);
      });
      zoomInfoBg.on("slidePrevTransitionStart", function (e) {
        const active = bgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 0 0 100%)", scale: 1.2 },
          { clipPath: "inset(0 0 0 0%)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              thumbDom.find(".swiper-slide").addClass("none-click");
            },
            onComplete: function () {
              bgDom.find(".swiper-slide").removeClass("last-active");
              thumbDom.find(".swiper-slide").removeClass("none-click");
            },
          }
        );
        thumbDom.find(".swiper-slide").removeClass("current");
        thumbDom
          .find(`.swiper-slide[data-index="${e.activeIndex}"]`)
          .addClass("current");
        swiperThumb.slideTo(e.activeIndex - 1);
      });

      thumbDom.find(".swiper-slide").on("click", function () {
        const getIndex = $(this).attr("data-index");
        thumbDom.find(".swiper-slide").removeClass("current");
        $(this).addClass("current");
        zoomInfoBg.slideTo(getIndex);
        // swiperThumb.slideTo(getIndex);
      });

      if (ww > 767 && ww < 1260) {
        const getHtml = $(".zoneInfo__list").html();
        $(".zoneInfo__tablet").html(getHtml);
      }
    }
  }

  let facilitieInfoBG;
  function facilitieInfo() {
    const wrap = $(".facilitieInfo");
    if (wrap.length) {
      const slideBgDom = wrap.find(".facilitieInfo__bgSlide");
      const slideImgDom = wrap.find(".facilitieInfo__content .swiper");

      facilitieInfoBG = new Swiper(slideBgDom[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 0,
        allowTouchMove: false,
        effect: "fade",
        autoplay: {
          delay: 7000,
          disableOnInteraction: false,
        },
      });

      facilitieInfoBG.autoplay.stop();

      const swiperImg = new Swiper(slideImgDom[0], {
        slidesPerView: "auto",
        spaceBetween: 8,
        speed: 700,
        breakpoints: {
          768: {
            spaceBetween: 12,
            slidesPerView: "auto",
          },
          991: {
            spaceBetween: 12,
            slidesPerView: "auto",
          },
          1260: {
            spaceBetween: 12,
            slidesPerView: 5,
          },
          1700: {
            spaceBetween: 12,
            slidesPerView: 6,
          },
        },
      });

      facilitieInfoBG.on("slideChange", function (e) {
        e.$el.find(".swiper-slide-active").addClass("last-active");
      });

      const firstLoad = slideBgDom
        .find(".swiper-slide-active")
        .attr("data-index");
      slideImgDom
        .find(`.swiper-slide[data-index="${firstLoad}"]`)
        .addClass("current");

      facilitieInfoBG.on("slideNextTransitionStart", function (e) {
        const active = slideBgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
          { clipPath: "inset(0 0% 0 0)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              slideImgDom.find(".swiper-slide").addClass("none-click");
            },
            onComplete: function () {
              slideBgDom.find(".swiper-slide").removeClass("last-active");
              slideImgDom.find(".swiper-slide").removeClass("none-click");
            },
          }
        );
        slideImgDom.find(".swiper-slide").removeClass("current");
        slideImgDom
          .find(`.swiper-slide[data-index="${e.activeIndex}"]`)
          .addClass("current");
        swiperImg.slideTo(e.activeIndex);
      });
      facilitieInfoBG.on("slidePrevTransitionStart", function (e) {
        const active = slideBgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 0 0 100%)", scale: 1.2 },
          { clipPath: "inset(0 0 0 0%)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              slideImgDom.find(".swiper-slide").addClass("none-click");
            },
            onComplete: function () {
              slideBgDom.find(".swiper-slide").removeClass("last-active");
              slideImgDom.find(".swiper-slide").removeClass("none-click");
            },
          }
        );
        slideImgDom.find(".swiper-slide").removeClass("current");
        slideImgDom
          .find(`.swiper-slide[data-index="${e.activeIndex}"]`)
          .addClass("current");
        swiperImg.slideTo(e.activeIndex - 1);
      });

      slideImgDom.find(".swiper-slide").on("click", function () {
        const getIndex = $(this).attr("data-index");
        slideImgDom.find(".swiper-slide").removeClass("current");
        $(this).addClass("current");
        facilitieInfoBG.slideTo(getIndex);
      });
    }
  }

  function aboutInfo() {
    const wrap = $(".aboutInfo");
    if (wrap.length) {
      const slideDom = wrap.find(".swiper");
      var swiper = new Swiper(slideDom[0], {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 5,
        speed: 5000,
        freeMode: true,
        allowTouchMove: false,
        breakpoints: {
          768: {
            spaceBetween: 0,
            slidesPerView: 3,
          },
          991: {
            spaceBetween: 0,
            slidesPerView: 3,
          },
          1260: {
            spaceBetween: 0,
            slidesPerView: 4,
          },
          1700: {
            spaceBetween: 0,
            slidesPerView: 4,
          },
        },
        autoplay: {
          delay: 1,
          disableOnInteraction: false,
        },
        navigation: {
          prevEl: slideDom.find(".buttonCustom-prev")[0],
          nextEl: slideDom.find(".buttonCustom-next")[0],
        },
      });
    }
  }

  function contactEffectBtn() {
    const btn = $(".contact-form .button-submit");
    const ww = $(window).width();
    let timeout = setTimeout(function () {
      $(".alert-success").removeClass("show");
    }, 10000);

    if (ww < 1260) {
      var i = 1;
      const wrap = $(".formContact__content");

      const fix = function (i) {
        if (i === 1) {
          wrap.find(".btn-up").removeClass("active");
          wrap.find(".btn-down").addClass("active");
          wrap.find(".item-footer").removeClass("active");
        }

        if (i === 2) {
          wrap.find(".btn-up").addClass("active");
          wrap.find(".btn-down").addClass("active");
          wrap.find(".item-footer").removeClass("active");
        }
        if (i === 3) {
          wrap.find(".btn-down").removeClass("active");
          wrap.find(".item-footer").addClass("active");
        }
      };

      wrap.find(".btn-up").on("click", function () {
        if (i > 1) {
          i--;
          fix(i);
          wrap.find(`.itembox[data-index="${i + 1}"]`).removeClass("active");
        }
      });

      wrap.find(".btn-down").on("click", function () {
        if (i < 3) {
          i++;
          fix(i);
          wrap.find(`.itembox[data-index="${i}"]`).addClass("active");
        }
        $.fn.fullpage.setAllowScrolling(false);
      });

      if (
        device.mobile() ||
        (device.orientation === "landscape" && device.tablet())
      ) {
        $(".formContact__content").swipeup(function () {
          $(this).find(".btn-down").trigger("click");
        });

        $(".formContact__content").swipedown(function () {
          $(this).find(".btn-up").trigger("click");
          setTimeout(function () {
            if (
              !$(".formContact__content .item-right .itembox-2").hasClass(
                "active"
              ) &&
              !$(".formContact__content .item-right .itembox-3").hasClass(
                "active"
              )
            ) {
              $.fn.fullpage.setAllowScrolling(true);
            }
          }, 300);
        });
      }
    }

    if (ww > 767 && ww < 1259) {
      const slideDom = $(".formContact__content .item-ipad .swiper");
      const slide = new Swiper(slideDom[0], {
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 700,
        navigation: {
          prevEl: slideDom.find(".buttonCustom-prev")[0],
          nextEl: slideDom.find(".buttonCustom-next")[0],
        },
      });
    }

    const updateText = function (event) {
      var input = $(this);
      setTimeout(function () {
        var val = input.val();
        if (val != "") input.parent().addClass("floating-placeholder-float");
        else input.parent().removeClass("floating-placeholder-float");
      }, 1);
    };
    $(".js-form-item input").keydown(updateText);
    $(".js-form-item input").change(updateText);

    const traking = function () {
      $(".contact-form").submit(function (e) {
        e.preventDefault();
        $(this).find('button[name="submit"]').prop("disabled", true);

        var v = grecaptcha.getResponse();
        if (v.length == 0) {
          document.getElementById("captcha").innerHTML =
            "You can't leave Captcha Code empty";
          return false;
        }

        let messageArr = [];
        if ($('[name="register-info"]:checked').length) {
          messageArr.push("Ă„ÂĂ„Æ’ng kÄ‚Â½ nhĂ¡ÂºÂ­n thÄ‚Â´ng tin");
        }
        if ($('[name="register-visit"]:checked').length) {
          messageArr.push("Ă„ÂĂ„Æ’ng kÄ‚Â½ nhĂ¡ÂºÂ­n thÄ‚Â´ng tin");
        }
        var trackingData = {
          name: $(this).find('[name="name"]').val(),
          phone: $(this).find('[name="phone"]').val(),
          project: 17,
          email: $(this).find('[name="email"]').val(),
          title: "Ă„ÂĂ„â€NG KÄ‚Â NHĂ¡ÂºÂ¬N THÄ‚â€NG TIN",
          message: messageArr.join(","),
          site_id: 17,
        };

        masTracking(trackingData)
          .then((rs) => {
            console.log(rs);
          })
          .catch((err) => {
            console.log("error", err);
          })
          .finally(() => {});

        const tl = new TimelineMax();
        const base_url = jQuery("body").data("base-path");
        const lang = jQuery("html").attr("lang");
        clearTimeout(timeout);
        tl.to(btn.find(".text-2")[0], 1, {
          display: "block",
          onStart: function () {
            TweenMax.set(btn.find(".text-1")[0], { display: "none" });
          },
          onComplete: function () {
            // $('.popup__thankYou').addClass('show');
            // timeout = setTimeout(function() {
            //     $('.alert-success').removeClass('show');
            // }, 10000);

            window.location.href = base_url + "/" + lang + "/node/21";
          },
        });
        tl.to(btn.find(".text-1")[0], {
          display: "block",
          onStart: function () {
            TweenMax.set(btn.find(".text-2")[0], { display: "none" });
          },
        });

        // if($('.menu.trim li.active a').attr('href')=='index.html'){

        //     window.location.replace("https://masterisehomes.com/the-global-city/thankyou.html");
        //  //$(this).replaceWith('<div class="alert alert-success"><b>TRÄ‚â€N TRĂ¡Â»Å’NG CĂ¡ÂºÂ¢M Ă† N!</b> <br><br>CĂ¡ÂºÂ£m Ă†Â¡n QuÄ‚Â½ khÄ‚Â¡ch Ă„â€˜Ä‚Â£ Ă„â€˜Ă„Æ’ng kÄ‚Â½ nhĂ¡ÂºÂ­n thÄ‚Â´ng tin dĂ¡Â»Â± Ä‚Â¡n. <br>ChÄ‚Âºng tÄ‚Â´i sĂ¡ÂºÂ½ liÄ‚Âªn hĂ¡Â»â€¡ QuÄ‚Â½ khÄ‚Â¡ch trong thĂ¡Â»Âi gian sĂ¡Â»â€ºm nhĂ¡ÂºÂ¥t.</div');
        // }else{
        //     window.location.replace("https://masterisehomes.com/the-global-city/thankyou_en.html");
        //         //$(this).replaceWith('<div class="alert alert-success"><b>THANK YOU!</b> <br>Thank you for your registration. We will contact you shortly.</div>');

        // }
      });
    };

    traking();
  }

  function alertJs() {
    $(".alert-close").on("click", function () {
      $(this).closest(".alert").removeClass("show");
    });
  }

  function menuSidebarJs() {
    $(".mobile-show-sidebar").on("click", function () {
      if ($(".menu-sidebar").hasClass("showed")) {
        TweenMax.to(".menu-sidebar__wrap", 0.3, {
          y: "100%",
          onComplete: function () {
            TweenMax.set(".menu-sidebar__wrap", { autoAlpha: 0 });
          },
        });
        $(".menu-sidebar").removeClass("showed");
      } else {
        TweenMax.to(".menu-sidebar__wrap", 0.3, {
          y: "0%",
          onStart: function () {
            TweenMax.set(".menu-sidebar__wrap", { autoAlpha: 1 });
          },
        });
        $(".menu-sidebar").addClass("showed");
      }
    });

    $(".menu-sidebar__show").on("click", function () {
      TweenMax.to(".menu-sidebar__menu", 0.3, {
        x: "0%",
        onStart: function () {
          TweenMax.set(".menu-sidebar__menu", { autoAlpha: 1 });
        },
      });
      $(".menu-sidebar").addClass("showed");
    });

    $(".menu-sidebar__hide").on("click", function () {
      TweenMax.to(".menu-sidebar__menu", 0.3, {
        x: "100%",
        onComplete: function () {
          TweenMax.set(".menu-sidebar__menu", { autoAlpha: 0 });
        },
      });
      $(".menu-sidebar").removeClass("showed");
    });

    $(window).width();

    $(".menu-sidebar__menu li a").on("click", function () {
      if ($(window).width() < 1260) {
        setTimeout(function () {
          $(".mobile-show-sidebar").trigger("click");
        }, 700);
      }
    });
  }

  function readMoreClick() {
    $("[data-readMore]").on("click", function (e) {
      e.preventDefault();
      const getCha = $(this).attr("data-readMore");
      const getTitle =
        $(this).closest(getCha).find("[readMore-title]").text() || "";
      const getText =
        $(this).closest(getCha).find("[readMore-text]").html() || "";
      $(".readMore-popup__title").text(getTitle);
      $(".readMore-popup__text").html(getText);

      TweenMax.to(".readMore-popup", 0.3, {
        y: "0%",
        onStart: function () {
          TweenMax.set(".readMore-popup", { autoAlpha: 1 });
        },
      });
    });
    $(".readMore-popup__close").on("click", function () {
      var getWrap = $(this).closest(".readMore-popup");
      TweenMax.to(getWrap[0], 0.3, {
        y: "100%",
        onComplete: function () {
          TweenMax.set(getWrap[0], { autoAlpha: 0 });
          $(".readMore-popup").removeClass("location-css");
        },
      });
    });

    $(".readMore-popup__bg").on("click", function () {
      $(this).parent().find(".readMore-popup__close").trigger("click");
    });
  }

  function photoGalleryJs() {
    const wrap = $(".photoGallery");
    const ww = $(window).width();
    if (wrap.length) {
      const slideImgDom1 = wrap.find(".photoGallery__imgSlide .swiper-1");
      const slideBgDom1 = wrap.find(".photoGallery__slideBg .swiper-1");
      const slideTextDom1 = wrap.find(".photoGallery__textSlide .swiper-1");

      const slideImgDom2 = wrap.find(".photoGallery__imgSlide .swiper-2");
      const slideBgDom2 = wrap.find(".photoGallery__slideBg .swiper-2");
      const slideTextDom2 = wrap.find(".photoGallery__textSlide .swiper-2");

      if (slideImgDom1.length && slideBgDom1.length && slideTextDom1.length) {
        const slideImg1 = new Swiper(slideImgDom1[0], {
          slidesPerView: 1,
          spaceBetween: 8,
          speed: 700,
          breakpoints: {
            768: {
              spaceBetween: 10,
              slidesPerView: "auto",
            },
            991: {
              spaceBetween: 10,
              slidesPerView: "auto",
            },
            1260: {
              spaceBetween: 10,
              slidesPerView: 4,
            },
            1700: {
              spaceBetween: 14,
              slidesPerView: 6,
            },
          },
          navigation: {
            prevEl: slideImgDom1.find(".buttonCustom-prev")[0],
            nextEl: slideImgDom1.find(".buttonCustom-next")[0],
          },
        });

        slideImgDom1.find(".swiper-slide-active").addClass("current");
        slideTextDom1
          .find(".swiper-wrapper .swiper-slide:eq(0)")
          .addClass("swiper-slide-active");

        const slideBg1 = new Swiper(slideBgDom1[0], {
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 700,
        });

        // const slideText1 = new Swiper(slideTextDom1[0], {
        // slidesPerView: 1,
        // spaceBetween: 0,
        // allowTouchMove: false,
        // speed: 500,
        // effect: 'fade',
        // });

        if (ww > 767) {
          slideImgDom1.find(".swiper-slide").on("click", function () {
            const getIndex = $(this).attr("data-index");
            slideImgDom1.find(".swiper-slide").removeClass("current");
            slideTextDom1
              .find(".swiper-slide")
              .removeClass("swiper-slide-active");
            $(this).addClass("current");
            slideBg1.slideTo(getIndex);
            slideImg1.slideTo(getIndex);
            slideTextDom1
              .find(".swiper-wrapper .swiper-slide:eq(" + getIndex + ")")
              .addClass("swiper-slide-active");
            // slideText1.slideTo(getIndex);
          });
        } else {
          slideImg1.on("slideChange", function (e) {
            // slideText1.slideTo(e.activeIndex);
            slideBg1.slideTo(e.activeIndex);
            slideTextDom1
              .find(".swiper-slide")
              .removeClass("swiper-slide-active");
            slideTextDom1
              .find(".swiper-wrapper .swiper-slide:eq(" + e.activeIndex + ")")
              .addClass("swiper-slide-active");
          });
        }
      }

      if (slideImgDom2.length && slideBgDom2.length && slideTextDom2.length) {
        const slideImg2 = new Swiper(slideImgDom2[0], {
          slidesPerView: 1,
          spaceBetween: 8,
          speed: 700,
          // effect: 'fade',
          breakpoints: {
            768: {
              spaceBetween: 10,
              slidesPerView: "auto",
            },
            991: {
              spaceBetween: 10,
              slidesPerView: "auto",
            },
            1260: {
              spaceBetween: 10,
              slidesPerView: 4,
            },
            1700: {
              spaceBetween: 14,
              slidesPerView: 6,
            },
          },
          navigation: {
            prevEl: slideImgDom2.find(".buttonCustom-prev")[0],
            nextEl: slideImgDom2.find(".buttonCustom-next")[0],
          },
        });

        slideImgDom2.find(".swiper-slide-active").addClass("current");
        slideTextDom2
          .find(".swiper-wrapper .swiper-slide:eq(0)")
          .addClass("swiper-slide-active");

        const slideBg2 = new Swiper(slideBgDom2[0], {
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 700,
        });

        // const slideText2 = new Swiper(slideTextDom2[0], {
        // slidesPerView: 1,
        // spaceBetween: 0,
        // allowTouchMove: false,
        // speed: 500,
        // effect: 'fade',
        // });

        if (ww > 767) {
          slideImgDom2.find(".swiper-slide").on("click", function () {
            const getIndex = $(this).attr("data-index");
            slideImgDom2.find(".swiper-slide").removeClass("current");
            slideTextDom2
              .find(".swiper-slide")
              .removeClass("swiper-slide-active");
            $(this).addClass("current");
            slideBg2.slideTo(getIndex);
            slideImg2.slideTo(getIndex);
            slideTextDom2
              .find(".swiper-wrapper .swiper-slide:eq(" + getIndex + ")")
              .addClass("swiper-slide-active");
            // slideText2.slideTo(getIndex);
          });
        } else {
          slideImg2.on("slideChange", function (e) {
            slideBg2.slideTo(e.activeIndex);
            slideTextDom2
              .find(".swiper-slide")
              .removeClass("swiper-slide-active");
            slideTextDom2
              .find(".swiper-wrapper .swiper-slide:eq(" + e.activeIndex + ")")
              .addClass("swiper-slide-active");
          });
        }
      }

      wrap.find(".tab-menu-js a").on("click", function (e) {
        e.preventDefault();
        const self = $(this);
        if (!self.hasClass("active")) {
          const getId = self.attr("href").replace("#", "");
          wrap.find(".tab-menu-js a").removeClass("active");
          self.addClass("active");
          $(".photoGallery__content .panel").removeClass("active");
          $('.photoGallery__content .panel[data-id="' + getId + '"]').addClass(
            "active"
          );
          $(".photoGallery__slideBg .swiper").removeClass("active");
          $('.photoGallery__slideBg .swiper[data-id="' + getId + '"]').addClass(
            "active"
          );
        }
      });
    }
  }

  function videoGalleryJs() {
    const wrap = $(".videoGallery");
    const ww = $(window).width();
    if (wrap.length) {
      const videoThumb = wrap.find(".videoGallery__videoThumb");
      const body = wrap.find(".videoGallery__left");

      let player;
      const playVideo = function () {
        setTimeout(function () {
          var getId = wrap.find(".videoGallery__video").attr("id-video");
          player = new YT.Player("videoGallery-video", {
            videoId: getId,
            events: {
              onReady: onPlayerReady,
              // onStateChange: onPlayerStateChange
            },
          });

          function onPlayerReady(event) {
            var iframeObject = event.target;
            var _parent = $(iframeObject.i).parent();
            _parent.addClass("done");
          }

          $(".videopreview")
            .find(".btn-play")
            .on("click", function () {
              player.playVideo();
              $(".videopreview").addClass("show-video");
            });
        }, 100);
      };

      const html = function (item) {
        const getIDVideo = item.attr("video-id");
        const getTitle = item.attr("data-title");
        const getLink = item.attr("data-link");
        const getImg = item.find("img").attr("src");
        body.find(".videoGallery__title").text(getTitle);
        body.find(".videoGallery__btn a").attr("href", getLink);
        wrap.find(".videoGallery__video").attr("id-video", getIDVideo);
        playVideo();
      };

      $(window).on("load", function () {
        const getFirst = videoThumb.find(".item").first();
        getFirst.addClass("current");
        html(getFirst);

        videoThumb.find(".item").on("click", function () {
          const self = $(this);
          if (!self.hasClass("current")) {
            videoThumb.find(".item").removeClass("current");
            player.destroy();
            player = null;
            self.addClass("current");
            html(self);
            setTimeout(function () {
              player.playVideo();
            }, 1000);
          }
        });
      });

      $(".videoGallery__list .title-sub span").on("click", function () {
        $(".videoGallery__body").toggleClass("active");
        $(".videoGallery__video").toggleClass("none-click");
      });
    }
  }

  function blogListSlide() {
    const wrap = $(".blogList");
    const ww = $(window).width();
    if (wrap.length) {
      const slideImgDom = wrap.find(".blogList__slide .swiper");

      let _setRow = 2;

      if (ww < 1260) {
        if (device.tablet() && device.orientation === "landscape") {
          _setRow = 1;
        }
      }

      const slideImg = new Swiper(slideImgDom[0], {
        slidesPerView: "auto",
        spaceBetween: 8,
        speed: 700,
        breakpoints: {
          768: {
            spaceBetween: 12,
            slidesPerView: 2,
            grid: {
              rows: 2,
            },
          },
          991: {
            spaceBetween: 20,
            slidesPerView: 2,
            grid: {
              rows: _setRow,
            },
          },
          1260: {},
          1700: {
            spaceBetween: 20,
          },
        },
        navigation: {
          prevEl: slideImgDom.find(".buttonCustom-prev")[0],
          nextEl: slideImgDom.find(".buttonCustom-next")[0],
        },
      });
    }
  }

  function construcInfoSlideJs() {
    const wrap = $(".construcInfo");
    const ww = $(window).width();

    if (wrap.length) {
      const slideLeftDom = wrap.find(".construcInfo__left .swiper");
      const slideRightDom = wrap.find(".construcInfo__video .swiper");
      let _directionSet = "horizontal";
      let _slidesPerViewSet = "auto";
      let _spaceBetweenSet = 10;
      let _allowTouchMove = true;

      if (ww < 1260) {
        if (device.tablet() && device.orientation === "landscape") {
          _directionSet = "vertical";
          _slidesPerViewSet = 4;
          _spaceBetweenSet = 0;
          _allowTouchMove = false;
        }
      }

      const slideLeft = new Swiper(slideLeftDom[0], {
        slidesPerView: _slidesPerViewSet,
        spaceBetween: _spaceBetweenSet,
        speed: 700,
        direction: _directionSet,
        allowTouchMove: _allowTouchMove,
        breakpoints: {
          768: {},
          1260: {
            spaceBetween: 0,
            slidesPerView: 4,
            direction: "vertical",
            allowTouchMove: false,
          },
          1700: {
            spaceBetween: 0,
            slidesPerView: 5,
            direction: "vertical",
            allowTouchMove: false,
          },
        },
        navigation: {
          prevEl: slideLeftDom.find(".buttonCustom-prev")[0],
          nextEl: slideLeftDom.find(".buttonCustom-next")[0],
        },
      });

      slideLeftDom.find(".swiper-slide-active").addClass("current");

      const slideRight = new Swiper(slideRightDom[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 700,
        navigation: {
          prevEl: slideRightDom.find(".buttonCustom-prev")[0],
          nextEl: slideRightDom.find(".buttonCustom-next")[0],
        },
      });

      const getVideo = function (item) {
        const getIdVideo = item.find(".item-video").attr("id-video");
        const getDomId = item.find(".item-video__dom");
        getDomId.attr("src", `https://www.youtube.com/embed/${getIdVideo}`);
      };

      const firstLoad = slideRightDom.find(".swiper-slide-active");
      getVideo(firstLoad);

      slideRight.on("slideChange", function (e) {
        const getActive = $(e.slides[e.activeIndex]);
        getVideo(getActive);
        slideRightDom.find(".swiper-slide-active").addClass("last");
      });

      slideRight.on("slideChangeTransitionEnd", function (e) {
        slideRightDom
          .find(".swiper-slide.last")
          .find(".item-video__dom")
          .attr("src", "");
        slideRightDom.find(".swiper-slide").removeClass("last");
      });

      slideLeftDom.find(".item").on("click", function () {
        const self = $(this);
        const getIndex = self.parent().attr("data-index");
        slideRight.slideTo(getIndex);
      });

      slideRight.on("slideChangeTransitionStart", function (e) {
        const getIndex = e.activeIndex;
        slideLeft.slideTo(getIndex);
        slideLeftDom.find(".swiper-slide").removeClass("current");
        slideLeftDom
          .find(`.swiper-slide[data-index="${getIndex}"]`)
          .addClass("current");
      });
    }
  }

  function sohoInfo() {
    const wrap = $(".sohoInfo");
    const ww = $(window).width();
    if (wrap.length) {
      const slideBgDom = wrap.find(".sohoInfo__bgSlide");
      const slideImgDom = wrap.find(".sohoInfo__content .swiper");
      var _delay = 7000;
      if (ww < 768) {
        _delay = 30000;
      }
      const swiperBg = new Swiper(slideBgDom[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 0,
        allowTouchMove: false,
        effect: "fade",
        autoplay: {
          delay: _delay,
          disableOnInteraction: false,
        },
      });

      swiperBg.on("slideChange", function (e) {
        e.$el.find(".swiper-slide-active").addClass("last-active");
      });

      const firstLoad = slideBgDom
        .find(".swiper-slide-active")
        .attr("data-index");
      slideImgDom
        .find(`.swiper-slide[data-index="${firstLoad}"]`)
        .addClass("current");

      const swiperImg = new Swiper(slideImgDom[0], {
        slidesPerView: "auto",
        spaceBetween: 8,
        speed: 700,
        breakpoints: {
          768: {
            spaceBetween: 12,
            slidesPerView: 4,
          },
          991: {
            spaceBetween: 12,
            slidesPerView: 4,
          },
          1260: {
            spaceBetween: 12,
            slidesPerView: 4,
          },
          1700: {
            spaceBetween: 12,
            slidesPerView: 4,
          },
        },
        navigation: {
          prevEl: slideImgDom.find(".buttonCustom-prev")[0],
          nextEl: slideImgDom.find(".buttonCustom-next")[0],
        },
      });

      swiperBg.on("slideNextTransitionStart", function (e) {
        const active = slideBgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
          { clipPath: "inset(0 0% 0 0)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              slideImgDom.find(".swiper-slide").addClass("none-click");
            },
            onComplete: function () {
              slideBgDom.find(".swiper-slide").removeClass("last-active");
              slideImgDom.find(".swiper-slide").removeClass("none-click");
            },
          }
        );
        slideImgDom.find(".swiper-slide").removeClass("current");
        slideImgDom
          .find(`.swiper-slide[data-index="${e.activeIndex}"]`)
          .addClass("current");
        swiperImg.slideTo(e.activeIndex);
      });

      swiperBg.on("slidePrevTransitionStart", function (e) {
        const active = slideBgDom.find(".swiper-slide-active");
        TweenMax.fromTo(
          active[0],
          0.7,
          { clipPath: "inset(0 0 0 100%)", scale: 1.2 },
          { clipPath: "inset(0 0 0 0%)", scale: 1 }
        );
        TweenMax.fromTo(
          active.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              slideImgDom.find(".swiper-slide").addClass("none-click");
            },
            onComplete: function () {
              slideBgDom.find(".swiper-slide").removeClass("last-active");
              slideImgDom.find(".swiper-slide").removeClass("none-click");
            },
          }
        );
        slideImgDom.find(".swiper-slide").removeClass("current");
        slideImgDom
          .find(`.swiper-slide[data-index="${e.activeIndex}"]`)
          .addClass("current");
        swiperImg.slideTo(e.activeIndex - 1);
      });

      slideImgDom.find(".swiper-slide").on("click", function () {
        const getIndex = $(this).attr("data-index");
        slideImgDom.find(".swiper-slide").removeClass("current");
        $(this).addClass("current");
        swiperBg.slideTo(getIndex);
        // swiperThumb.slideTo(getIndex);
      });
    }
  }

  function waterInfo() {
    const wrap = $(".waterInfo");
    if (wrap.length) {
      const slideDom = wrap.find(".waterInfo__slide .swiper");

      const swiper = new Swiper(slideDom[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 0,
        // allowTouchMove: false,
        effect: "fade",
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      });

      // swiper.autoplay.stop();

      swiper.on("slideChange", function (e) {
        e.$el.find(".swiper-slide-active").addClass("last-active");
      });

      swiper.on("slideNextTransitionStart", function (e) {
        const selfSlide = e.$el;
        const getIndex = e.activeIndex;
        const getActive = selfSlide.find(".swiper-slide-active");
        TweenMax.fromTo(
          getActive[0],
          0.7,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)" }
        );
        TweenMax.fromTo(
          getActive.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              $(".waterInfo__btn .item").addClass("none-click");
            },
            onComplete: function () {
              slideDom.find(".swiper-slide").removeClass("last-active");
              $(".waterInfo__btn .item").removeClass("none-click");
            },
          }
        );
        $(".waterInfo__btn").find(".item").removeClass("current");
        $(".waterInfo__btn")
          .find(`.item[data-index="${getIndex}"]`)
          .addClass("current");
      });

      swiper.on("slidePrevTransitionStart", function (e) {
        const selfSlide = e.$el;
        const getIndex = e.activeIndex;
        const getActive = selfSlide.find(".swiper-slide-active");
        TweenMax.fromTo(
          getActive[0],
          0.7,
          { clipPath: "inset(0 0 0 100%)" },
          { clipPath: "inset(0 0 0 0%)" }
        );
        TweenMax.fromTo(
          getActive.find(".bg")[0],
          0.7,
          { scale: 1.2 },
          {
            scale: 1,
            onStart: function () {
              $(".waterInfo__btn .item").addClass("none-click");
            },
            onComplete: function () {
              slideDom.find(".swiper-slide").removeClass("last-active");
              $(".waterInfo__btn .item").removeClass("none-click");
            },
          }
        );
        $(".waterInfo__btn").find(".item").removeClass("current");
        $(".waterInfo__btn")
          .find(`.item[data-index="${getIndex}"]`)
          .addClass("current");
      });

      $(".waterInfo__btn .item").on("click", function () {
        const getIndex = $(this).attr("data-index");
        swiper.slideTo(getIndex);
      });
    }
  }

  function promoInfo() {
    const wrap = $(".promoInfo");
    if (wrap.length) {
      const slideDomText = wrap.find(".promoInfo__textSlide .swiper");
      const slideDomImg = wrap.find(".promoInfo__img .swiper");

      const slideText = new Swiper(slideDomText[0], {
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 700,
        // allowTouchMove: false,
        autoplay: {
          delay: 7000,
          disableOnInteraction: false,
        },
        navigation: {
          prevEl: slideDomText.find(".buttonCustom-prev")[0],
          nextEl: slideDomText.find(".buttonCustom-next")[0],
        },
      });

      const slideImg = new Swiper(slideDomImg[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 700,
        allowTouchMove: false,
        // effect: "fade",
      });

      slideText.on("slideChangeTransitionStart", function (e) {
        const getIndex = e.activeIndex;
        slideImg.slideTo(getIndex);
      });
    }
  }

  function communityInfo() {
    const wrap = $(".communityInfo");
    const ww = $(window).width();
    if (wrap.length) {
      if (ww > 767 && ww < 1260) {
        gsap.to(".communityInfo__img .item-a .img-fix", 20, {
          x: "-100%",
          ease: "none",
          repeat: -1,
        });
        gsap.to(".communityInfo__img .item-b .img-fix", 20, {
          x: "100%",
          ease: "none",
          repeat: -1,
        });
      } else if (ww > 1259) {
        gsap.to(".communityInfo__img .item-a .img-fix", 20, {
          y: "-100%",
          ease: "none",
          repeat: -1,
        });
        gsap.to(".communityInfo__img .item-b .img-fix", 20, {
          y: "100%",
          ease: "none",
          repeat: -1,
        });
      } else {
        gsap.to(".communityInfo__body .item-img .item-img__ul", 40, {
          x: "-100%",
          ease: "none",
          repeat: -1,
        });
      }
    }
  }

  function newRelete() {
    const wrap = $(".newRelete");
    if (wrap.length) {
      const slideDom = wrap.find(".swiper");
      var swiper = new Swiper(slideDom[0], {
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 700,
        breakpoints: {
          768: {
            spaceBetween: 12,
            slidesPerView: 2,
          },
          991: {
            spaceBetween: 12,
            slidesPerView: 2,
          },
          1260: {
            spaceBetween: 12,
            slidesPerView: 3,
          },
          1700: {
            spaceBetween: 20,
            slidesPerView: 3,
          },
        },
      });
    }
  }

  function copyToClipboard() {
    $(".btn-share-js").each(function () {
      $(this).on("click", function (e) {
        e.preventDefault();
        var self = $(this);
        var getUrl = self.attr("href");
        var getAlert = self.attr("data-alert");

        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(getUrl).select();
        document.execCommand("copy");
        $temp.remove();
        alert(getAlert);
      });
    });
  }

  function locationInfo() {
    const ww = $(window).width();
    const wrap = $(".locationInfo");
    const inner = wrap.find(".locationInfo__inner");
    const contentScroll = inner.find(".item-map__scroll");
    const slide = inner.find(".locationInfo__info");

    if (wrap.length) {
      wrap.find(".item-btn .btn-link").on("click", function (e) {
        e.preventDefault();
        const self = $(this).closest(".locationInfo__body");
        const getText = self.find(".item-text").html();
        const getList = self.find(".item-list ").html();

        $(".readMore-popup__title").text("");

        $(".readMore-popup__text").html(
          `<div class="fix-scroll">${getText + getList}</div>`
        );

        TweenMax.to(".readMore-popup", 0.3, {
          y: "0%",
          onStart: function () {
            TweenMax.set(".readMore-popup", { autoAlpha: 1 });
            $(".readMore-popup").addClass("location-css");
          },
        });
      });

      if (ww < 768) {
        slide.each(function (index) {
          const getMarkerLeft = inner
            .find(".locationInfo__marker")
            .offset().left;
          const contentScrollx = $(this).find(".item-map__scroll");
          const currentSlide = $(this);

          let distance;

          if (index == 0) {
            distance = getMarkerLeft - 490;
          } else {
            distance = getMarkerLeft;
          }
          contentScrollx.scrollLeft(distance);

          $(this).find(".item-map").addClass("zoom-active");
          $(this).find(".item-map__scroll").addClass("active");
          $(this).find(".zoom-");

          $(this)
            .find(".zoom-in")
            .on("click", function () {
              let i = getMarkerLeft;
              currentSlide.find(".item-map__btn span").removeClass("disable");
              $(this).addClass("disable");

              let distance2 = getMarkerLeft - 500;
              TweenMax.to(currentSlide.find(".map-inner")[0], 0.7, {
                width: "270%",
                onUpdate: function () {
                  i++;
                  contentScrollx.scrollLeft(distance2);
                },
              });

              // inner.find('.item-map').addClass('zoom-active');
              // inner.find('.item-map__scroll').addClass('active');
            });

          $(this)
            .find(".zoom-out")
            .on("click", function () {
              currentSlide.find(".item-map__btn span").removeClass("disable");
              $(this).addClass("disable");
              TweenMax.to(currentSlide.find(".map-inner")[0], 0.7, {
                width: "250%",
              });
              // inner.find('.item-map').removeClass('zoom-active');
              // inner.find('.item-map__scroll').removeClass('active');
            });

          $(this).find(".zoom-in").remove();
          $(this).find(".zoom-out").remove();
        });
      } else {
        const pcDrag = function () {
          let startY;
          let startX;
          let scrollLeft;
          let scrollTop;
          let isDown;

          const mouseIsDown = function (e) {
            isDown = true;
            startY = e.pageY - inner.find(".item-map").offset().top;
            startX = e.pageX - inner.find(".item-map").offset().left;
            scrollLeft = contentScroll.scrollLeft();
            scrollTop = contentScroll.scrollTop();
          };

          const mouseUp = function (e) {
            isDown = false;
          };

          const mouseLeave = function (e) {
            isDown = false;
          };

          const mouseMove = function (e) {
            if (isDown) {
              e.preventDefault();
              //Move vertcally
              const y = e.pageY - inner.find(".item-map").offset().top;
              const walkY = y - startY;
              contentScroll.scrollTop(scrollTop - walkY);

              //Move Horizontally
              const x = e.pageX - inner.find(".item-map").offset().left;
              const walkX = x - startX;
              contentScroll.scrollLeft(scrollLeft - walkX);
            }
          };

          inner.find(".item-map").on("mousedown", (e) => mouseIsDown(e));
          inner.find(".item-map").on("mouseup", (e) => mouseUp(e));
          inner.find(".item-map").on("mouseleave", (e) => mouseLeave(e));
          inner.find(".item-map").on("mousemove", (e) => mouseMove(e));
        };
        inner.find(".zoom-in").on("click", function () {
          let i = 0;
          inner.find(".item-map__btn span").removeClass("disable");
          $(this).addClass("disable");
          TweenMax.to(contentScroll.find(".map-inner")[0], 0.7, {
            width: "150%",
            onUpdate: function () {
              i++;
              contentScroll.scrollLeft((i * contentScroll.width() * 1.5) / 100);
            },
          });

          inner.find(".item-map").addClass("zoom-active");
        });

        inner.find(".zoom-out").on("click", function () {
          inner.find(".item-map__btn span").removeClass("disable");
          $(this).addClass("disable");
          TweenMax.to(contentScroll.find(".map-inner")[0], 0.7, {
            width: "100%",
          });
          inner.find(".item-map").removeClass("zoom-active");
        });

        if (ww > 1259) {
          pcDrag();
        }
      }
    }
  }

  function mgvFloor() {
    const wrap = $(".mgvFloor");
    if (wrap.length) {
      const slideDomImg = wrap.find(".swiper");

      const slideImg = new Swiper(slideDomImg[0], {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 700,
        allowTouchMove: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        effect: "fade",
      });
    }
  }

  function effectFullPageJs() {
    const ww = $(window).width();
    const getLengthSection = $("#fullpage .fullpage-panel").length;
    let firstBolen = false;

    const hero = $(".hero");
    let heroTl;
    if (hero.length) {
      // heroTl = new TimelineMax({paused: true});
      heroTl = new TimelineMax();
      heroTl.to(".hero__min", 0.5, {});
      heroTl.addLabel("a");
      heroTl.fromTo(
        ".hero__min",
        0.5,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1 }
      );
      heroTl.fromTo(
        ".hero__title",
        0.5,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1 },
        "a+0.3"
      );
      heroTl.fromTo(
        ".hero__subtitle",
        0.5,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1 },
        "a+0.6"
      );
      heroTl.fromTo(
        ".hero__footer img",
        0.5,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1 },
        "a+0.9"
      );
    }

    let mobileNg = false;

    if (device.mobile() && device.orientation === "landscape") {
      mobileNg = true;
    }

    if (device.mobile()) {
      device.onChangeOrientation((newOrientation) => {
        if (newOrientation === "portrait" && mobileNg === true) {
          location.reload();
        }
      });
    }

    const locationDom = $(".locationInfo");
    let locationDomTl;
    if (locationDom.length) {
      locationDomTl = new TimelineMax({ paused: true });
      locationDomTl.addLabel("a");
      if (ww > 767) {
        locationDomTl.fromTo(
          ".locationInfo__info:first-child .map-inner",
          2,
          { scale: 2.1, transformOrigin: "100% 18%" },
          { scale: 1 }
        );
        locationDomTl.fromTo(
          ".locationInfo__info:last-child .map-inner",
          2,
          { scale: 1, transformOrigin: "100% 18%" },
          { scale: 1 }
        );
      } else {
        locationDomTl.fromTo(
          ".locationInfo__info:first-child .item-map",
          2,
          { scale: 1.5, transformOrigin: "50% 50%" },
          { scale: 1 }
        );
        locationDomTl.fromTo(
          ".locationInfo__info:last-child .item-map",
          2,
          { scale: 1, transformOrigin: "50% 50%" },
          { scale: 1 }
        );
      }
    }

    let slideIndexS = 0;
    let sliding = false;
    let currentAnchor;

    $("#fullpage").fullpage({
      sectionSelector: ".fullpage-panel",
      navigation: false,
      slidesNavigation: false,
      controlArrows: false,
      menu: "#menu-fullpage",
      scrollingSpeed: 1000,
      fadingEffect: true,
      scrollOverflow: true,
      scrollOverflowReset: true,
      scrollOverflowOptions: {
        disableTouch: false,
        bounce: false,
        directionLockThreshold: 1,
      },
      // dragAndMove: 'vertical',
      normalScrollElements:
        ".exuberanceInfo-right .item-scroll, .locationInfo__info .item-map__scroll.active, .videoGallery__body .views-element-container",
      afterResize: function () {
        if (!device.mobile()) {
          location.reload();
        }
      },
      afterLoad: function (anchorLink, index) {
        currentAnchor = anchorLink;
        $(".menu-sidebar__btn .btn-center").text(
          `${index} / ${getLengthSection}`
        );
        $(".fullpage-panel").find(".fp-bg").removeClass("done");

        if (
          anchorLink === "Community" ||
          anchorLink === "Construction" ||
          anchorLink === "Zoneamenities" ||
          anchorLink === "Promotion" ||
          anchorLink === "Zones" ||
          anchorLink === "newDetail" ||
          anchorLink === "Facilities&Amenities"
        ) {
          $(".menu-sidebar").addClass("reverse");
        } else {
          $(".menu-sidebar").removeClass("reverse");
        }

        if (anchorLink === "MasteriCollection") {
          const wrap = $(".waterInfo");
          const slideDom = wrap.find(".waterInfo__slide .swiper");
          const getFirstIndex = slideDom
            .find(".swiper-slide-active")
            .attr("data-index");
          $(".waterInfo__btn")
            .find(`.item[data-index="${getFirstIndex}"]`)
            .addClass("current");
        }

        if (anchorLink === "PhotoGallery") {
          if (ww > 767 && ww < 1260) {
            $(".menu-sidebar").addClass("reverse");
          }
        }

        if (anchorLink === "Registeryourinterest") {
          if (ww > 767 && ww < 1260) {
            $(".menu-sidebar").addClass("reverse");
          }
        }

        if (anchorLink === "Banner") {
          heroTl.play();
          $("#hero-video")[0].play();
        }

        if (anchorLink === "Locations") {
          locationDomTl.play();
        }

        if (anchorLink === "Partners") {
          if ($(".partnerSlide").length) {
            setTimeout(function () {
              // partnerSwiper.autoplay.start();
            }, 5000);
          }
        }

        if (anchorLink === "Zones") {
          if ($(".zoneInfo").length) {
            setTimeout(function () {
              zoomInfoBg.autoplay.start();
            }, 5000);
          }
        }

        if (anchorLink === "Facilities&Amenities") {
          if ($(".facilitieInfo").length) {
            setTimeout(function () {
              facilitieInfoBG.autoplay.start();
            }, 5000);
          }
        }

        if (anchorLink === "Lifestyle" || anchorLink === "Projectnarrative") {
          if ($(".exuberanceInfo").length) {
            // exuberanceSwiper.autoplay.start();
            exuberanceI = 0;
            exuberanceFix = true;
          }
        }
      },

      onLeave: function (index, nextIndex, direction) {
        if (hero.length) {
          setTimeout(function () {
            heroTl.pause(0);
          }, 700);
        }

        if (locationDom.length) {
          setTimeout(function () {
            locationDomTl.pause(0);
          }, 700);
        }

        if ($(".partnerSlide").length) {
          setTimeout(function () {
            partnerSwiper.autoplay.stop();
            partnerSwiper.slideTo(0);
          }, 700);
        }

        if ($(".zoneInfo").length) {
          setTimeout(function () {
            zoomInfoBg.autoplay.stop();
            zoomInfoBg.slideTo(0);
          }, 700);
        }

        if ($(".facilitieInfo").length) {
          setTimeout(function () {
            facilitieInfoBG.autoplay.stop();
            facilitieInfoBG.slideTo(0);
          }, 700);
        }

        if ($(".exuberanceInfo").length) {
          setTimeout(function () {
            exuberanceSwiper.autoplay.stop();
            exuberanceSwiper.slideTo(0);
            exuberanceFix = false;
          }, 700);
        }

        const self = $(this);

        if ($(".locationWithSlides").length) {
          const isLocationMultiSlide = currentAnchor == "Locations";

          if (isLocationMultiSlide && !sliding) {
            const locationInfoLength = $(".locationInfo__info").length;
            console.log(slideIndexS);
            console.log(locationInfoLength);
            if (direction === "down" && slideIndexS < locationInfoLength - 1) {
              $.fn.fullpage.moveSlideRight();
              return false;
            } else if (
              direction === "up" &&
              slideIndexS >= locationInfoLength - 1
            ) {
              $.fn.fullpage.moveSlideLeft();
              return false;
            }
          } else if (sliding) {
            return false;
          }
        }

        if (direction === "down") {
          const nextItem = self.next();
          if (nextItem.length) {
            nextItem.find(".fp-bg").addClass("active");
          }
        }

        if (direction === "up") {
          const nextItem = self.prev();
          self.find(".fp-bg").removeClass("active");
          if (nextItem.length) {
            nextItem.find(".fp-bg").addClass("active");
          }
        }
      },
      afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
        slideIndexS = slideIndex;
      },
      onSlideLeave: function (
        anchorLink,
        index,
        slideIndex,
        direction,
        nextSlideIndex
      ) {
        if (locationDom.length) {
          locationDomTl = new TimelineMax({ paused: true });
          locationDomTl.addLabel("a");
          if (ww < 767 && direction == "down" && slideIndex == 0) {
            locationDomTl.fromTo(
              ".locationInfo__info:last-child .map-inner",
              2,
              { scale: 1.2, transformOrigin: "100% 90%" },
              { scale: 1.2 }
            );
          } else if (ww < 767 && direction == "up" && slideIndex == 1) {
            locationDomTl.fromTo(
              ".locationInfo__info:first-child .item-map",
              2,
              { scale: 1.5, transformOrigin: "50% 50%" },
              { scale: 1 }
            );
          }
        }
      },
    });

    const getFirstActive = $(".fullpage-panel.active").index();
    for (let i = 0; i < getFirstActive; i++) {
      $(".fullpage-panel:eq(" + i + ")")
        .find(".fp-bg")
        .addClass("active done");
    }

    $(".menu-sidebar__btn .btn-up").on("click", function () {
      $.fn.fullpage.moveSectionUp();
    });

    $(".menu-sidebar__btn .btn-down").on("click", function () {
      $.fn.fullpage.moveSectionDown();
    });
  }

  function loadingPage() {
    let data = sessionStorage.getItem("loadFirst");
    if (!data) {
      console.log(data);
      TweenMax.to(".loading-progress span", 1, { width: "70%" });

      $(window).on("load", function () {
        TweenMax.to(".loading-progress span", 0.5, {
          width: "100%",
          onStart: function () {},
          onComplete: function () {
            // effectFullPageJs();
            TweenMax.to(".loading", 0.3, { autoAlpha: 0 });

            sessionStorage.setItem("loadFirst", "true");
          },
        });
      });
    }
  }

  ///
  dataImageMobileUrl();
  headerJs();
  townshipIntro();
  partnerSlide();
  exuberanceInfo();
  zoneInfo();
  facilitieInfo();
  contactEffectBtn();
  alertJs();
  menuSidebarJs();
  readMoreClick();
  photoGalleryJs();
  videoGalleryJs();
  blogListSlide();
  sohoInfo();
  waterInfo();
  promoInfo();
  communityInfo();
  copyToClipboard();
  loadingPage();
  mgvFloor();

  document.addEventListener("DOMContentLoaded", (event) => {
    effectFullPageJs();
  });

  $(window).on("load", function () {
    $("body").addClass("body-load-done");
    heroJs();
    aboutInfo();
    construcInfoSlideJs();
    newRelete();
    locationInfo();

    if (device.mobile() && device.orientation === "landscape") {
      $.fn.fullpage.destroy("all");
    }
  });

  function calculateExpireTime() {
    // Create a new date object with the current date and time
    var today = new Date();

    // Get the number of milliseconds since January 1, 1970, 00:00:00 UTC for today
    var todayMs = today.getTime();

    // Add 24 hours to todayMs
    var tomorrowMs = todayMs + 0.5 * 60 * 60 * 1000;

    // Create a new date object with tomorrowMs
    var tomorrow = new Date(tomorrowMs);
    return tomorrow;
  }

  $(document).ready(function () {
    var current = new Date();
    var expireTime = new Date(localStorage.getItem("expireTime"));
    if (current > expireTime || expireTime === null) {
      $("#adv-popup").delay(2000).fadeIn();
      var expireTime = calculateExpireTime();
      localStorage.setItem("expireTime", expireTime);
    } else {
    }
    $("#popup-close").click(function (
      e // You are clicking the close button
    ) {
      $("#adv-popup").fadeOut(); // Now the pop up is hiden.
    });

    $("#adv-popup").click(function (e) {
      $("#adv-popup").fadeOut();
    });
  });
})(jQuery);
