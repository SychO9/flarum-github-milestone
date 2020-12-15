app.initializers.add('sycho-github-milestone', (app) => {
  app.extensionData
    .for('sycho-github-milestone')
    .registerSetting({
      setting: 'sycho-github-milestone.repository',
      type: 'text',
      label: [
        app.translator.trans('sycho-github-milestone.admin.repository'),
        ' (',
        app.translator.trans('sycho-github-milestone.admin.repository_example'),
        ')',
      ],
    })
    .registerSetting({
      setting: 'sycho-github-milestone.milestone_id',
      type: 'number',
      label: app.translator.trans('sycho-github-milestone.admin.milestone'),
    })
    .registerSetting({
      setting: 'sycho-github-milestone.default_filter',
      type: 'select',
      options: {
        all: app.translator.trans('sycho-github-milestone.admin.all'),
        open: app.translator.trans('sycho-github-milestone.admin.open'),
        closed: app.translator.trans('sycho-github-milestone.admin.closed'),
      },
      default: 'all',
      label: app.translator.trans('sycho-github-milestone.admin.default_filter'),
    });
});
