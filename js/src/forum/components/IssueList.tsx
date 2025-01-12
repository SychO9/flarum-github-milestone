import app from 'flarum/forum/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import Dropdown from 'flarum/common/components/Dropdown';
import IssueListItem from './IssueListItem';
import type IssueListState from '../states/IssueListState';
import type Mithril from 'mithril';
import Stream from 'flarum/common/utils/Stream';
import InfoTile from 'flarum/common/components/InfoTile';

export interface IIssueListAttrs extends ComponentAttrs {
  state: IssueListState;
  activeState: Stream<string>;
}

export default class IssueList<CustomAttrs extends IIssueListAttrs = IIssueListAttrs> extends Component<CustomAttrs> {
  protected filters = {
    state: {
      options: ['all', 'closed', 'open'],
    },
  };

  oninit(vnode: Mithril.Vnode<CustomAttrs, any>) {
    super.oninit(vnode);
  }

  view() {
    let loadingMore: any = <LoadingIndicator />;

    if (!this.attrs.state.isLoadingNext()) {
      loadingMore = (
        <Button className="Button" onclick={() => this.attrs.state.loadNext()}>
          {app.translator.trans('sycho-github-milestone.forum.load_more')}
        </Button>
      );
    }

    if (!this.attrs.state.hasNext() && !this.attrs.state.isLoadingNext()) loadingMore = '';

    const issuesVnodes: Mithril.Vnode[] = [];

    this.attrs.state.getAllItems().forEach((issue) => {
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
        {this.attrs.state.isLoading() ? (
          <LoadingIndicator />
        ) : (
          <div className="GithubMilestone-issuesContainer DiscussionList DiscussionList--floatingTags">
            {issuesVnodes.length > 0 ? (
              <ul className="GithubMilestone-issuesList DiscussionList-discussions">{issuesVnodes}</ul>
            ) : (
              <InfoTile icon="fas fa-check">{app.translator.trans('sycho-github-milestone.forum.empty_list')}</InfoTile>
            )}
            <div className="DiscussionList-loadMore">{loadingMore}</div>
          </div>
        )}
      </div>
    );
  }

  changeState(state: string) {
    this.attrs.activeState(state);
    this.attrs.state.refreshParams({ filter: { state } }, 1);
  }

  viewItems() {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'state',
      <Dropdown buttonClassName="Button" label={app.translator.trans(`sycho-github-milestone.forum.${this.attrs.activeState()}`)}>
        {this.filters.state.options.map((state) => {
          const active = state === this.attrs.activeState();

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
    const items = new ItemList<Mithril.Children>();

    //

    return items;
  }
}
