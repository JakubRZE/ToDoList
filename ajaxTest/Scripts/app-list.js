$(document).ready(() => {

    var token = $('input[name="__RequestVerificationToken"]').val();

    loadData();

    handleAddNewListByClick(token);
    handleAddNewListByEnter(token);

    handleDeleteList(token);

});

function handleAddNewListByClick(token) {
    $("#btnSave").on("click", (event) => valuesForList(event, token));
}

function handleAddNewListByEnter(token) {
    $("#listName").keyup((event) => { if (event.keyCode === 13) valuesForList(event, token) });
}

function handleDeleteList(token) {
    $(document).on("click", "[name='bin']", (event) => {
        var binID = event.target.id.slice(1);
        deleteList(binID, token);
    });
}


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
        success: (response) => {
            if (response.success) {
                $('input').val('');
                loadData();
            }
        },
        error: (response) => { handleError(response) }
    }).always(() => { $("#btnSave").disabled = false; });
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
            success: () => { loadData(); },
            error: (errormessage) => { handleError(response) }
        });
    }
}

function valuesForList(event, token) {
    if ($("#listName").val()) addList(token, event);
    else $("#listName").effect("shake");
}


function loadData() {

    $("#taskList children").remove();
    jQuery('#taskList').empty();

    $.ajax({
        url: '/List/getList',
        method: 'GET',
        dataType: 'json',
        success: (data) => {
            $.each(data, (i, lists) => {
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
            });
        },
        error: (response) => { handleError(response) }
    });
};

function handleError(response) {
    console.log(response.responseText);
    alert('Something goes worng :<');
}