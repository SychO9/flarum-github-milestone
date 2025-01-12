import Model from 'flarum/common/Model';
export default class Milestone extends Model {
    htmlUrl: () => string;
    title: () => string;
    state: () => string;
    openIssues: () => number;
    closedIssues: () => number;
    createdAt: () => Date | null | undefined;
    updatedAt: () => Date | null | undefined;
    dueOn: () => Date | null | undefined;
    closedAt: () => Date | null | undefined;
}
