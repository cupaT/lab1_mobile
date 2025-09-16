$(function() {
    $('.burger').on('click', function() {
        $('nav ul').slideToggle(250).toggleClass('active');
    });

    $('nav ul li a').on('click', function() {
        if ($(window).width() <= 767) {
            $('nav ul').slideUp(200).removeClass('active');
        }
    });
});

$(function() {
    $('#openContactModal').on('click', function() {
        $('#contactModal').addClass('active');
    });
    $('.modal-close').on('click', function() {
        $('#contactModal').removeClass('active');
        $('#feedbackForm')[0].reset();
        $('.form-success').hide();
    });
    $('.modal-overlay').on('click', function() {
        $('#contactModal').removeClass('active');
        $('#feedbackForm')[0].reset();
        $('.form-success').hide();
    });
});