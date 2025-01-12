import Model from 'flarum/common/Model';
import type Milestone from './Milestone';

export default class Issue extends Model {
  htmlUrl = Model.attribute<string>('htmlUrl');
  title = Model.attribute<string>('title');
  body = Model.attribute<string>('body');
  state = Model.attribute<'closed' | 'open' | null>('state');
  stateReason = Model.attribute<string | null>('stateReason');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
  comments = Model.attribute<number>('comments');
  pullRequest = Model.attribute<any>('pullRequest');
  user = Model.attribute<any>('user');
  labels = Model.attribute<any[]>('labels');

  milestone = Model.hasOne<Milestone>('milestone');
}
