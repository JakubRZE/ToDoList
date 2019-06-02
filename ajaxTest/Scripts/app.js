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


$(document).on("click", "[name='listedElement']", function (event) {

    var listID = event.target.id;
    var nameID = "[name='" + listID.toString() + "']";
    var strID = "#" + listID.toString();

    //$(strID).click(function () {
    //    $(nameID).slideToggle();
    //});

    $(nameID).remove();


    $.ajax({
        url: '/List/getTask',
        method: 'GET',
        dataType: 'json',
        data: { Id: listID },
        success: function (data) {

            var uListFirst =
                '<div class="list-group-item customListChild" id="taskInput" name="' + listID.toString() + '" >'+
                '<input type="text" name="' + listID.toString() + '"  class=" col-12 d-inline list-group-item coustomInput" style="display: none;" placeholder="Add new task..." required="" />' +
                '<span class="float-right mt-2 lol customFontAPlus" id="plus">'+
                    '<i class="fas fa-plus-circle"></i>'+
                '</span>'+
                '</div>';
            $(strID).after(uListFirst);

            $.each(data, function (i,tasksVM) {

                var uuList =
                    '<p class="list-group-item customListChild" name="' + listID.toString() + '">' + tasksVM.Description + '</p>';
                $('#taskInput').after(uuList);

                $(nameID).slideDown();
            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
});




function loadData() {
    $("#divTask children").remove();
    $.ajax({
        url: '/List/getList',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (i, lists) {

                var uList =
                    '<p class="list-group-item customList" name="listedElement" id="' + lists.ID + '">' +
                    lists.Name +
                    '<span class="float-right customFontABin" id="bin">' +
                    '<i class="far fa-trash-alt d-inline"></i>' +
                    '</span></p>';
                $('#taskList').append(uList);
                $("[name='listedElement']").slideDown();
            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};