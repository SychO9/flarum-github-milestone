import app from 'flarum/forum/app';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import Page, { type IPageAttrs } from 'flarum/common/components/Page';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import humanTime from 'flarum/common/utils/humanTime';
import Icon from 'flarum/common/components/Icon';
import PageStructure from 'flarum/forum/components/PageStructure';
import IssueList from './IssueList';
import Hero from './Hero';
import ProgressBar from 'ext:sycho/flarum-uikit/common/components/ProgressBar';
import type Mithril from 'mithril';
import IssueListState from '../states/IssueListState';
import type Milestone from '../models/Milestone';
import Stream from 'flarum/common/utils/Stream';

export default class MilestonePage extends Page<IPageAttrs, IssueListState> {
  protected settings: any = {};
  protected milestone?: Milestone;
  protected activeState = Stream(app.forum.attribute('sycho-github-milestone.default_filter') || 'all');

  oninit(vnode: Mithril.Vnode<IPageAttrs, IssueListState>) {
    super.oninit(vnode);

    this.state = new IssueListState();

    this.settings = {
      repository: {
        owner: app.forum.attribute<string | null | undefined>('sycho-github-milestone.repository')?.split('/')[0],
        name: app.forum.attribute<string | null | undefined>('sycho-github-milestone.repository')?.split('/')[1],
      },
      milestone: app.forum.attribute<string | null | undefined>('sycho-github-milestone.milestone_id'),
    };

    if (!this.settings.repository.owner || !this.settings.repository.name || !this.settings.milestone) {
      m.route.set('/');
      return;
    }

    this.state.refresh().then(() => {
      this.milestone = app.store.all<Milestone>('github-milestones')[0];
    });
  }

  view() {
    return (
      <PageStructure
        loading={this.state.isLoading()}
        className="MilestonePage"
        sidebar={() => <IndexSidebar />}
        hero={() => (
          <Hero
            title={this.milestone!.title()}
            subtitle={[
              <div className="GithubMilestone-details">{listItems(this.milestoneDetails().toArray())}</div>,
              <ProgressBar fancy={true} alternate={true} progress={this.progress()} />,
            ]}
          />
        )}
      >
        {this.state.isLoading() ? <LoadingIndicator /> : <IssueList state={this.state} milestone={this.milestone} activeState={this.activeState} />}
      </PageStructure>
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
        {app.translator.trans('sycho-github-milestone.forum.last_updated', { time: humanTime(this.milestone!.updatedAt()) })}
      </div>
    );

    items.add(
      'openIssues',
      <div className="GithubMilestone-detailsItem">
        <strong>{this.milestone!.openIssues()}</strong> {app.translator.trans('sycho-github-milestone.forum.open')}
      </div>
    );

    items.add(
      'closedIssues',
      <div className="GithubMilestone-detailsItem">
        <strong>{this.milestone!.closedIssues()}</strong> {app.translator.trans('sycho-github-milestone.forum.closed')}
      </div>
    );

    items.add(
      'progress',
      <div className="GithubMilestone-detailsItem">
        {app.translator.trans('sycho-github-milestone.forum.complete', {
          progress: this.progress(),
        })}
      </div>
    );

    return items;
  }

  progress(): number {
    if (!this.milestone) return 0;

    return Math.round((this.milestone!.closedIssues() * 100) / (this.milestone!.closedIssues() + this.milestone!.openIssues()));
  }
}
