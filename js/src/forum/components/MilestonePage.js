import Page from 'flarum/components/Page';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';
import ItemList from 'flarum/utils/ItemList';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import humanTime from 'flarum/utils/humanTime';
import icon from 'flarum/helpers/icon';
import IssueList from './IssueList';
import { Octokit } from '@octokit/rest';
import ProgressBar from './ProgressBar';
import Hero from './Hero';

export default class MilestonePage extends Page {
  init() {
    super.init();

    this.octokit = new Octokit();
    this.milestone = {};
    this.progress = 0;
    this.load();
  }

  view() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="IndexPage">
        <Hero
          title={this.milestone.title}
          subtitle={[
            <div className="GithubMilestone-details">{listItems(this.milestoneDetails().toArray())}</div>,
            <ProgressBar progress={this.progress} />,
          ]}
        />
        <div className="container">
          <div className="sideNavContainer">
            <nav className="IndexPage-nav sideNav">
              <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
            </nav>
            <div className="IndexPage-results sideNavOffset">
              <IssueList octokit={this.octokit} milestone={this.milestone} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  milestoneDetails() {
    const items = new ItemList();

    items.add(
      'updatedAt',
      <div className="GithubMilestone-detailsItem">
        <strong>{icon('fas fa-clock')}</strong>{' '}
        {app.translator.trans('sycho-github-milestone.forum.last_updated', { time: humanTime(this.milestone.updated_at) })}
      </div>
    );

    items.add(
      'openIssues',
      <div className="GithubMilestone-detailsItem">
        <strong>{this.milestone.open_issues}</strong> {app.translator.trans('sycho-github-milestone.forum.open')}
      </div>
    );

    items.add(
      'closedIssues',
      <div className="GithubMilestone-detailsItem">
        <strong>{this.milestone.closed_issues}</strong> {app.translator.trans('sycho-github-milestone.forum.closed')}
      </div>
    );

    items.add(
      'progress',
      <div className="GithubMilestone-detailsItem">
        <strong>{this.progress}%</strong> {app.translator.trans('sycho-github-milestone.forum.complete')}
      </div>
    );

    return items;
  }

  load() {
    this.loading = true;

    this.octokit.issues
      .getMilestone({
        owner: 'flarum',
        repo: 'core',
        milestone_number: 17,
      })
      .then(this.handleResponse.bind(this));
  }

  handleResponse(response) {
    this.milestone = response.data;
    this.progress = parseInt((this.milestone.closed_issues * 100) / (this.milestone.closed_issues + this.milestone.open_issues));
    this.loading = false;
    m.redraw();
  }
}
