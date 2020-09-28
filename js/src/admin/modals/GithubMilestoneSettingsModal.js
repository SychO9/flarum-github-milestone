import SettingsModal from 'flarum/components/SettingsModal';
import Select from 'flarum/components/Select';
import withAttr from 'flarum/utils/withAttr';

export default class GithubMilestoneSettingsModal extends SettingsModal {
  oninit(vnode) {
    super.oninit(vnode);

    this.repository = this.setting('sycho-github-milestone.repository');
    this.milestoneId = this.setting('sycho-github-milestone.milestone_id');
    this.defaultFilter = this.setting('sycho-github-milestone.default_filter', 'all');

    this.filters = {
      all: app.translator.trans('sycho-github-milestone.admin.all'),
      open: app.translator.trans('sycho-github-milestone.admin.open'),
      closed: app.translator.trans('sycho-github-milestone.admin.closed'),
    };
  }

  title() {
    return app.translator.trans('core.admin.extensions.settings_button');
  }

  className() {
    return 'GithubMilestoneSettingsModal Modal--small';
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('sycho-github-milestone.admin.repository')}</label>
        <input
          className="FormControl"
          value={this.repository()}
          oninput={withAttr('value', this.repository)}
          placeholder={app.translator.trans('sycho-github-milestone.admin.repository_example')}
        />
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('sycho-github-milestone.admin.milestone')}</label>
        <input type="number" className="FormControl" value={this.milestoneId()} oninput={withAttr('value', this.milestoneId)} />
      </div>,

      <div className="Form-group">
        <label>{app.translator.trans('sycho-github-milestone.admin.default_filter')}</label>
        <Select options={this.filters} onchange={this.defaultFilter} value={this.defaultFilter()} />
      </div>,
    ];
  }
}
