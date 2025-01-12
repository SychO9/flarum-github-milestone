import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';

export default [
  new Extend.Admin()
    .setting(() => ({
      setting: 'sycho-github-milestone.repository',
      type: 'text',
      label: app.translator.trans('sycho-github-milestone.admin.repository', {}, true),
      placeholder: 'ex: flarum/framework',
    }))
    .setting(() => ({
      setting: 'sycho-github-milestone.milestone_id',
      type: 'number',
      label: app.translator.trans('sycho-github-milestone.admin.milestone', {}, true),
    }))
    .setting(() => ({
      setting: 'sycho-github-milestone.default_filter',
      type: 'select',
      options: {
        all: app.translator.trans('sycho-github-milestone.admin.all', {}, true),
        open: app.translator.trans('sycho-github-milestone.admin.open', {}, true),
        closed: app.translator.trans('sycho-github-milestone.admin.closed', {}, true),
      },
      default: 'all',
      label: app.translator.trans('sycho-github-milestone.admin.default_filter', {}, true),
    })),
];
