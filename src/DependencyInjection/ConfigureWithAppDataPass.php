<?php

namespace Sokil\SpaBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class ConfigureWithAppDataPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $appDataDefinition = $container->findDefinition('spa.app_data');

        // inject application data providers
        $appDataProviderDefinitions = $container->findTaggedServiceIds('spa.app_data_provider');
        foreach ($appDataProviderDefinitions as $appDataProviderServiceId => $appDataProviderDefinitionTags) {
            foreach ($appDataProviderDefinitionTags as $appDataProviderDefinitionTagParameters) {
                $appDataProviderDefinition = $container->findDefinition($appDataProviderServiceId);
                $appDataDefinition->addMethodCall(
                    'addProvider',
                    [
                        $appDataProviderDefinition,
                    ]
                );

            }
        }
    }
}