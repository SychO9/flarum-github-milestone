<?php

namespace SychO\GithubMilestone\Api\Resource;

use Flarum\Api\Resource\AbstractResource;
use Flarum\Api\Schema;

class GitHubMilestonesResource extends AbstractResource
{
    public function type(): string
    {
        return 'github-milestones';
    }

    public function fields(): array
    {
        return [

            Schema\Str::make('htmlUrl'),
            Schema\Str::make('title'),
            Schema\Str::make('state'),
            Schema\Integer::make('openIssues'),
            Schema\Integer::make('closedIssues'),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),
            Schema\DateTime::make('dueOn')
                ->nullable(),
            Schema\DateTime::make('closedAt')
                ->nullable(),

        ];
    }
}
