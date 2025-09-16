$(function() {
    $('.burger').on('click', function() {
        $('nav ul').slideToggle(250).toggleClass('active');
    });

    $('nav ul li a').on('click', function() {
        if ($(window).width() <= 767) {
            $('nav ul').slideUp(200).removeClass('active');
        }
    });

    $('#openContactModal').on('click', function() {
        $('#contactModal').addClass('active');
        $('.form-success, .form-error').removeClass('active').html('');
    });
    $('.modal-close, .modal-overlay').on('click', function() {
        $('#contactModal').removeClass('active');
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
            data: { name: name, email: email, message: message },
            dataType: 'json',
            beforeSend: function() {
                $('#feedbackForm button[type="submit"]').prop('disabled', true).text('Отправка...');
            },
            success: function(response) {
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
    $.getJSON('data/portfolio.json', function(data) {
        var $list = $('.portfolio-list');
        $list.empty();
        $.each(data, function(i, work) {
            var $card = $(`
                <div class="portfolio-card" style="display:none;">
                    <img src="${work.image}" alt="${work.alt || work.title}">
                    <div>
                        <h3>${work.title}</h3>
                        <p>${work.description}</p>
                        <a href="${work.link}" target="_blank">GitHub</a>
                    </div>
                </div>
            `);
            $list.append($card);
            $card.fadeIn(350 + i * 120);
        });
    });

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            $('#toTopBtn').addClass('show');
        } else {
            $('#toTopBtn').removeClass('show');
        }
    });

    $('#toTopBtn').on('click', function() {
        $('html, body').animate({scrollTop: 0}, 600);
    });

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

        $('nav a').removeClass('active');
        $(`nav a[href="${currentSection}"]`).addClass('active');
    });

    $(window).trigger('scroll');
});