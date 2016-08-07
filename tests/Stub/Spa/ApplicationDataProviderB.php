<?php

namespace Sokil\FrontendBundle\Stub\Spa;

use Sokil\FrontendBundle\Spa\ApplicationDataProviderInterface;

class ApplicationDataProviderB implements ApplicationDataProviderInterface
{
    public function getData()
    {
        return [
            'b' => 2,
        ];
    }
}