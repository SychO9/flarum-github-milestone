import PaginatedListState from 'flarum/common/states/PaginatedListState';
import type Issue from '../models/Issue';

export default class IssueListState extends PaginatedListState<Issue> {
  get type(): string {
    return 'github-issues';
  }

  constructor(params = {}) {
    super(params);
  }

  public getAllItems(): Issue[] {
    return super.getAllItems();
  }
}
