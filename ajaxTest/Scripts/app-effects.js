$(document).ready(function () {
    $(document).on("click", "[name='listedElement']", function (event) {

        var listID = event.target.id;

        $("[name='i" + listID.toString() + "']").slideToggle();
        $("[name='t" + listID.toString() + "']").slideToggle();
    });
});