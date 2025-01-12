import Component, { type ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type IssueListState from '../states/IssueListState';
import type Mithril from 'mithril';
import Stream from 'flarum/common/utils/Stream';
export interface IIssueListAttrs extends ComponentAttrs {
    state: IssueListState;
    activeState: Stream<string>;
}
export default class IssueList<CustomAttrs extends IIssueListAttrs = IIssueListAttrs> extends Component<CustomAttrs> {
    protected filters: {
        state: {
            options: string[];
        };
    };
    oninit(vnode: Mithril.Vnode<CustomAttrs, any>): void;
    view(): JSX.Element;
    changeState(state: string): void;
    viewItems(): ItemList<Mithril.Children>;
    actionItems(): ItemList<Mithril.Children>;
}
