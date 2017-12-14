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

    def downloadFeedbackStats(){
        def courseIds = Feedback.withCriteria {
            projections {
                distinct("courseId")
            }
        }
        def headers = ['Course Name', 'SubAccount Name', 'Course Id', 'Feedback Count']
        response.setContentType("text/csv")
        response.setHeader("Content-disposition", "filename=\"feedback-stats.csv\"")
        def outs = response.outputStream
        outs << headers.join(',') + '\n'
        courseIds.each{courseId->
            def feedbackByCourse = Feedback.findAllByCourseId(courseId as String)
            def commonFeedback = feedbackByCourse.get(0)
            def row = [commonFeedback.courseName, commonFeedback.subaccountName, commonFeedback.courseId, feedbackByCourse.size()]
            outs << row.join(',') + '\n'
        }
        outs.flush()
        outs.close()
    }
}
