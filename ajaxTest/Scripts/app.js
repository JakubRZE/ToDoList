$(document).ready(function () {

    var token = $('input[name="__RequestVerificationToken"]').val();

    //load data
    loadData();

    // add new list by click
    $("#btnSave").on("click", function () {
        addList(token);
    });
    // by enter
    $(document).keyup(function (event) {
        if (event.keyCode === 13) {
            addList(token);
        }
    });

    //delete list
    $(document).on("click", "[name='bin']", function (event) {
        var binID = event.target.id;
        var strBinId = binID.slice(1);

        deleteData(strBinId, token);
        loadData();
    });
});


//add data function
function addList(token) {
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
};

//function for deleting 
function deleteData(ID, token) {
    if (confirm('Are you sure to delete this record ?') == true) {
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
                alert(errormessage.responseText);
            }
        });
    }
}

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
                    var uTask = '<p class="list-group-item customListChild" name="t' + lists.ID + '" Id="t' + task.ID + '">' + task.Description + '</p>';
                    var taskElementID = "#" + lists.ID;
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
                $("#" + lists.ID).after(uListInput);
                $("#" + lists.ID).slideDown();

            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};

