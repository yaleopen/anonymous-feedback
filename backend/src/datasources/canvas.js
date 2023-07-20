const debug = require('debug')('app:datasources:canvasAPI');
const { RESTDataSource } = require('apollo-datasource-rest');

class CanvasAPI extends RESTDataSource {
  baseURL = process.env.API_CANVAS_URL;

  // The below line will be able to populate the Bearer field for the case where
  // we are not calling the CanvasAPI through Apollo, but instead doing it
  // directly (without access to context)
  APIToken = process.env.API_CANVAS_TOKEN;

  willSendRequest(request) {
    request.headers.set(
      'Authorization',
      `Bearer ${this.context ? this.context.canvas_api_token : this.APIToken}`
    );
  }

  async getInstructorEmailsForCourse(courseId) {
    debug(`Getting instructors for course`, courseId);
    const result = await this.get(
      `/api/v1/courses/${courseId}/users?include[]=email&enrollment_role_id=9`
    );
    const emails = [];
    result.forEach((person) => {
      emails.push(person.email);
    });
    return emails;
  }

  async getExternalToolID(courseId) {
    debug('Getting Feedback Tool ID for course', courseId);
    const result = await this.get(
      `/api/v1/courses/${courseId}/external_tools`,
      {
        per_page: 100,
        search_term: 'feedback',
        include_parents: true,
      }
    ).catch((err) => null);
    if (result == null) {
      return null;
    }
    const toolId = result.find(
      (tool) => new URL(tool.url).pathname === '/anon-feedback'
    )?.id;
    debug(toolId);
    return toolId;
  }

  async getTermName(termCode) {
    debug(`Getting canvas term from term code`, termCode);
    const result = await this.get(
      `/api/v1/accounts/1/terms/sis_term_id:${termCode}`
    );
    return result.name;
  }
}

module.exports = CanvasAPI;
