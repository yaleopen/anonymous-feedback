<%--
  Created by IntelliJ IDEA.
  User: iao4
  Date: 12/6/17
  Time: 3:39 PM
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="main"/>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.10.16/b-1.5.0/b-html5-1.5.0/sl-1.2.4/datatables.min.css"/>
    <script type="text/javascript" src="https://cdn.datatables.net/v/bs4/dt-1.10.16/b-1.5.0/b-html5-1.5.0/sl-1.2.4/datatables.min.js"></script>
</head>

<body>
    <table id="instructorFeedbackTable" class="table table-bordered" width="100%" cellspacing="0">
        <thead class="thead-dark">
            <tr>
                <th scope="col"></th>
                <th scope="col">Comment</th>
                <th scope="col">Status</th>
                <th scope="col">Date Posted</th>
            </tr>
        </thead>
        <tbody>
            <g:each var="feedback" in="${feedbackList}">
                <tr id="feedbackRow_${feedback.id}" class="${feedback.isRead ? 'table-secondary' : ''}">
                    <td></td>
                    <td>
                        <button type="button" class="btn btn-link" data-toggle="modal" data-target="#feedbackModal_${feedback.id}" data-backdrop="static">
                            <span class="d-inline-block text-truncate" style="max-width: 600px;">
                                ${feedback.message}
                            </span>
                        </button>
                    </td>
                    <td id="feedbackStatus_${feedback.id}">${feedback.isRead ? 'Read' : 'Unread'}</td>
                    <td><g:formatDate date="${feedback.dateCreated}" type="datetime" style="MEDIUM" timeStyle="LONG"/></td>
                </tr>
                <div id="feedbackModal_${feedback.id}" class="modal fade" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Comment</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p class="mb-0">${feedback.message}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </g:each>
        </tbody>
    </table>

</body>
</html>