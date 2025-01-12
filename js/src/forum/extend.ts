import Extend from 'flarum/common/extenders';
import MilestonePage from './components/MilestonePage';
import Issue from './models/Issue';
import Milestone from './models/Milestone';

export default [
  new Extend.Routes() //
    .add('githubMilestone', '/milestone', MilestonePage),

  new Extend.Store() //
    .add('github-issues', Issue)
    .add('github-milestones', Milestone),
];
