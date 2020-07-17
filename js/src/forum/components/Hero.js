import Component from 'flarum/Component';

export default class Hero extends Component {
  view() {
    const title = this.props.title;
    const subtitle = this.props.subtitle;

    delete this.props.title;
    delete this.props.subtitle;

    this.props.className = 'Hero ' + (this.props.className || '');

    return (
      <header {...this.props}>
        <div className="container">
          <div className="containerNarrow">
            <h2 className="Hero-title">{title}</h2>
            <div className="Hero-subtitle">{subtitle}</div>
          </div>
        </div>
      </header>
    );
  }
}
