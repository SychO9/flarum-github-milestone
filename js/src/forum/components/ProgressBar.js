import Component from 'flarum/Component';

export default class ProgressBar extends Component {
  view() {
    return (
      <div className="GithubMilestone-progress">
        <div className="GithubMilestone-progressBar" style={{ width: `${this.getProgress()}%` }} />
      </div>
    );
  }

  getProgress() {
    return this.props.progress;
  }
}
