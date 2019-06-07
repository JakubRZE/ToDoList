$(document).ready(() => {
    $(document).on("click", "[name='listedElement']",(event) => {
        var listID = event.target.id;

        $(`[name='i${listID.toString()}']`).slideToggle();
        $(`[name='t${listID.toString()}']`).slideToggle();
    });
});