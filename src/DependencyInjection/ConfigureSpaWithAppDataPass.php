<?php

namespace Sokil\FrontendBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class ConfigureSpaWithAppDataPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $appDataDefinition = $container->findDefinition('frontend.spa.app_data');

        // inject application data providers
        $appDataProviderDefinitions = $container->findTaggedServiceIds('frontend.spa.app_data_provider');
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