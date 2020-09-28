import Component from 'flarum/Component';

export default class Hero extends Component {
  view() {
    const title = this.attrs.title;
    const subtitle = this.attrs.subtitle;

    delete this.attrs.title;
    delete this.attrs.subtitle;

    this.attrs.className = 'Hero ' + (this.attrs.className || '');

    return (
      <header {...this.attrs}>
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
