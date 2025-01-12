import app from 'flarum/forum/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import humanTime from 'flarum/common/utils/humanTime';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import Icon from 'flarum/common/components/Icon';
import Tooltip from 'flarum/common/components/Tooltip';
import octicons from '../utils/octicons';
import ProgressBar from 'ext:sycho/flarum-uikit/common/components/ProgressBar';
import LabelGroup from 'ext:sycho/flarum-uikit/common/components/LabelGroup';
import Label from 'ext:sycho/flarum-uikit/common/components/Label';
import tagsLabel from 'ext:flarum/tags/common/helpers/tagsLabel';
import type Issue from '../models/Issue';

export interface IIssueListItemAttrs extends ComponentAttrs {
  issue: Issue;
}

export default class IssueListItem<CustomAttrs extends IIssueListItemAttrs = IIssueListItemAttrs> extends Component<CustomAttrs> {
  view() {
    const issue = this.attrs.issue;

    return (
      <div class="DiscussionListItem">
        <div class="DiscussionListItem-content">
          <div class="DiscussionListItem-author">
            <Tooltip
              text={app.translator.trans('core.forum.discussion_list.started_text', {
                username: issue.user().login,
                ago: humanTime(issue.createdAt()),
              })}
              position="right"
            >
              <a class="DiscussionListItem-author-avatar" href={issue.user().html_url}>
                <img class="Avatar" loading="lazy" src={issue.user().avatar_url} alt="" />
              </a>
            </Tooltip>
            <ul class="DiscussionListItem-badges badges badges--packed">{listItems(this.badgeItems(issue).toArray())}</ul>
          </div>
          <a href={issue.htmlUrl()} class="DiscussionListItem-main">
            <h2 class="DiscussionListItem-title">{issue.title()}</h2>
            <ul class="DiscussionListItem-info">{listItems(this.infoItems(issue).toArray())}</ul>
          </a>
          <div class="DiscussionListItem-stats">
            <span class="DiscussionListItem-stats-item DiscussionListItem-count">
              <span class="DiscussionListItem-stats-item-icon">
                <i aria-hidden="true" class="icon far fa-comment"></i>
              </span>
              <span class="DiscussionListItem-stats-item-label">
                <span aria-hidden="true">{issue.comments()}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  getTasks() {
    const pendingTasksCount = (this.attrs.issue.body().match(/\r\n- \[ \]/g) || []).length;
    const doneTasksCount = (this.attrs.issue.body().match(/\r\n- \[x\]/g) || []).length;

    return {
      current: doneTasksCount,
      total: doneTasksCount + pendingTasksCount,
    };
  }

  badgeItems(issue: Issue) {
    const items = new ItemList();

    let type: 'issue' | 'pull' = 'issue';
    let state: 'closed' | 'open' | 'merged' | null = issue.state();

    if (issue.pullRequest()) {
      type = 'pull';

      if (issue.pullRequest().merged_at) {
        state = 'merged';
      }
    }

    if (issue.state() === 'closed' && issue.stateReason() === 'completed') {
      state = 'merged';
    }

    if (state) {
      items.add(
        'state',
        <span className={`Badge GithubMilestone-Badge`} style={{ backgroundColor: octicons[type][state].color }}>
          {octicons[type][state].icon}
        </span>
      );
    }

    return items;
  }

  infoItems(issue: Issue) {
    const items = new ItemList();

    items.add(
      'terminalPost',
      <span>
        <Icon name="far fa-clock" /> {app.translator.trans('sycho-github-milestone.forum.last_updated', { time: humanTime(issue.updatedAt()) })}
      </span>
    );

    const tasks = this.getTasks();

    if (tasks.total) {
      items.add(
        'github-tasks',
        <span>
          <Icon name="fas fa-tasks" />{' '}
          {app.translator.trans('sycho-github-milestone.forum.tasks_done', {
            number: tasks.current,
            total: tasks.total,
          })}
          <ProgressBar progress={(tasks.current * 100) / tasks.total} mini={true} />
        </span>
      );
    }

    if ('flarum-tags' in flarum.extensions) {
      items.add(
        'tags',
        tagsLabel(
          issue.labels().map((l) => ({
            color: () => '#' + l.color,
            name: () => l.name,
            isChild: () => false,
            slug: () => l.name,
            icon: () => null,
          }))
        )
      );
    } else {
      items.add(
        'github-labels',
        <LabelGroup>
          {issue.labels().map((label) => (
            <Label color={label.color}>{label.name}</Label>
          ))}
        </LabelGroup>
      );
    }

    return items;
  }
}
