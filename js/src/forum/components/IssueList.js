import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import IssueListItem from './IssueListItem';

export default class IssueList extends Component {
  init() {
    this.octokit = this.props.octokit;
    this.issues = [];
    this.load();
  }

  view() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    return [
      <div className="GithubMilestone-navigation"></div>,
      <div className="GithubMilestone-issues">
        {this.issues.map((issue) => (
          <IssueListItem issue={issue} />
        ))}
      </div>,
    ];
  }

  load() {
    this.loading = true;

    this.octokit
      .request('GET /repos/:owner/:repo/issues?milestone=:milestone&sort=:sort&state=:state&page=:page&per_page=:perPage', {
        owner: 'flarum',
        repo: 'core',
        milestone: 17,
        sort: 'updated',
        state: 'all',
        page: 1,
        perPage: 15,
      })
      .then(this.handleResponse.bind(this));
  }

  handleResponse(response) {
    this.issues = response.data;
    this.loading = false;
    m.redraw();
  }
}
