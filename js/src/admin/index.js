import GithubMilestoneSettingsModal from './modals/GithubMilestoneSettingsModal';

app.initializers.add('sycho-github-milestone', (app) => {
  app.extensionSettings['sycho-github-milestone'] = () => app.modal.show(GithubMilestoneSettingsModal);
});
