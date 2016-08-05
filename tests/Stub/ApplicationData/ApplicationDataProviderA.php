<?php

namespace Sokil\SpaBundle\Stub\ApplicationData;

use Sokil\SpaBundle\ApplicationData\ApplicationDataProviderInterface;

class ApplicationDataProviderA implements ApplicationDataProviderInterface
{
    public function getData()
    {
        return [
            'a' => 1,
        ];
    }
}