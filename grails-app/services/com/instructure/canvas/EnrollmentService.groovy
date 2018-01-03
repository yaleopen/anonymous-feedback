package com.instructure.canvas

import grails.gorm.transactions.Transactional
import org.grails.web.json.JSONArray

@Transactional
class EnrollmentService extends CanvasAPIBaseService {

    List<Enrollment> listSectionEnrollmentsByRole(String sectionId, String role) {
        def resp = restClient.get("${canvasBaseURL}/api/v1/sections/${sectionId}/enrollments?role[]=${role}"){
            auth("Bearer ${oauthToken}")
        }
        JSONArray respArr = (JSONArray) resp.json
        List<Enrollment> resultList = new ArrayList<Enrollment>(respArr)
        processResponsePages(resp,resultList)
        return resultList
    }
}
