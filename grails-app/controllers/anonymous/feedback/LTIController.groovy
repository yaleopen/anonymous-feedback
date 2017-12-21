package anonymous.feedback

import org.imsglobal.lti.launch.LtiVerificationResult
import org.imsglobal.lti.launch.LtiVerifier

class LTIController {

    def enrollmentTermService

    def launch() {
        // Log incoming request
        log.debug("Request URL: " + request.getRequestURL().toString())
        log.debug("Query String: " + request.getQueryString())
        log.debug("HTTP Method: " + request.getMethod())
        for (header in request.getHeaderNames()) {
            log.info("${header}:${request.getHeader(header)}")
        }
        for (param in request.getParameterMap()) {
            log.info("${param.key}:${param.value}")
        }

        // Authenticate initial LTI Request and store request params
        if (request.getParameter("oauth_consumer_key") != null) {
            LtiVerifier ltiVerifier = new LtiOauthVerifierSSL()
            def ltiSecret = grailsApplication.config.getProperty('canvas.ltiSecret')
            LtiVerificationResult ltiResult = ltiVerifier.verify(request, ltiSecret)
            if (ltiResult.success) {
                //save session parameters
                session["courseId"] = params.custom_canvas_course_id
                session["sectionIds"] = params.custom_section_ids
                session["contextTitle"] = params.context_title
                session["subaccountName"] = params.custom_subaccount_name
                session["courseName"] = params.custom_course_name
                session["isAdmin"] = params.custom_isrootaccountadmin
                def roles = params.custom_membership_roles as String
                def roleList = roles.split(',')
                if(roleList.contains('Instructor')){
                    redirect(controller: 'instructor', action: 'index', absolute: true)
                }
                else if(roleList.contains('StudentEnrollment') || roleList.contains('Shopper') || roleList.contains('Auditor')){
                    def enrollmentStatus = params.custom_canvas_enrollment_state
                    String termStartDate = params.custom_termstartat.split()[0]
                    session["termCode"] = enrollmentTermService.getEnrollmentTermByStartDate(termStartDate).sis_term_id
                    if(enrollmentStatus == 'active'){
                        redirect(controller: 'student', action: 'index', absolute: true)
                    }
                }
                render(view: 'error')
            } else {
                log.error("LTI Result not SUCCESS: " + ltiResult.getMessage())
                respond ltiResult
            }
        }
    }
}