package anonymous.feedback

import grails.converters.JSON

class InstructorController {

    def index() {
        String courseId = session.courseId
        def feedbackList = Feedback.findAllByCourseId(courseId)
        String sectionIds = session.sectionIds
        def sectionIdList = sectionIds.split(',') as List
        feedbackList.retainAll{feedback->
            sectionIdList.intersect(feedback.sectionId.split(',') as List).size() > 0
        }
        [feedbackList: feedbackList]
    }

    def updateFeedbackAsRead(){
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
        def headers = ['Term Code', 'Course Name', 'SubAccount Name', 'Course Id', 'Section Id', 'Feedback Count']
        response.setContentType("text/csv")
        response.setHeader("Content-disposition", "filename=\"feedback-stats-${new Date().format('yyyy-MM-dd-HHmm', TimeZone.getTimeZone('EST'))}.csv\"")
        def outs = response.outputStream
        outs << headers.join(',') + '\n'
        courseIds.each{courseId->
            def feedbackByCourse = Feedback.findAllByCourseId(courseId as String)
            Map sectionIdCount = [:]
            feedbackByCourse.sectionId.each{sectionIdArr->
                sectionIdArr.tokenize(',').each{sectionId->
                    println sectionId
                    def count = sectionIdCount.get(sectionId) ? ++sectionIdCount.get(sectionId) : 1
                    sectionIdCount.put(sectionId,count)
                }
            }
            def commonFeedback = feedbackByCourse.get(0)
            sectionIdCount.each{sectionId,feedbackCount->
                def row = [commonFeedback.termCode, commonFeedback.courseName, commonFeedback.subaccountName, commonFeedback.courseId, sectionId, feedbackCount]
                outs << row.join(',') + '\n'
            }
        }
        outs.flush()
        outs.close()
    }
}
