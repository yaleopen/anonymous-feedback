package com.instructure.canvas

import grails.gorm.transactions.Transactional
import org.grails.web.json.JSONObject

@Transactional
class UsersService extends CanvasAPIBaseService {

    UserProfile getUserProfile(String userId){
        def resp = restClient.get(canvasBaseURL + '/api/v1/users/' + userId + '/profile'){
            auth('Bearer ' + oauthToken)
        }
        UserProfile user = new UserProfile((JSONObject)resp.json)
        return user
    }
}
