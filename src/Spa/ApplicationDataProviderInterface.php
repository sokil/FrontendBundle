<?php

namespace Sokil\FrontendBundle\Spa;

interface ApplicationDataProviderInterface
{
    /**
     * @return array
     */
    public function getData();
}