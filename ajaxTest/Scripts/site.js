token = $('input[name="__RequestVerificationToken"]').val();

$(document).ready(() => {

    loadData();

    $("#btnSave").on("click", initiateNewList);
    $("#listName").keyup((event) => { if (event.keyCode === 13) initiateNewList });

});

///
function loadData() {

    $("#taskList children").remove();
    jQuery('#taskList').empty();

    $.ajax({
        url: '/List/getList',
        method: 'GET',
        dataType: 'json',
        success: (data) => {
            $.each(data, (i, lists) => {

                generateHtml(lists);
                eventHandler();

            });
        },
        error: (response) => { handleError(response) }
    });
};
function generateHtml(lists) {

    var uList =
        `<p class="list-group-item customList" name="listedElement" id="${lists.ID}">
                    ${lists.Name} 
                    <span class="float-right customFontABin">
                    <i class="far fa-trash-alt d-inline" name="bin" id="b${lists.ID}"></i>
                    </span></p>`;
    $('#taskList').append(uList);

    $.each(lists.Tasks, (i, task) => {
        var uTask =
            `<p class="list-group-item customListChild ${task.IsDone}" name="t${lists.ID}" id="t${task.ID}">
                        ${task.Description}
                        <span class="float-right customFontABinTask">
                        <i class="far fa-trash-alt d-inline" name="taskBin" id="tb${task.ID}"></i>
                        </span></p>`;
        $("#" + lists.ID).after(uTask);
    });

    var uListInputBar =
        `<div class="list-group-item customListChild" name="i${lists.ID}">
                    <input autofocus type="text" name="taskDesc" class="col-12 d-inline list-group-item customInput" Id="i${ lists.ID}" placeholder="Add new task..." required="" />
                    <span class="float-right customFontAPlus">
                    <i class="fas fa-plus-circle" name="addTask" id="p${lists.ID}"></i>
                    </span>
                    </div>`;
    $("#" + lists.ID).after(uListInputBar);
    $("#" + lists.ID).slideDown();

}

function eventHandler() {

    //lists events 
    $(document).on("click", "[name='bin']", initiateDeleteList);

    //task events
    $(document).on("click", "[name='addTask']", initiateNewTask);
    $(document).on("focus", "[name='taskDesc']", () => {
        $(this).off('keyup');
        $(this).on('keyup', (event) => { if (event.keyCode == 13) initiateNewList });
    });
    $(document).on("focusout", "[name='taskDesc']", () => {
        $(this).off('keyup');
    });
    $(document).on("click", ".customListChild", initiateUpdateTask);
    $(document).on("click", "[name='taskBin']", initiateDeleteTask);
}

function initiateNewList(event) {
    if ($("#listName").val()) addList(event);
    else $("#listName").effect("shake");
}
function initiateDeleteList() {
    var binID = event.target.id.slice(1);
    deleteList(binID);
}

function addList(event) {
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
        success: (response) => {
            if (response.success) {
                $('input').val('');
                loadData();
            }
        },
        error: (response) => { handleError(response) }
    }).always(() => { $("#btnSave").disabled = false; });
};
function deleteList(ID) {
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
            success: () => { loadData(); },
            error: (errormessage) => { handleError(response) }
        });
    }
}

///

function loadTask(listId) {

    $(`[name='t${listId}']`).remove();
    $(`[name='t${listId}']`).empty();

    $.ajax({
        url: '/Task/getTask',
        method: 'GET',
        dataType: 'json',
        data: {
            id: listId
        },
        success: (data) => {
            $.each(data.tasks, (i, task) => {

                generateTaskHtml(data, task);

            });
        },
        error: (response) => { handleError(response) }
    });
};
function generateTaskHtml(data, task) {
    var uTask =
        `<p class="list-group-item customListChild ' ${task.IsDone}" name="t${data.listId}" Id="t${task.ID}">
                    ${task.Description} 
                    <span class="float-right customFontABinTask">
                    <i class="far fa-trash-alt d-inline" name="taskBin" id="tb${task.ID}"></i>
                    </span></p>`;
    $(`[name='i${data.listId}']`).after(uTask);
    $(`[name='t${data.listId}']`).show();
}

function addTask(listId, event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    $.ajax({
        url: '/Task/createTask',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            __RequestVerificationToken: token,
            listID: listId,
            Description: $("#i" + listId).val()
        },
        success: () => {
            $("#i" + listId).val('');
            loadTask(listId);
        },
        error: (response) => { handleError(response) }
    });
};
function updateTask(taskId, isdone, event) {

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
        success: () => {
            if (isdone) $("#t" + taskId).removeClass("false").addClass("true");
            else $("#t" + taskId).removeClass("true").addClass("false");
        },
        error: (response) => { handleError(response) }
    });
};
function deleteTask(listId, taskId) {
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
            success: () => { loadTask(listId) },
            error: (response) => { handleError(response) }
        });
    }
}

function initiateNewTask(event) {
    var listId = event.target.id.slice(1);
    if ($("#i" + listId).val()) addTask(listId, event);
    else $("#i" + listId).effect("shake");
}
function initiateUpdateTask(event) {
    if (event.target === event.currentTarget) {
        var taskId = event.target.id.slice(1);
        if ($(event.currentTarget).hasClass("false")) updateTask(taskId, true, event);
        else if ($(event.currentTarget).hasClass("true")) updateTask(taskId, false, event);
    }
}
function initiateDeleteTask(event) {
    var taskBinID = event.target.id.slice(2);
    var listId = $(event.currentTarget).parent().parent().attr('name').slice(1);
    deleteTask(listId, taskBinID);
}

//

function handleError(response) {
    console.log(response.responseText);
    alert('Something goes worng :<');
}