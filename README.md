# Anonymous Feedback for Canvas
Collect course feedback anonymously. More info [here](http://help.canvas.yale.edu/m/55452/l/705131-anonymous-feedback-tool)

## Dev Setup
1. Install [Grails 3.3.2](https://grails.org/download.html#sdkman)

2. Create environment variables for `application.yml` properties
    ```yaml
    grails:
        mail:
            host: '${MAIL_HOST}'
            default:
                from: '${MAIL_FROM_ADDRESS}'
                replyTo: '${MAIL_REPLYTO_ADDRESS}'
    environments:
        development:
            canvas:
                oauthToken: '${CANVAS_API_TOKEN}'
                canvasBaseUrl: '${CANVAS_BASE_URL}'
                ltiSecret: '${ANONYMOUS_FEEDBACK_SECRET}'
                #Enable instructor reminders for this term
                emailTermCode: '${ANONYMOUS_FEEDBACK_EMAIL_TERM}'
            dataSource:
                username: '${DB_USERNAME}'
                password: '${DB_PASSWORD}'
    ```
    
3. Build & Run: `grails run-app`

4. Install LTI in Canvas via XML Config
    ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <cartridge_basiclti_link xmlns="http://www.imsglobal.org/xsd/
   imslticc_v1p0"
       xmlns:blti = "http://www.imsglobal.org/xsd/imsbasiclti_v1p0"
       xmlns:lticm ="http://www.imsglobal.org/xsd/imslticm_v1p0"
       xmlns:lticp ="http://www.imsglobal.org/xsd/imslticp_v1p0"
       xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation = "http://www.imsglobal.org/xsd/imslticc_v1p0
   http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd
       http://www.imsglobal.org/xsd/imsbasiclti_v1p0 http://
   www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0.xsd
       http://www.imsglobal.org/xsd/imslticm_v1p0 http://
   www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd
       http://www.imsglobal.org/xsd/imslticp_v1p0 http://
   www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd">
       <blti:launch_url>https://<HOST>:8080/feedback/LTI/launch</blti:launch_url>
       <blti:title>Anonymous Feedback</blti:title>
       <blti:description>Tool for posting anonymous feedback</blti:description>
       <blti:extensions platform="canvas.instructure.com">
         <lticm:property name="privacy_level">public</lticm:property>
         <lticm:options name="course_navigation">
           <lticm:property name="default">disabled</lticm:property>
           <lticm:property name="enabled">true</lticm:property>
           <lticm:options name="custom_fields">
               <lticm:property name="membership_roles">$Canvas.membership.roles</lticm:property>
               <lticm:property name="section_ids">$Canvas.course.sectionIds</lticm:property>
               <lticm:property name="subaccount_name">$Canvas.account.name</lticm:property>
               <lticm:property name="course_name">$Canvas.course.name</lticm:property>
               <lticm:property name="isrootaccountadmin">$Canvas.user.isRootAccountAdmin</lticm:property>
               <lticm:property name="termstartat">$Canvas.term.startAt</lticm:property>
           </lticm:options>
         </lticm:options>
       </blti:extensions>
   </cartridge_basiclti_link>
    ```



