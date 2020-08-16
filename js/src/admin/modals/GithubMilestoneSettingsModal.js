import SettingsModal from 'flarum/components/SettingsModal';

export default class GithubMilestoneSettingsModal extends SettingsModal {
  init() {
    super.init();

    this.repository = this.setting('sycho-github-milestone.repository');
    this.milestoneId = this.setting('sycho-github-milestone.milestone_id');
  }

  title() {
    return app.translator.trans('core.admin.extensions.settings_button');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('sycho-github-milestone.admin.repository')}</label>
        <input
          className="FormControl"
          value={this.repository()}
          oninput={m.withAttr('value', this.repository)}
          placeholder={app.translator.trans('sycho-github-milestone.admin.repository_example')}
        />
      </div>,
      <div className="Form-group">
        <label>{app.translator.trans('sycho-github-milestone.admin.milestone')}</label>
        <input type="number" className="FormControl" value={this.milestoneId()} oninput={m.withAttr('value', this.milestoneId)} />
      </div>,
    ];
  }
}
