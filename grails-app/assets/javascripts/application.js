// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require_tree .
//= require_self

$(document).ready(function() {
    var instructorFeedbackTable = $('#instructorFeedbackTable').DataTable({
        lengthChange: false,
        buttons: [
            {
                extend: 'csvHtml5',
                text: 'Download CSV',
                title: 'feedback-export',
                exportOptions: {
                    columns: [ 1, 3 ]
                }
            }
        ],
        select: {
            style:    'multi',
            selector: 'td:first-child'
        },
        columnDefs: [
            {
                orderable: false,
                className: 'select-checkbox',
                targets:   0
            }
        ]
    } );

    instructorFeedbackTable.buttons().container().appendTo( '#instructorFeedbackTable_wrapper .col-md-6:eq(0)' );
} );

$("[id^='feedbackModal_']").on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    var feedbackId = modal.attr("id").split('_')[1];
    var feedbackRow = $("#feedbackRow_" + feedbackId);
    var feedbackStatus = $("#feedbackStatus_" + feedbackId);
    if(feedbackStatus.html() === 'Unread'){
        $.ajax({
            method: "POST",
            dataType: 'json',
            url: "/feedback/comments/" + feedbackId,
            headers: {"X-HTTP-Method-Override": "PUT"},
            data: { "isRead" : "true" }
        }).done(function( msg ) {
            feedbackStatus.html('Read');
            feedbackRow.addClass("table-secondary");
        });
    }
});
