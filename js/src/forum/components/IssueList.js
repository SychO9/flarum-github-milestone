import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Button from 'flarum/components/Button';
import listItems from 'flarum/helpers/listItems';
import ItemList from 'flarum/utils/ItemList';
import Dropdown from 'flarum/components/Dropdown';
import IssueListItem from './IssueListItem';

export default class IssueList extends Component {
  oninit(vnode) {
    super.oninit(vnode);

    this.octokit = this.attrs.octokit;
    this.issues = new Map();
    this.mergedPrs = new Map();
    this.allMergedPrs = false;
    this.filters = {
      state: {
        value: app.data['sycho-github-milestone.default_filter'] || 'all',
        options: ['all', 'closed', 'open'],
      },
    };

    this.load();
  }

  view() {
    let loadingMore = <LoadingIndicator />;

    if (!this.loadingMore) {
      loadingMore = (
        <Button className="Button" onclick={this.load.bind(this, true)}>
          {app.translator.trans('sycho-github-milestone.forum.load_more')}
        </Button>
      );
    }

    if (!this.canLoadMore() && !this.loadingMore) loadingMore = '';

    const issuesVnodes = [];

    this.issues.forEach((issue) => {
      issuesVnodes.push(
        <li>
          <IssueListItem issue={issue} />
        </li>
      );
    });

    return (
      <div className="GithubMilestone-issues">
        <div className="IndexPage-toolbar">
          <ul className="IndexPage-toolbar-view">{listItems(this.viewItems().toArray())}</ul>
          <ul className="IndexPage-toolbar-action">{listItems(this.actionItems().toArray())}</ul>
        </div>
        {this.loading ? (
          <LoadingIndicator />
        ) : (
          <div className="GithubMilestone-issuesContainer">
            <ul className="GithubMilestone-issuesList">{issuesVnodes}</ul>
            <div className="DiscussionList-loadMore">{loadingMore}</div>
          </div>
        )}
      </div>
    );
  }

  load(more) {
    this.page = this.page || 1;

    if (!more) this.loading = true;

    if (more) this.loadingMore = true;

    if (more && this.canLoadMore()) this.page++;

    const issuesPromise = this.octokit.request(
      'GET /repos/:owner/:repo/issues?milestone=:milestone&sort=:sort&state=:state&page=:page&per_page=:perPage',
      {
        owner: this.attrs.milestone.repository.owner,
        repo: this.attrs.milestone.repository.name,
        milestone: this.attrs.milestone.number,
        sort: 'updated',
        state: this.filters.state.value,
        page: this.page || 1,
        perPage: 15,
      }
    );

    let mergedPrsPromise = [];

    if (!this.allMergedPrs) {
      mergedPrsPromise = this.octokit.search.issuesAndPullRequests({
        q: `repo:${this.attrs.milestone.repository.owner}/${this.attrs.milestone.repository.name} milestone:${this.attrs.milestone.title} is:merged is:pull-request`,
        state: 'merged',
        page: this.page || 1,
        per_page: 15,
      });
    }

    Promise.all([issuesPromise, mergedPrsPromise]).then(this.handleResponse.bind(this, more));
  }

  handleResponse(more, responses) {
    const [issues, mergedPrs] = responses;

    if (!this.allMergedPrs) {
      mergedPrs.data.items.map((pr) => {
        this.mergedPrs.set(pr.id, pr);
      });

      if (this.mergedPrs.size >= mergedPrs.data.total_count) this.allMergedPrs = true;
    }

    if (!more) this.issues.clear();

    issues.data.map((issue) => {
      this.issues.set(issue.id, issue);
    });

    this.mergedPrs.forEach((pr) => {
      if (this.issues.has(pr.id)) this.issues.get(pr.id).state = 'merged';
    });

    this.loading = false;
    this.loadingMore = false;

    m.redraw();
  }

  changeState(state) {
    this.filters.state.value = state;
    this.page = 1;

    this.load();
  }

  refresh() {
    this.page = 1;

    this.load();
  }

  canLoadMore() {
    let totalIssues;

    switch (this.filters.state.value) {
      case 'all':
        totalIssues = this.attrs.milestone.closed_issues + this.attrs.milestone.open_issues;
        break;
      default:
        totalIssues = this.attrs.milestone[`${this.filters.state.value}_issues`];
    }

    return this.issues.size < totalIssues;
  }

  viewItems() {
    const items = new ItemList();

    items.add(
      'state',
      <Dropdown buttonClassName="Button" label={app.translator.trans(`sycho-github-milestone.forum.${this.filters.state.value}`)}>
        {this.filters.state.options.map((state) => {
          const active = state === this.filters.state.value;

          return (
            <Button icon={active ? 'fas fa-check' : ' '} onclick={this.changeState.bind(this, state)} active={active}>
              {app.translator.trans(`sycho-github-milestone.forum.${state}`)}
            </Button>
          );
        })}
      </Dropdown>
    );

    return items;
  }

  actionItems() {
    const items = new ItemList();

    items.add(
      'refresh',
      Button.component({
        title: app.translator.trans('core.forum.index.refresh_tooltip'),
        icon: 'fas fa-sync',
        className: 'Button Button--icon',
        onclick: this.refresh.bind(this),
      })
    );

    return items;
  }
}
