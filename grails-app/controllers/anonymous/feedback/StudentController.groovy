package anonymous.feedback

class StudentController {

    def index(){

    }

    def save(Feedback feedback){
        if(feedback.hasErrors()){
            flash.error = 'Error submitting feedback. Please try again.'
        }
        else{
            feedback.save(flush: true)
            flash.success = 'Feedback Submitted'
        }
        redirect(action:'index')
    }
}
