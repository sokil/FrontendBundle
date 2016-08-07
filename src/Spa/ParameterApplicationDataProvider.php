<?php

namespace Sokil\FrontendBundle\Spa;

use Symfony\Component\DependencyInjection\ContainerBuilder;

class ParameterApplicationDataProvider implements ApplicationDataProviderInterface
{
    private $container;

    private $parameterList;

    public function __construct(
        ContainerBuilder $container,
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