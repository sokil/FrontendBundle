<?php

namespace Sokil\SpaBundle\Stub\ApplicationData;

use Sokil\SpaBundle\ApplicationData\ApplicationDataProviderInterface;

class ApplicationDataProviderB implements ApplicationDataProviderInterface
{
    public function getData()
    {
        return [
            'b' => 2,
        ];
    }
}