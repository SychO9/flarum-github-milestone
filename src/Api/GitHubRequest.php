<?php

namespace SychO\GithubMilestone\Api;

use Github\Client;
use Github\ResultPager;

class GitHubRequest
{
    protected array $params = [];

    public function __construct(
        protected string $owner,
        protected string $repo,
        protected int $milestoneId,
    ) {
    }

    public function param(string $key, string $value): self
    {
        $this->params[$key] = $value;

        return $this;
    }

    public function key(): string
    {
        return 'sycho-github-milestone.issues-'.$this->owner.'-'.$this->repo.'-'.$this->milestoneId.'-'.md5(serialize($this->params));
    }

    public function get(): array
    {
        $client = new Client();

        $api = $client->api('issue');

        $paginator  = new ResultPager($client, $this->params['per_page'] ?? null);

        $params = array_merge([
            'milestone' => $this->milestoneId,
            'state' => 'all',
            'sort' => 'updated',
        ], $this->params);

        $result = $paginator->fetchAll($api, 'all', [$this->owner, $this->repo, $params]);

        return [
            'data' => $result,
            'meta' => [
                'has_next' => $paginator->hasNext(),
            ],
        ];
    }
}
