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
});