import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';

import MilestonePage from './components/MilestonePage';

app.initializers.add('sycho-github-milestone', (app) => {
  const repository = app.data.resources[0].attributes['sycho-github-milestone.repository'];
  const milestone_id = app.data.resources[0].attributes['sycho-github-milestone.milestone_id'];

  if (!repository || !milestone_id) return;

  app.routes.githubMilestone = {
    path: '/milestone',
    component: MilestonePage,
  };

  extend(IndexPage.prototype, 'navItems', (navItems) => {
    navItems.add(
      'githubMilestone',
      <LinkButton href={app.route('githubMilestone')} icon="fab fa-github-alt">
        {app.translator.trans('sycho-github-milestone.forum.title')}
      </LinkButton>,
      100
    );

    return navItems;
  });
});
