$(document).ready(() => {

    var token = $('input[name="__RequestVerificationToken"]').val();

    handleAddNewTaskByClick(token);
    handleAddNewTaskByEnter(token);

    handleUpdateTask(token);

    handleDeleteTask(token);

});


function handleAddNewTaskByClick(token){
    $(document).on("click", "[name='addTask']", (event) => valuesForTask(event, token));
}

function handleAddNewTaskByEnter(token) {
    $(document).on("focus", "[name='taskDesc']", () => {
        $(this).on('keyup', (event) => {
            if (event.keyCode == 13) {
                valuesForTask(event, token);
            };
        });
    });
}


function handleUpdateTask(token) {
    $(document).on("click", ".customListChild", (event) => {
        if (event.target === event.currentTarget) {
            var taskId = event.target.id.slice(1);
            if ($(event.currentTarget).hasClass("false")) updateTask(taskId, token, true, event);
            else if ($(event.currentTarget).hasClass("true")) updateTask(taskId, token, false, event);
        }
    });
}

function handleDeleteTask(token) {
    $(document).on("click", "[name='taskBin']", (event) => {
        var taskBinID = event.target.id.slice(2);
        var listId = $(event.currentTarget).parent().parent().attr('name').slice(1);
        deleteTask(listId, taskBinID, token);
    });
}


function addTask(listId, token, event) {

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
        success: () => {
            if (isdone) $("#t" + taskId).removeClass("false").addClass("true");
            else $("#t" + taskId).removeClass("true").addClass("false");
        },
        error: (response) => { handleError(response) }
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
            success: () => { loadTask(listId) },
            error: (response) => { handleError(response) }
        });
    }
}

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
                var uTask =
                    `<p class="list-group-item customListChild ' ${task.IsDone}" name="t${data.listId}" Id="t${task.ID}">
                    ${task.Description} 
                    <span class="float-right customFontABinTask">
                    <i class="far fa-trash-alt d-inline" name="taskBin" id="tb${task.ID}"></i>
                    </span></p>`;
                $(`[name='i${data.listId}']`).after(uTask);
                $(`[name='t${data.listId}']`).show();
            });
        },
        error: (response) => { handleError(response) }
    });
};

function valuesForTask(event, token) {
    var listId = event.target.id.slice(1);
    if ($("#i" + listId).val()) addTask(listId, token, event);
    else $("#i" + listId).effect("shake");
}