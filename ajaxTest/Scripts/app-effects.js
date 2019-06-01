$(document).ready(function () {

    $("#cos").click(function () {
        $("#zakupy").slideToggle();
    });


    $(document).on("mouseenter", "#bin", function () {
        $(this).css(
            "color", "red"
        );
    });

    $(document).on("mouseleave", "#bin", function () {
        $(this).css(
            "color", "white"
        );
    });


});