package anonymous.feedback

import grails.converters.JSON

class InstructorController {

    def index() {
        String courseId = session.courseId
        [feedbackList: Feedback.findAllByCourseId(courseId)]
    }

    def updateFeedbackAsRead(){
        String courseId = session.courseId
        def feedback = Feedback.get(params.id as Long)
        feedback.isRead = true
        def updatedFeedback = feedback.save(flush:true)
        return updatedFeedback as JSON
    }
}
