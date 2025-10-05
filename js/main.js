$(function() {
  // Меню (бургер)
  $('.header__burger').on('click', function() {
    $('.header__nav-list').slideToggle(250).toggleClass('active');
  });

  $('.header__nav-link').on('click', function() {
    if ($(window).width() <= 767) {
      $('.header__nav-list').slideUp(200).removeClass('active');
    }
  });

  // Модалка
  $('#openContactModal').on('click', function() {
    $('#contactModal').addClass('modal--open');
    $('.form-success, .form-error').removeClass('active').html('');
  });

  $('.modal__close, .modal__overlay').on('click', function() {
    $('#contactModal').removeClass('modal--open');
    $('#feedbackForm')[0].reset();
    $('.form-success, .form-error').removeClass('active').html('');
  });

  $('#feedbackForm').on('submit', function(e) {
    e.preventDefault();
    var name = $.trim($('input[name="name"]').val());
    var email = $.trim($('input[name="email"]').val());
    var message = $.trim($('textarea[name="message"]').val());
    var error = '';

    if (!name) error += 'Пожалуйста, введите имя.<br>';
    if (!email) error += 'Пожалуйста, введите email.<br>';
    else if (!validateEmail(email)) error += 'Некорректный email.<br>';
    if (!message) error += 'Пожалуйста, введите сообщение.<br>';

    if (error) {
      $('.form-error').html(error).addClass('active');
      $('.form-success').removeClass('active').html('');
      return;
    } else {
      $('.form-error').removeClass('active').html('');
    }

    $.ajax({
      url: 'https://httpbin.org/post',
      type: 'POST',
      data: { name, email, message },
      dataType: 'json',
      beforeSend: function() {
        $('#feedbackForm button[type="submit"]').prop('disabled', true).text('Отправка...');
      },
      success: function() {
        $('.form-success').html('Спасибо! Ваше сообщение отправлено.').addClass('active');
        $('.form-error').removeClass('active').html('');
        $('#feedbackForm')[0].reset();
      },
      error: function() {
        $('.form-error').html('Ошибка отправки. Попробуйте ещё раз.').addClass('active');
        $('.form-success').removeClass('active').html('');
      },
      complete: function() {
        $('#feedbackForm button[type="submit"]').prop('disabled', false).text('Отправить');
      }
    });
  });

  function validateEmail(email) {
    return /^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(email);
  }

  // Портфолио
  $.getJSON('data/portfolio.json', function(data) {
    var $list = $('.portfolio__list');
    $list.empty();
    $.each(data, function(i, work) {
      var $card = $(`
        <div class="portfolio-card" style="display:none;">
          <img src="${work.image}" alt="${work.alt || work.title}" class="portfolio-card__image">
          <div class="portfolio-card__body">
            <h3 class="portfolio-card__title">${work.title}</h3>
            <p class="portfolio-card__desc">${work.description}</p>
            <a href="${work.link}" target="_blank" class="portfolio-card__link btn btn--primary">GitHub</a>
          </div>
        </div>
      `);
      $list.append($card);
      $card.fadeIn(350 + i * 120);
    });
  });

  // Кнопка вверх
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 300) {
      $('.to-top-btn').addClass('to-top-btn--visible');
    } else {
      $('.to-top-btn').removeClass('to-top-btn--visible');
    }
  });

  $('.to-top-btn').on('click', function() {
    $('html, body').animate({scrollTop: 0}, 600);
  });

  // Active link при скролле
  const sectionIds = ['#about', '#skills', '#portfolio', '#contacts'];
  $(window).on('scroll', function () {
    let scrollPos = $(window).scrollTop() + 120;
    let currentSection = sectionIds[0];

    for (let i = 0; i < sectionIds.length; i++) {
      const id = sectionIds[i];
      const $section = $(id);
      if ($section.length) {
        if (
          id === '#contacts' &&
          (
            $(window).scrollTop() + $(window).height() >=
            $(document).height() - 10 ||
            scrollPos >= $section.offset().top - 40
          )
        ) {
          currentSection = id;
          break;
        } else if (scrollPos >= $section.offset().top - 40) {
          currentSection = id;
        }
      }
    }
    $('.header__nav-link').removeClass('active');
    $(`.header__nav-link[href="${currentSection}"]`).addClass('active');
  });

  $(window).trigger('scroll');


  function getSlidesToShow() {
    const w = $(window).width();
    if (w < 768) return 1;
    if (w < 1024) return 2;
    return 4;
  }

  let skillsCurrent = 0;
  let skillsAutoScroll;
  let slidesToShow = getSlidesToShow();
  const $skillsList = $('.skills__list');
  let $skillsCards = $skillsList.children('.skill-card');

  function addSkillPlaceholders() {
    slidesToShow = getSlidesToShow();
    $skillsCards = $skillsList.children('.skill-card');
    let totalSkills = $skillsCards.length;
    const toAdd = (slidesToShow - (totalSkills % slidesToShow)) % slidesToShow;
    $skillsList.children('.skill-card--placeholder').remove();
    if (toAdd && toAdd < slidesToShow) {
      for (let i = 0; i < toAdd; i++) {
        $skillsList.append('<div class="skill-card skill-card--placeholder"></div>');
      }
    }
    $skillsCards = $skillsList.children('.skill-card');
  }

  function updateSkillsCarousel() {
    slidesToShow = getSlidesToShow();
    addSkillPlaceholders();
    $skillsCards = $skillsList.children('.skill-card');
    const cardWidth = $skillsCards.outerWidth(true);
    const gap = parseInt($skillsList.css('gap')) || 0;
    const offset = (cardWidth + gap) * skillsCurrent;
    $skillsList.css('transform', `translateX(-${offset}px)`);
  }

  function showSkillSlide(idx) {
    slidesToShow = getSlidesToShow();
    $skillsCards = $skillsList.children('.skill-card');
    const totalSkills = $skillsCards.length;
    const maxIndex = Math.max(0, totalSkills - slidesToShow);
    if (idx < 0) idx = maxIndex;
    if (idx > maxIndex) idx = 0;
    skillsCurrent = idx;
    updateSkillsCarousel();
  }

  $('.skills-prev').on('click', function() {
    showSkillSlide(skillsCurrent - 1);
    restartSkillsAuto();
  });
  $('.skills-next').on('click', function() {
    showSkillSlide(skillsCurrent + 1);
    restartSkillsAuto();
  });

  function startSkillsAuto() {
    skillsAutoScroll = setInterval(function() {
      showSkillSlide(skillsCurrent + 1);
    }, 3500);
  }
  function restartSkillsAuto() {
    clearInterval(skillsAutoScroll);
    startSkillsAuto();
  }

  $(window).on('resize', function() {
    showSkillSlide(skillsCurrent);
  });

  showSkillSlide(0);
  startSkillsAuto();

  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

// Кнопка переключения темы
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.onclick = function() {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
      themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
    };
    themeBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  }
});
