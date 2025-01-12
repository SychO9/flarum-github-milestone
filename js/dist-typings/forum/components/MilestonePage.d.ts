import Page, { type IPageAttrs } from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import IssueListState from '../states/IssueListState';
import type Milestone from '../models/Milestone';
export default class MilestonePage extends Page<IPageAttrs, IssueListState> {
    protected settings: any;
    protected milestone?: Milestone;
    protected activeState: any;
    oninit(vnode: Mithril.Vnode<IPageAttrs, IssueListState>): void;
    view(): JSX.Element;
    milestoneDetails(): ItemList<unknown>;
    progress(): number;
}
