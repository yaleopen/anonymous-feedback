package com.instructure.canvas

import grails.gorm.transactions.Transactional
import grails.plugins.rest.client.RestResponse
import org.grails.web.json.JSONArray

import java.text.SimpleDateFormat

@Transactional
class EnrollmentTermService extends CanvasAPIBaseService {

    List<EnrollmentTerm> listEnrollmentTerms() {
        def resp = restClient.get(canvasBaseURL + '/api/v1/accounts/1/terms'){
            auth('Bearer ' + oauthToken)
        }
        JSONArray respArr = (JSONArray) resp.json.enrollment_terms
        List<EnrollmentTerm> resultList = new ArrayList<EnrollmentTerm>(respArr)
        processResponsePages(resp,resultList)
        return resultList
    }

    List<Long> listActiveTerms(){
        List<EnrollmentTerm> allTerms = listEnrollmentTerms()
        def utcFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
        allTerms.retainAll {
            it.end_at && utcFormat.parse(it.end_at.replaceAll("Z", "+0000")).after(new Date())
        }
        return allTerms.id
    }

    EnrollmentTerm getEnrollmentTermByStartDate(String startDate){
        def enrollmentTerms = listEnrollmentTerms()
        return enrollmentTerms.find{
            def termStart = it.start_at ? it.start_at.split('T')[0] : it.start_at
            termStart == startDate
        }
    }

    @Override
    <T> void processResponsePages(RestResponse resp, List<T> firstPage){
        def nextPage = canvasNextPage(resp)
        while(nextPage != null){
            resp = restClient.get(nextPage){
                auth('Bearer ' + oauthToken)
            }
            firstPage.addAll((JSONArray) resp.json.enrollment_terms)
            nextPage = canvasNextPage(resp)
        }
    }
}
