<?php

namespace Sokil\SpaBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

use Sokil\SpaBundle\ApplicationData\ApplicationData;
use Sokil\SpaBundle\Stub\ApplicationData\ApplicationDataProviderA;
use Sokil\SpaBundle\Stub\ApplicationData\ApplicationDataProviderB;

class SpaExtensionTest extends \PHPUnit_Framework_TestCase
{
    public function testGetAppData()
    {

        // provider A definition
        $providerADefinition = new Definition();
        $providerADefinition
            ->setClass(ApplicationDataProviderA::class)
            ->addTag('spa.app_data_provider');

        // provider B definition
        $providerBDefinition = new Definition();
        $providerBDefinition
            ->setClass(ApplicationDataProviderB::class)
            ->addTag('spa.app_data_provider');

        // app data
        $appDataDefinition = new Definition();
        $appDataDefinition->setClass(ApplicationData::class);

        // create container
        $container = new ContainerBuilder();
        $container->setDefinition('spa.provider_a', $providerADefinition);
        $container->setDefinition('spa.provider_B', $providerBDefinition);
        $container->setDefinition('spa.app_data', $appDataDefinition);

        // compile container
        $container->addCompilerPass(new ConfigureWithAppDataPass());
        $container->compile();

        // data
        $appData = $container->get('spa.app_data')->getData();

        // assert
        $this->assertSame([
            'a' => 1,
            'b' => 2,
        ], $appData);
    }
}