<?php

namespace Sokil\SpaBundle\ApplicationData;

interface ApplicationDataProviderInterface
{
    /**
     * @return array
     */
    public function getData();
}