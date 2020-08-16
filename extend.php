<?php

/**
 * @package Flarum GitHub Milestone Activity
 * @author Sami "SychO" Mazouz (https://github.com/SychO9)
 * @version 0.1.0
 * @license MIT
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new FoF\Extend\Extend\ExtensionSettings())
        ->setPrefix('sycho-github-milestone.')
        ->addKeys(['repository', 'milestone_id']),
];
