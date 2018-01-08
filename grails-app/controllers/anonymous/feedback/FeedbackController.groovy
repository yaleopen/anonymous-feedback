package anonymous.feedback

class FeedbackController {

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
