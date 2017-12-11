package anonymous.feedback

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
    }
}
