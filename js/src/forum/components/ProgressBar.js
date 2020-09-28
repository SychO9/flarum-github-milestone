import Component from 'flarum/Component';

export default class ProgressBar extends Component {
  view() {
    let className = 'GithubMilestone-progress ' + (this.attrs.className || '');

    if (this.attrs.mini) className += 'GithubMilestone-progress--mini';

    return (
      <div className={className}>
        <div className="GithubMilestone-progressBar" style={{ width: `${this.getProgress()}%` }} />
      </div>
    );
  }

  getProgress() {
    return this.attrs.progress;
  }
}
