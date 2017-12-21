package anonymous.feedback

import grails.rest.Resource

@Resource(uri='/comments')
class Feedback {

    String courseId
    String sectionId
    Date dateCreated
    Boolean isRead
    String message
    String subaccountName
    String courseName
    String termCode

    static constraints = {
    }

    static mapping = {
        message type: 'text'
        sectionId type: 'text'
        version false
        sort dateCreated: "desc"
    }
}
