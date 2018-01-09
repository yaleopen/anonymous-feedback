package anonymous.feedback

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
        "404"(view:'/notFound')
        "/term/$termCode"(controller: 'admin', action: 'deleteByTerm', method: 'DELETE')
        "/reset"(controller: 'admin', action: 'deleteAll', method: 'DELETE')
    }
}
