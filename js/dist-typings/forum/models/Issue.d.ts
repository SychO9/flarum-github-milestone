import Model from 'flarum/common/Model';
import type Milestone from './Milestone';
export default class Issue extends Model {
    htmlUrl: () => string;
    title: () => string;
    body: () => string;
    state: () => "open" | "closed" | null;
    stateReason: () => string | null;
    createdAt: () => Date | null | undefined;
    updatedAt: () => Date | null | undefined;
    comments: () => number;
    pullRequest: () => any;
    user: () => any;
    labels: () => any[];
    milestone: () => false | Milestone;
}
