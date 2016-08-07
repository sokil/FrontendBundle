<?php

namespace Sokil\FrontendBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

use Sokil\FrontendBundle\Spa\ApplicationData;
use Sokil\FrontendBundle\Stub\Spa\ApplicationDataProviderA;
use Sokil\FrontendBundle\Stub\Spa\ApplicationDataProviderB;

class SpaExtensionTest extends \PHPUnit_Framework_TestCase
{
    public function testGetAppData()
    {

        // provider A definition
        $providerADefinition = new Definition();
        $providerADefinition
            ->setClass(ApplicationDataProviderA::class)
            ->addTag('frontend.spa.app_data_provider');

        // provider B definition
        $providerBDefinition = new Definition();
        $providerBDefinition
            ->setClass(ApplicationDataProviderB::class)
            ->addTag('frontend.spa.app_data_provider');

        // app data
        $appDataDefinition = new Definition();
        $appDataDefinition->setClass(ApplicationData::class);

        // create container
        $container = new ContainerBuilder();
        $container->setDefinition('frontend.spa.provider_a', $providerADefinition);
        $container->setDefinition('frontend.spa.provider_B', $providerBDefinition);
        $container->setDefinition('frontend.spa.app_data', $appDataDefinition);

        // compile container
        $container->addCompilerPass(new ConfigureSpaWithAppDataPass());
        $container->compile();

        // data
        $appData = $container->get('frontend.spa.app_data')->getData();

        // assert
        $this->assertSame([
            'a' => 1,
            'b' => 2,
        ], $appData);
    }
}