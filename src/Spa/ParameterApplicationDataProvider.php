<?php

namespace Sokil\FrontendBundle\Spa;

use Symfony\Component\DependencyInjection\Container;

class ParameterApplicationDataProvider implements ApplicationDataProviderInterface
{
    private $container;

    private $parameterList;

    /**
     * @param Container $container instance of "@service_container" service
     * @param array $parameterList
     */
    public function __construct(
        Container $container,
        array $parameterList
    ) {
        $this->container = $container;
        $this->parameterList = $parameterList;
    }

    /**
     * @return array
     */
    public function getData()
    {
        $data = [];

        foreach ($this->parameterList as $parameterName) {
            $data[$parameterName] = $this->container->getParameter($parameterName);
        }

        return $data;
    }
}