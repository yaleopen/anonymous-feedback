package anonymous.feedback


class AuthInterceptor {

    AuthInterceptor() {
        matchAll()
                .excludes(controller: 'LTI')
                .excludes(uri: "/")
    }

    boolean before() {
        if (!session.oauthSignature) {
            render(status: 401, text: 'Access denied')
            return false
        }
        true
    }

    boolean after() { true }

    void afterView() {
        // no-op
    }
}
