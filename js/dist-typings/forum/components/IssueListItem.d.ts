/// <reference types="mithril" />
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Issue from '../models/Issue';
export interface IIssueListItemAttrs extends ComponentAttrs {
    issue: Issue;
}
export default class IssueListItem<CustomAttrs extends IIssueListItemAttrs = IIssueListItemAttrs> extends Component<CustomAttrs> {
    view(): JSX.Element;
    getTasks(): {
        current: number;
        total: number;
    };
    badgeItems(issue: Issue): ItemList<unknown>;
    infoItems(issue: Issue): ItemList<unknown>;
}
