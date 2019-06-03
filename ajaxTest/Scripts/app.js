$(document).ready(function () {

    debugger;
    loadData();
    var token = $('input[name="__RequestVerificationToken"]').val();

    $("#btnSave").click(function () {
        $.ajax({
            url: '/List/createList',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',    //gdy wysyłamy dane czasami chcemy ustawić ich typ
            dataType: 'json',                                                   //typ danych jakich oczekujemy w odpowiedzi
            data: {                                                             //dane do wysyłki w jsonie
                __RequestVerificationToken: token,
                Name: $("#listName").val(),
            },
            success: function (response) {
                if (response.success) {
                    $('#success').show();
                    $('input').val('');
                    $('#success').delay(1500).fadeOut('slow');
                    loadData();
                } else {
                    alert(response.responseText);
                    $('#error').show();
                    $('#error').delay(1500).fadeOut('slow');
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
});

function loadData() {

    $("#divTask children").remove();

    $.ajax({
        url: '/List/getList',
        method: 'GET',
        dataType: 'json',
        success: function (data) {

            //lists loop
            $.each(data, function (i, lists) {

                var strListID = lists.ID.toString();

                var uList =
                    '<p class="list-group-item customList" name="listedElement" id="' + lists.ID + '">' +
                    lists.Name +
                    '<span class="float-right customFontABin" id="bin">' +
                    '<i class="far fa-trash-alt d-inline"></i>' +
                    '</span></p>';
                $('#taskList').append(uList);

                //kolejna petla z taskami
                $.each(lists.Tasks, function (i, task) {
                    var uTask = '<p class="list-group-item customListChild" name="t' + lists.ID + '" Id="t'+task.ID+'">' + task.Description + '</p>';
                    var taskElementID = "#" + strListID;
                    $(taskElementID).after(uTask);

                });

                //input bar
                var uListInput =
                    '<div class="list-group-item customListChild" name="i' + lists.ID + '">' +
                    '<input type="text" name="taskDesc" class="col-12 d-inline list-group-item coustomInput" placeholder="Add new task..." required="" />' +
                    '<span class="float-right customFontAPlus" id="plus">' +
                    '<i class="fas fa-plus-circle"></i>' +
                    '</span>' +
                    '</div>';
                $("#" + strListID).after(uListInput);
                $("#" + strListID).slideDown();

            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};