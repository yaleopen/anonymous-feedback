package anonymous.feedback

import org.imsglobal.lti.launch.LtiVerificationResult
import org.imsglobal.lti.launch.LtiVerifier

class LTIController {

    def launch() {
        // Log incoming request
        log.debug("Request URL: " + request.getRequestURL().toString())
        log.debug("Query String: " + request.getQueryString())
        log.debug("HTTP Method: " + request.getMethod())
        for (header in request.getHeaderNames()) {
            log.debug("${header}:${request.getHeader(header)}")
        }
        for (param in request.getParameterMap()) {
            log.debug("${param.key}:${param.value}")
            //println "${param.key}:${param.value}"
        }

        // Authenticate initial LTI Request and store request params
        if (request.getParameter("oauth_consumer_key") != null) {
            LtiVerifier ltiVerifier = new LtiOauthVerifierSSL()
            def ltiSecret = grailsApplication.config.getProperty('canvas.ltiSecret')
            LtiVerificationResult ltiResult = ltiVerifier.verify(request, ltiSecret)
            if (ltiResult.success) {
                def roles = params.custom_membership_roles as String
                println roles
                def roleList = roles.split(',')
                if(roleList.contains('Instructor')){
                    redirect(controller: 'instructor', action: 'index', absolute: true)
                }
                else if(roleList.contains('StudentEnrollment') || roleList.contains('Shopper') || roleList.contains('Auditor')){
                    redirect(controller: 'student', action: 'index', absolute: true)
                }
                else{
                    render(view: 'error')
                }

            } else {
                log.error("LTI Result not SUCCESS: " + ltiResult.getMessage())
                respond ltiResult
            }
        }
    }
}