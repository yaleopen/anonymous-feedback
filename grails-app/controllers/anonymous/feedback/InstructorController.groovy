package anonymous.feedback

import grails.converters.JSON

class InstructorController {

    def index() {
        String courseId = session.courseId
        String contextTitle = session.contextTitle
        def feedbackList = Feedback.findAllByCourseId(courseId)
        if(contextTitle.endsWith('.UMB')){
            String sectionIds = session.sectionIds
            def sectionIdList = sectionIds.split(',') as List
            feedbackList.retainAll{feedback->
                sectionIdList.intersect(feedback.sectionId.split(',') as List).size() > 0
            }
        }
        [feedbackList: feedbackList]
    }

    def updateFeedbackAsRead(){
        String courseId = session.courseId
        def feedback = Feedback.get(params.id as Long)
        feedback.isRead = true
        def updatedFeedback = feedback.save(flush:true)
        return updatedFeedback as JSON
    }
}
