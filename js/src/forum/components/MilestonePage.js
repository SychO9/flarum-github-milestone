import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import Page from 'flarum/common/components/Page';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import humanTime from 'flarum/common/utils/humanTime';
import Icon from 'flarum/common/components/Icon';
import IssueList from './IssueList';
import { Octokit } from '@octokit/rest';
import Hero from './Hero';
import ProgressBar from 'ext:sycho/flarum-uikit/common/components/ProgressBar';

export default class MilestonePage extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.octokit = new Octokit();
    this.settings = {
      repository: {
        owner: app.forum.attribute('sycho-github-milestone.repository').split('/')[0],
        name: app.forum.attribute('sycho-github-milestone.repository').split('/')[1],
      },
      milestone: app.forum.attribute('sycho-github-milestone.milestone_id'),
    };
    this.milestone = {};
    this.progress = 0;

    this.load();
  }

  view() {
    return (
      <div className="IndexPage">
        {this.loading ? (
          <Hero title={<LoadingIndicator />} />
        ) : (
          <Hero
            title={this.milestone.title}
            subtitle={[
              <div className="GithubMilestone-details">{listItems(this.milestoneDetails().toArray())}</div>,
              <ProgressBar fancy={true} alternate={true} progress={this.progress} />,
            ]}
          />
        )}
        <div className="container">
          <div className="sideNavContainer">
            <nav className="IndexPage-nav sideNav">
              <ul>{listItems(IndexSidebar.prototype.items().toArray())}</ul>
            </nav>
            <div className="IndexPage-results sideNavOffset">
              {this.loading ? <LoadingIndicator /> : <IssueList octokit={this.octokit} milestone={this.milestone} />}
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
        <strong>
          <Icon name="fas fa-clock" />
        </strong>{' '}
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
        owner: this.settings.repository.owner,
        repo: this.settings.repository.name,
        milestone_number: this.settings.milestone,
      })
      .then(this.handleResponse.bind(this));
  }

  handleResponse(response) {
    this.milestone = { repository: this.settings.repository, ...response.data };
    this.progress = Math.round((this.milestone.closed_issues * 100) / (this.milestone.closed_issues + this.milestone.open_issues));
    this.loading = false;
    m.redraw();
  }
}
