import Model from 'flarum/common/Model';

export default class Milestone extends Model {
  htmlUrl = Model.attribute<string>('htmlUrl');
  title = Model.attribute<string>('title');
  state = Model.attribute<string>('state');
  openIssues = Model.attribute<number>('openIssues');
  closedIssues = Model.attribute<number>('closedIssues');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
  dueOn = Model.attribute('dueOn', Model.transformDate);
  closedAt = Model.attribute('closedAt', Model.transformDate);
}
