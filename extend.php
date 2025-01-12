<?php

namespace SychO\GithubMilestone;

use Flarum\Extend;

return [
    new \SychO\UiKit\Extend\Register(),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less')
        ->route('/milestone', 'sycho-github-milestone.milestone'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Settings)
        ->serializeToForum('sycho-github-milestone.repository', 'sycho-github-milestone.repository')
        ->serializeToForum('sycho-github-milestone.milestone_id', 'sycho-github-milestone.milestone_id')
        ->serializeToForum('sycho-github-milestone.default_filter', 'sycho-github-milestone.default_filter'),

    (new Extend\ApiResource(Api\Resource\GitHubIssuesResource::class)),

    (new Extend\ApiResource(Api\Resource\GitHubMilestonesResource::class)),
];
