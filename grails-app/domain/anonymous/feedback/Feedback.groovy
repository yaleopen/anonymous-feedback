package anonymous.feedback

import grails.rest.Resource

@Resource(uri='/comments')
class Feedback {

    String courseId
    String sectionId
    Date dateCreated
    Boolean isRead
    String message

    static constraints = {
    }

    static mapping = {
        message type: 'text'
        version false
        sort dateCreated: "desc"
    }
}