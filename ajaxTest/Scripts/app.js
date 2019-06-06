$(document).ready(function () {

    var token = $('input[name="__RequestVerificationToken"]').val();

    //load data
    loadData();

    //**********LIST**********

    // add new list by click
    $("#btnSave").on("click", function (event) {
        if ($("#listName").val() != '') {
            addList(token, event);
        }
        else {
            $("#listName").effect("shake");
        }
    });
    // by enter
    $("#listName").keyup(function (event) {
        if (event.keyCode === 13) {
            if ($("#listName").val() != '') {
                addList(token,event);
            }
            else {
                $("#listName").effect("shake");
            }
        }
    });
    //delete list
    $(document).on("click", "[name='bin']", function (event) {
        var binID = event.target.id.slice(1);
        deleteList(binID, token);
    });


    //*********TASK*********

    // add new TASK by click
    $(document).on("click", "[name='addTask']", function (event) {
        var listId = event.target.id.slice(1);
        if ($("#i" + listId).val() != '') {
            addTask(listId, token,event);
        }
        else {
            $("#i" + listId).effect("shake");
        }
    });
    //by enter
    $(document).on("focus", "[name='taskDesc']", function () {
        $(this).on('keyup', function (event) {
            if (event.keyCode == 13) {
                var listId = event.target.id.slice(1);
                if ($("#i" + listId).val() != '') {
                    addTask(listId, token,event);
                }
                else {
                    $("#i" + listId).effect("shake");
                }
            };
        });
    });
    //update
    $(document).on("click", ".customListChild", function (event) {
        if (event.target === this) {
            var taskId = event.target.id.slice(1);
            if ($(this).hasClass("false")) {
                updateTask(taskId, token, true, event);
            }
            else if ($(this).hasClass("true")) {
                updateTask(taskId, token, false, event);
            }
        }
    });

    //delete task
    $(document).on("click", "[name='taskBin']", function (event) {

        var taskBinID = event.target.id.slice(2);
        var listId = $(this).parent().parent().attr('name').slice(1);

        deleteTask(listId, taskBinID, token);
    });
});


//**********LIST**********

function addList(token, event) {

    event.preventDefault();
    event.stopImmediatePropagation();
    $("#btnSave").disabled = true;

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
                $('input').val('');
                loadData();
            }
        },
        error: function (response) {
            //alert(response.responseText);
        }
    }).always(function () {
        $("#btnSave").disabled = false;
    });
};

function deleteList(ID, token) {
    if (confirm('Are you sure to delete this list?') == true) {
        $.ajax({
            url: "/List/DeleteList",
            method: "POST",
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: "json",
            data:
            {
                __RequestVerificationToken: token,
                id: ID
            },
            success: function (result) {
                loadData();
            },
            error: function (errormessage) {
                //alert(errormessage.responseText);
            }
        });
    }
}

//*********TASK*********

function addTask(listId, token, event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    $.ajax({
        url: '/Task/createTask',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',    //gdy wysyłamy dane czasami chcemy ustawić ich typ
        dataType: 'json',                                                   //typ danych jakich oczekujemy w odpowiedzi
        data: {                                                             //dane do wysyłki w jsonie
            __RequestVerificationToken: token,
            listID: listId,
            Description: $("#i" + listId).val()
        },
        success: function (response) {
            $("#i" + listId).val('');
            loadTask(listId);
        },
        error: function (response) {
            //alert(response.responseText);
        }
    });
};

function updateTask(taskId, token, isdone, event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    $.ajax({
        url: '/Task/updateTask',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',    
        dataType: 'json',
        data: {                                                           
            __RequestVerificationToken: token,
            id: taskId,
            isDone: isdone
        },
        success: function (response) {
            //loadTask(listId);
            if (isdone) {
                $("#t" + taskId).removeClass("false").addClass("true");
            }
            else {
                $("#t" + taskId).removeClass("true").addClass("false");
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};

function deleteTask(listId, taskId, token) {
    if (confirm('Are you sure to delete this task ?') == true) {
        $.ajax({
            url: "/Task/DeleteTask",
            method: "POST",
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: "json",
            data:
            {
                __RequestVerificationToken: token,
                id: taskId
            },
            success: function (result) {
                loadTask(listId);
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

//*********DATA*********
//load data function
function loadData() {

    $("#taskList children").remove();
    jQuery('#taskList').empty();

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
                    '<span class="float-right customFontABin">' +
                    '<i class="far fa-trash-alt d-inline" name="bin" id=b' + lists.ID + '></i>' +
                    '</span></p>';
                $('#taskList').append(uList);

                //kolejna petla z taskami
                $.each(lists.Tasks, function (i, task) {
                    var uTask = '<p class="list-group-item customListChild ' + task.IsDone + '" name="t' + lists.ID + '" Id="t' + task.ID + '">' +
                        task.Description +
                        '<span class="float-right customFontABinTask">' +
                        '<i class="far fa-trash-alt d-inline" name="taskBin" id=tb' + task.ID + '></i>' +
                        '</span></p>';
                    $("#" + lists.ID).after(uTask);
                });

                //input bar
                var uListInput =
                    '<div class="list-group-item customListChild" name="i' + lists.ID + '">' +
                    '<input autofocus type="text" name="taskDesc" class="col-12 d-inline list-group-item customInput" Id="i' + lists.ID + '" placeholder="Add new task..." required="" />' +
                    '<span class="float-right customFontAPlus">' +
                    '<i class="fas fa-plus-circle" name="addTask" id="p' + lists.ID + '"></i>' +
                    '</span>' +
                    '</div>';
                $("#" + lists.ID).after(uListInput);
                $("#" + lists.ID).slideDown();

            });
        },
        error: function (response) {
            //alert(response.responseText);
        }
    });
};
// reload task
function loadTask(listId) {

    $("[name='t" + listId + "']").remove();
    $("[name='t" + listId + "']").empty();

    $.ajax({
        url: '/Task/getTask',
        method: 'GET',
        dataType: 'json',
        data: {
            id: listId
        },
        success: function (data) {
            $.each(data.tasks, function (i, task) {
                var uTask = '<p class="list-group-item customListChild ' + task.IsDone + '" name="t' + data.listId + '" Id="t' + task.ID + '">' +
                    task.Description +
                    '<span class="float-right customFontABinTask">' +
                    '<i class="far fa-trash-alt d-inline" name="taskBin" id=tb' + task.ID + '></i>' +
                    '</span></p>';
                $("[name='i" + data.listId + "']").after(uTask);
                $("[name='t" + data.listId + "']").show();
            });
        },
        error: function (response) {
            //alert(response.responseText);
        }
    });
};