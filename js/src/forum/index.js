import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import LinkButton from 'flarum/components/LinkButton';

import MilestonePage from './components/MilestonePage';

app.initializers.add('sycho-github-milestone', (app) => {
  app.routes.githubMilestone = {
    path: '/milestone',
    component: MilestonePage.component(),
  };

  extend(IndexPage.prototype, 'navItems', (navItems) => {
    navItems.add(
      'githubMilestone',
      LinkButton.component({
        href: app.route('githubMilestone'),
        children: app.translator.trans('sycho-github-milestone.forum.title'),
        icon: 'fab fa-github-alt',
      }),
      100
    );

    return navItems;
  })
});
