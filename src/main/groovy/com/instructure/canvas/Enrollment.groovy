package com.instructure.canvas

class Enrollment {
    Long id
    Long user_id
    Long course_id
    String type
    String created_at
    String updated_at
    Long associated_user_id
    String start_at
    String end_at
    Long course_section_id
    Long root_account_id
    Boolean limit_privileges_to_course_section
    String enrollment_state
    String role
    Long role_id
    String last_activity_at
    Integer total_activity_time
    Long sis_import_id
    def grades
    String sis_account_id
    String sis_course_id
    String course_integration_id
    String sis_section_id
    String section_integration_id
    String sis_user_id
    String html_url
    def user
}
