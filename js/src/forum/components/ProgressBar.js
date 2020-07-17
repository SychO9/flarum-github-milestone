import Component from 'flarum/Component';

export default class ProgressBar extends Component {
  view() {
    let className = 'GithubMilestone-progress ' + (this.props.className || '');

    if (this.props.mini) className += 'GithubMilestone-progress--mini';

    return (
      <div className={className}>
        <div className="GithubMilestone-progressBar" style={{ width: `${this.getProgress()}%` }} />
      </div>
    );
  }

  getProgress() {
    return this.props.progress;
  }
}
