<?php

namespace Sokil\FrontendBundle\Stub\Spa;

use Sokil\FrontendBundle\Spa\ApplicationDataProviderInterface;

class ApplicationDataProviderA implements ApplicationDataProviderInterface
{
    public function getData()
    {
        return [
            'a' => 1,
        ];
    }
}