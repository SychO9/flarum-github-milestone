import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Button from 'flarum/components/Button';
import listItems from 'flarum/helpers/listItems';
import ItemList from 'flarum/utils/ItemList';
import Dropdown from 'flarum/components/Dropdown';
import IssueListItem from './IssueListItem';

export default class IssueList extends Component {
  init() {
    this.octokit = this.props.octokit;
    this.issues = [];
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
            <ul className="GithubMilestone-issuesList">
              {this.issues.map((issue) => (
                <li>
                  <IssueListItem issue={issue} />
                </li>
              ))}
            </ul>
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

    this.octokit
      .request('GET /repos/:owner/:repo/issues?milestone=:milestone&sort=:sort&state=:state&page=:page&per_page=:perPage', {
        owner: this.props.milestone.repository.owner,
        repo: this.props.milestone.repository.name,
        milestone: this.props.milestone.number,
        sort: 'updated',
        state: this.filters.state.value,
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
        totalIssues = this.props.milestone.closed_issues + this.props.milestone.open_issues;
        break;
      default:
        totalIssues = this.props.milestone[`${this.filters.state.value}_issues`];
    }

    return this.issues.length < totalIssues;
  }

  viewItems() {
    const items = new ItemList();

    items.add(
      'state',
      Dropdown.component({
        buttonClassName: 'Button',
        label: app.translator.trans(`sycho-github-milestone.forum.${this.filters.state.value}`),
        children: this.filters.state.options.map((state) => {
          const active = state === this.filters.state.value;

          return Button.component({
            children: app.translator.trans(`sycho-github-milestone.forum.${state}`),
            icon: active ? 'fas fa-check' : ' ',
            onclick: this.changeState.bind(this, state),
            active,
          });
        }),
      })
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
