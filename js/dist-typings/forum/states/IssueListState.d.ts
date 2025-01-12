import PaginatedListState from 'flarum/common/states/PaginatedListState';
import type Issue from '../models/Issue';
export default class IssueListState extends PaginatedListState<Issue> {
    get type(): string;
    constructor(params?: {});
    getAllItems(): Issue[];
}
