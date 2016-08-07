<?php

namespace Sokil\FrontendBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Exception\InvalidArgumentException;

class ConfigureSpaWithAppDataPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        // inject application data providers
        $appDataProviderDefinitions = $container->findTaggedServiceIds('frontend.spa.app_data_provider');
        foreach ($appDataProviderDefinitions as $appDataProviderServiceId => $appDataProviderDefinitionTags) {
            foreach ($appDataProviderDefinitionTags as $appDataProviderDefinitionTagParameters) {

                // check add data is well configured
                if (empty($appDataProviderDefinitionTagParameters['app_data'])) {
                    throw new InvalidArgumentException('Application data service not specified for provider ' . $appDataProviderServiceId);
                }

                // get app data definition
                $appDataDefinition = $container->findDefinition($appDataProviderDefinitionTagParameters['app_data']);

                // get provider definition
                $appDataProviderDefinition = $container->findDefinition($appDataProviderServiceId);

                // reconfigure
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