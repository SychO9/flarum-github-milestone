import Component from 'flarum/Component';
import humanTime from 'flarum/utils/humanTime';
import listItems from 'flarum/helpers/listItems';
import ItemList from 'flarum/utils/ItemList';
import icon from 'flarum/helpers/icon';
import { uikit } from '@sycho-uikit';
import octicons from '../utils/octicons';

const { ProgressBar, LabelGroup, Label } = uikit;

export default class IssueListItem extends Component {
  view() {
    const issue = this.attrs.issue;

    return (
      <div className="DiscussionListItem">
        <div className="DiscussionListItem-content">
          <div className="DiscussionListItem-author" title="">
            <img className="Avatar" src={issue.user.avatar_url} />
          </div>
          <ul className="DiscussionListItem-badges badges">{listItems(this.badgeItems(issue).toArray())}</ul>
          <a href={issue.html_url} className="DiscussionListItem-main">
            <h3 className="DiscussionListItem-title">{issue.title}</h3>
            <ul className="DiscussionListItem-info">{listItems(this.infoItems(issue).toArray())}</ul>
          </a>
          <span className="DiscussionListItem-count" title="">
            {issue.comments}
          </span>
        </div>
      </div>
    );
  }

  getTasks() {
    const pendingTasksCount = (this.attrs.issue.body.match(/\r\n- \[ \]/g) || []).length;
    const doneTasksCount = (this.attrs.issue.body.match(/\r\n- \[x\]/g) || []).length;

    return {
      current: doneTasksCount,
      total: doneTasksCount + pendingTasksCount,
    };
  }

  badgeItems(issue) {
    const items = new ItemList();

    let type = 'issue';
    let state = issue.state;

    if (issue.pull_request) type = 'pull';

    items.add(
      'state',
      <span className={`Badge GithubMilestone-Badge`} style={{ backgroundColor: octicons[type][state].color }}>
        {octicons[type][state].icon}
      </span>
    );

    return items;
  }

  infoItems(issue) {
    const items = new ItemList();

    items.add(
      'terminalPost',
      <span>
        {icon('far fa-clock')} {app.translator.trans('sycho-github-milestone.forum.last_updated', { time: humanTime(issue.updated_at) })}
      </span>
    );

    const tasks = this.getTasks();

    if (tasks.total) {
      items.add(
        'tasks',
        <span>
          {icon('fas fa-tasks')}{' '}
          {app.translator.trans('sycho-github-milestone.forum.tasks_done', {
            number: tasks.current,
            total: tasks.total,
          })}
          <ProgressBar progress={(tasks.current * 100) / tasks.total} mini={true} />
        </span>
      );
    }

    items.add(
      'issues',
      <LabelGroup>
        {issue.labels.map((label) => (
          <Label color={label.color}>{label.name}</Label>
        ))}
      </LabelGroup>
    );

    return items;
  }
}
