import Component from 'flarum/Component';
import humanTime from 'flarum/utils/humanTime';
import listItems from 'flarum/helpers/listItems';
import ItemList from 'flarum/utils/ItemList';
import icon from 'flarum/helpers/icon';
import tagsLabel from 'flarum/tags/helpers/tagsLabel';
import Tag from 'flarum/tags/models/Tag';

export default class IssueListItem extends Component {
  view() {
    const issue = this.props.issue;

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

  badgeItems(issue) {
    const items = new ItemList();
    const type = { icon: 'fas fa-exclamation', state: 'Badge--issueOpen' };

    if (issue.pull_request) type.icon = 'fas fa-code-branch';

    if (issue.state === 'closed') type.state = 'Badge--issueClosed';

    items.add('state', <span className={`Badge ${type.state}`}>{icon(type.icon)}</span>);

    return items;
  }

  infoItems(issue) {
    const items = new ItemList();

    items.add(
      'terminalPost',
      <span>{app.translator.trans('sycho-github-milestone.forum.last_updated', { time: humanTime(issue.updated_at) })}</span>
    );

    items.add(
      'tags',
      tagsLabel(
        issue.labels.map((label) => {
          label.color = '#' + label.color;

          return new Tag({ attributes: label });
        })
      )
    );

    return items;
  }
}
