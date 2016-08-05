<?php

namespace Sokil\SpaBundle\ApplicationData;

class ApplicationData
{
    /**
     * @var array
     */
    private $providerList = [];

    /**
     * Add provider
     * @param ApplicationDataProviderInterface $provider
     */
    public function addProvider(ApplicationDataProviderInterface $provider)
    {
        $this->providerList[] = $provider;
    }

    /**
     * Get data from all providers
     *
     * @return array
     */
    public function getData()
    {
        $data = [];

        foreach ($this->providerList as $provider) {
            $data += $provider->getData();
        }

        return $data;
    }
}