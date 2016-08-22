<?php

namespace Sokil\FrontendBundle\Spa;

class ApplicationData implements ApplicationDataProviderInterface
{
    /**
     * @var array
     */
    private $providerList = [];

    /**
     * Add provider
     *
     * @param ApplicationDataProviderInterface $provider
     */
    public function addProvider(ApplicationDataProviderInterface $provider)
    {
        $this->providerList[] = $provider;

        return $this;
    }

    /**
     * Add providers
     *
     * @param array $providers
     */
    public function addProviders(array $providers)
    {
        foreach ($providers as $provider) {
            $this->addProvider($provider);
        }

        return $this;
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