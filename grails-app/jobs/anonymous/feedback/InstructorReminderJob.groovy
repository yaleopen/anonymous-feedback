package anonymous.feedback

import grails.core.GrailsApplication

class InstructorReminderJob {
    def enrollmentService
    def usersService
    def mailService
    GrailsApplication grailsApplication

    static triggers = {
        cron name: 'FeedbackSchedule', cronExpression: "0 0 7 * * ?"
    }

    def execute() {
        def unreadSections = [:]
        def emailTermCode = grailsApplication.config.getProperty('canvas.emailTermCode')
        //get all unread feedback
        def feedbackCriteria = Feedback.createCriteria()
        //unread feedback [[courseId,sectionIds]]
        def unreadFeedback = feedbackCriteria.list {
            and{
                eq("isRead", false)
                eq("termCode", emailTermCode)
            }
            projections {
                distinct(['courseId', 'sectionId'])
            }
        }
        //populate unreadSectionsMap [sectionId:courseId]
        unreadFeedback.each{courseAndSection ->
            def courseId = courseAndSection[0]
            def sectionIds = courseAndSection[1].split(',') as List
            sectionIds.each{sectionId ->
                if(!unreadSections.containsKey(sectionId)){
                    unreadSections.put(sectionId,courseId)
                }
            }
        }
        //populate courseNames
        def unreadCourseIds = unreadSections.values() as Set
        def courseNames = [:]
        unreadCourseIds.each{courseId->
            courseNames.put(courseId,Feedback.findByCourseId(courseId as String).courseName)
        }
        Map<Long,List> instructorInfo = [:]
        def instructorEmails = [:]
        unreadSections.each {sectionId,courseId->
            def enrollments = enrollmentService.listSectionEnrollmentsByRole(sectionId as String,"Instructor")
            enrollments.each{enrollment->
                //populate instructorInfo
                if(!instructorInfo.containsKey(enrollment.user_id)){
                    instructorInfo.put(enrollment.user_id,[courseId])
                }
                else if(!instructorInfo.get(enrollment.user_id).contains(courseId)){
                    instructorInfo.get(enrollment.user_id).add(courseId)
                }
                //populate instructorEmails
                if(!instructorEmails.containsKey(enrollment.user_id)){
                    def user = usersService.getUserProfile(enrollment.user_id as String)
                    instructorEmails.put(enrollment.user_id,user.primary_email)
                }
            }
        }
        def canvasBaseUrl = grailsApplication.config.getProperty('canvas.canvasBaseUrl')
        def feedbackExtID = grailsApplication.config.getProperty('canvas.feedbackExtID')
        def feedbackURLTemplate = "${canvasBaseUrl}/courses/:courseId/external_tools/${feedbackExtID}"
        instructorEmails.each{userId,emailAddress->
            if(emailAddress){
                println "sending reminder to ${emailAddress}"
                mailService.sendMail {
                    to emailAddress
                    subject "New Anonymous Feedback"
                    html view: "/emailTemplate", model: [courseIds: instructorInfo.get(userId), courseNames: courseNames, feedbackURLTemplate: feedbackURLTemplate]
                }
            }
        }
    }
}
