$(document).ready(function () {

    loadData();
    var token = $('input[name="__RequestVerificationToken"]').val();

    $("#btnSave").click(function () {

        //const $btn = $(this);
        //$btn.hide();
        //$('#btnLoad').show();

        var listObj = {
            Name: $("#listName").val(),
            //description: $("#description").val()
        };

        $.ajax({
            url: '/List/createList',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',    //gdy wysyłamy dane czasami chcemy ustawić ich typ
            dataType: 'json',                                                   //typ danych jakich oczekujemy w odpowiedzi
            data: {                                                             //dane do wysyłki w jsonie
                __RequestVerificationToken: token,
                list: listObj
            },
            success: function (response) {
                if (response.success) {
                    loadData();
                    $('#success').show();
                    $('input').val('');
                    $('#success').delay(2000).fadeOut('slow');
                } else {
                    $('#error').show();
                    $('#error').delay(2000).fadeOut('slow');
                }
            },
            error: function (errorMessage) {
                alert(errorMessage);
            }
        }).always(() => {
            //$btn.show();
            //$('#btnLoad').hide();
        });
    });
});


//$(document).on("click", "p", function (event) {

//    debugger;
//    var listID = event.target.id;

//    $.ajax({
//        url: '/List/getTask',
//        method: 'GET',
//        dataType: 'json',
//        data: { Id: listID },
//        success: function (data) {
//            $.each(data, function (i, tasks) {

//                var uList =

//                    '<p>' + tasks.Name +'</p>';

//                $('#'+'event.target.id').append(uList);
//            });
//        },
//        error: function (errorMessage) {
//            alert('lol');
//        }
//    });

//});




function loadData() {

    $("#divTask children").remove();
    debugger;
    $.ajax({
        url: '/List/getList',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (i, lists) {

                var uList =
                    '<p class="list-group-item customList" id="' + lists.ID + '">' +
                    lists.Name +
                    '<span class="float-right mt-2 lol customFontA" id="bin">' +
                    '<i class="far fa-trash-alt d-inline"></i>' +
                    '</span></p>';

                $('#taskList').append(uList);
            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });

};