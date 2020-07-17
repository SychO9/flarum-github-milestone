import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Button from 'flarum/components/Button';
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

    let loadingMore = <LoadingIndicator />;

    if (!this.loadingMore) {
      loadingMore = (
        <Button className="Button" onclick={this.load.bind(this, true)}>
          {app.translator.trans('sycho-github-milestone.forum.load_more')}
        </Button>
      );
    }

    if (!this.canLoadMore() && !this.loadingMore) loadingMore = '';

    return (
      <div className="GithubMilestone-issues">
        <div className="GithubMilestone-navigation"></div>
        <ul className="GithubMilestone-issuesList">
          {this.issues.map((issue) => (
            <li>
              <IssueListItem issue={issue} />
            </li>
          ))}
        </ul>
        <div className="DiscussionList-loadMore">{loadingMore}</div>
      </div>
    );
  }

  load(more) {
    this.page = this.page || 1;

    if (!more) this.loading = true;

    if (more) this.loadingMore = true;

    if (more && this.canLoadMore()) this.page++;

    this.octokit
      .request('GET /repos/:owner/:repo/issues?milestone=:milestone&sort=:sort&state=:state&page=:page&per_page=:perPage', {
        owner: 'flarum',
        repo: 'core',
        milestone: 17,
        sort: 'updated',
        state: 'all',
        page: this.page || 1,
        perPage: 15,
      })
      .then(this.handleResponse.bind(this, more));
  }

  handleResponse(more, response) {
    if (more) this.issues.push(...response.data);
    else this.issues = response.data;

    this.loading = false;
    this.loadingMore = false;

    m.redraw();
  }

  canLoadMore() {
    let totalIssues = this.props.milestone.closed_issues + this.props.milestone.open_issues;

    return this.issues.length < totalIssues;
  }
}
