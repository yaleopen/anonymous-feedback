package com.instructure.canvas

import grails.gorm.transactions.Transactional
import org.grails.web.json.JSONArray

@Transactional
class ExternalToolService extends CanvasAPIBaseService {

    def listExternalToolsForCourse(String courseId, String searchTerm) {
        def resp = restClient.get("${canvasBaseURL}/api/v1/courses/${courseId}/external_tools?search_term=${searchTerm}&include_parents=true"){
            auth("Bearer ${oauthToken}")
        }
        if(resp.status != 200){
            return []
        }
        JSONArray respArr = (JSONArray) resp.json
        def resultList = new ArrayList<>(respArr)
        return resultList
    }
}
