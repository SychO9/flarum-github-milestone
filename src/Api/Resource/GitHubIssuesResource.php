<?php

namespace SychO\GithubMilestone\Api\Resource;

use Exception;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractResource;
use Flarum\Api\Resource\Contracts\Listable;
use Flarum\Api\Resource\Contracts\Paginatable;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use SychO\GithubMilestone\Api\GitHubRequest;
use Tobyz\JsonApiServer\Context;
use Tobyz\JsonApiServer\Pagination\OffsetPagination;
use Tobyz\JsonApiServer\Schema\CustomFilter;

class GitHubIssuesResource extends AbstractResource implements Listable, Paginatable
{
    protected bool $hasNext = false;

    public function __construct(
        protected Repository $cache,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function type(): string
    {
        return 'github-issues';
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->visible(function () {
                    return ! empty($this->settings->get('sycho-github-milestone.repository'))
                        && count(explode('/', $this->settings->get('sycho-github-milestone.repository'))) === 2
                        && ! empty($this->settings->get('sycho-github-milestone.milestone_id'));
                })
                ->meta([
                    Schema\Boolean::make('hasNext')
                        ->get(fn () => $this->hasNext)
                ])
                ->defaultInclude(['milestone'])
                ->paginate(),
        ];
    }

    public function fields(): array
    {
        return [

            Schema\Str::make('htmlUrl'),
            Schema\Str::make('title'),
            Schema\Str::make('body'),
            Schema\Str::make('state')
                ->nullable(),
            Schema\Str::make('stateReason')
                ->nullable(),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),
            Schema\Number::make('comments'),
            Schema\Arr::make('pullRequest')
                ->nullable(),
            Schema\Arr::make('user')
                ->nullable(),
            Schema\Arr::make('labels')
                ->nullable(),

            Schema\Relationship\ToOne::make('milestone')
                ->type('github-milestones')
                ->includable(),

        ];
    }

    public function sorts(): array
    {
        return [
            //
        ];
    }

    public function filters(): array
    {
        return [
            CustomFilter::make('state', function (object $query, ?string $value) {
                if ($value) {
                    /** @var GitHubRequest $query */
                    $query->param('state', $value);
                }
            }),
        ];
    }

    public function query(Context $context): object
    {
        $repository = explode('/', $this->settings->get('sycho-github-milestone.repository'));

        return new GitHubRequest(
            $repository[0],
            $repository[1],
            (int) $this->settings->get('sycho-github-milestone.milestone_id')
        );
    }

    /** @var GitHubRequest $query */
    public function paginate(object $query, OffsetPagination $pagination): void
    {
        $offset = $pagination->offset;
        $limit = $pagination->limit;

        $page = $offset / $limit + 1;

        $query->param('page', $page)->param('per_page', $pagination->limit);
    }

    /** @var GitHubRequest $query */
    public function results(object $query, Context $context): iterable
    {
        /** @var array $json */
        $json = $this->cache->remember($query->key(), 60 * 60 * 2, function () use ($query) {
            return $query->get();
        });

        if (! empty($json['data']) && ! isset($json['data'][0]['html_url'])) {
            $this->cache->forget($query->key());

            throw new Exception('Invalid response from GitHub API');
        }

        $this->hasNext = $json['meta']['has_next'];

        return (new Collection($json['data']))
            ->map(function (array $attributes) {
                $attributes['milestone'] = (object) array_combine(
                    array_map(fn ($key) => Str::camel($key), array_keys($attributes['milestone'])),
                    array_values($attributes['milestone'])
                );

                return (object) array_combine(
                    array_map(fn ($key) => Str::camel($key), array_keys($attributes)),
                    array_values($attributes)
                );
            });
    }
}
