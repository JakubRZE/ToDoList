$(document).ready(function () {

    debugger;

    loadData();
    var token = $('input[name="__RequestVerificationToken"]').val();


    //nowy post method 


    $("#btnSave").click(function () {

        //const $btn = $(this);
        //$btn.hide();
        //$('#btnLoad').show();

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
                    loadData();
                    $('#success').show();
                    $('input').val('');
                    $('#success').delay(2000).fadeOut('slow');
                } else {
                    alert(response.responseText);
                    $('#error').show();
                    $('#error').delay(2000).fadeOut('slow');
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        }).always(() => {
            //$btn.show();
            //$('#btnLoad').hide();
        });
    });
});


//$(document).on("click", "[name='listedElement']", function (event) {

//    var listID = event.target.id;
//    var nameID = "[name='" + listID.toString() + "']";
//    var strID = "#" + listID.toString();

//    //$(strID).click(function () {
//    //    $(nameID).slideToggle();
//    //});

//    $(nameID).remove();


//    $.ajax({
//        url: '/List/getTask',
//        method: 'GET',
//        dataType: 'json',
//        data: { Id: listID },
//        success: function (data) {

//            // add new task firld
//            var uListFirst =
//                '<div class="list-group-item customListChild" id="taskInput" name="' + listID.toString() + '" >'+
//                '<input type="text" name="' + listID.toString() + '"  class=" col-12 d-inline list-group-item coustomInput" style="display: none;" placeholder="Add new task..." required="" />' +
//                '<span class="float-right customFontAPlus" id="plus">'+
//                    '<i class="fas fa-plus-circle"></i>'+
//                '</span>'+
//                '</div>';
//            $(strID).after(uListFirst);

//            // tasks loop
//            $.each(data, function (i,tasksVM) {
//                var uuList =
//                    '<p class="list-group-item customListChild" name="' + listID.toString() + '">' + tasksVM.Description + '</p>';
//                $('#taskInput').after(uuList);
//                $(nameID).slideDown();
//            });
//        },
//        error: function (response) {
//            alert(response.responseText);
//        }
//    });
//});




function loadData() {


    $("#divTask children").remove();
    $.ajax({
        url: '/List/getList',
        method: 'GET',
        dataType: 'json',
        success: function (data) {

            //lists loop
            $.each(data, function (i, lists) {
                var uList =
                    '<p class="list-group-item customList" name="listedElement" id="' + lists.ID + '">' +
                    lists.Name +
                    '<span class="float-right customFontABin" id="bin">' +
                    '<i class="far fa-trash-alt d-inline"></i>' +
                    '</span></p>';
                $('#taskList').append(uList);

                var listID = "#" + lists.ID.toString();
                $(listID).slideDown();

                
                         //kolejna petla z taskami
                            $.each(lists.Tasks, function (i, task) {
                                var uTask = '<p class="list-group-item customListChild" name="' + task.IsDone.toString() + '" id="t' + lists.ID + '">' + task.Description + '</p>';
                                var taskElementID = "#" + lists.ID.toString();
                                $(taskElementID).after(uTask);

                                var taskID = "#t" + lists.ID.toString();
                                $(taskID).slideDown();
                });

                //input bar
                var uListInput =
                    '<div class="list-group-item customListChild" name="divTaskInput" id="t' + lists.ID +'">' + 
                    '<input type="text" name="taskDesc" class="col-12 d-inline list-group-item coustomInput" placeholder="Add new task..." required="" />' +
                    '<span class="float-right customFontAPlus" id="plus">' +
                    '<i class="fas fa-plus-circle"></i>' +
                    '</span>' +
                    '</div>';
                var listElementID = "#" + lists.ID.toString();
                $(listElementID).after(uListInput);

                var taskID = "#t" + lists.ID.toString();
                $(taskID).slideDown();
            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};