<%--
  Created by IntelliJ IDEA.
  User: iao4
  Date: 12/6/17
  Time: 3:41 PM
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="main"/>
</head>

<body>
    <g:if test="${flash.success}">
        <div class="alert alert-success" role="alert">
            ${flash.success}
        </div>
    </g:if>
    <g:elseif test="${flash.error}">
        <div class="alert alert-danger" role="alert">
            ${flash.error}
        </div>
    </g:elseif>
    <form action="/feedback/student/save" method="post">
        <g:hiddenField name="courseId" value="${session.courseId}"/>
        <g:hiddenField name="sectionId" value="${session.sectionIds}"/>
        <g:hiddenField name="isRead" value="false"/>
        <div class="form-group">
            <label for="feedbackTextArea">Your comment</label>
            <textarea class="form-control" id="feedbackTextArea" name="message" rows="3" maxlength="1000"></textarea>
        </div>
        <div class="row">
            <div class="col">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    </form>
</body>
</html>