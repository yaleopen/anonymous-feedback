package anonymous.feedback

class AdminController {

    def deleteByTerm() {
        String termCode = params.termCode
        Feedback.where{
            termCode == "${termCode}"
        }.deleteAll()
    }

    def deleteAll() {
        Feedback.executeUpdate("delete from Feedback")
    }
}
