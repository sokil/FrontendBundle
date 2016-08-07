<?php

namespace Sokil\FrontendBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

use Sokil\FrontendBundle\Spa\ApplicationData;
use Sokil\FrontendBundle\Stub\Spa\ApplicationDataProviderA;
use Sokil\FrontendBundle\Stub\Spa\ApplicationDataProviderB;

class ApplicationDataTest extends \PHPUnit_Framework_TestCase
{
    public function testGetAppData()
    {
        // provider A definition
        $providerADefinition = new Definition();
        $providerADefinition
            ->setClass(ApplicationDataProviderA::class)
            ->addTag('frontend.spa.app_data_provider', ['app_data' => 'acme.app_data']);

        // provider B definition
        $providerBDefinition = new Definition();
        $providerBDefinition
            ->setClass(ApplicationDataProviderB::class)
            ->addTag('frontend.spa.app_data_provider', ['app_data' => 'acme.app_data']);

        // app data
        $appDataDefinition = new Definition();
        $appDataDefinition->setClass(ApplicationData::class);

        // create container
        $container = new ContainerBuilder();
        $container->setDefinition('acme.provider_a', $providerADefinition);
        $container->setDefinition('acme.provider_B', $providerBDefinition);
        $container->setDefinition('acme.app_data', $appDataDefinition);

        // compile container
        $container->addCompilerPass(new ConfigureSpaWithAppDataPass());
        $container->compile();

        // data
        $appData = $container->get('acme.app_data')->getData();

        // assert
        $this->assertSame([
            'a' => 1,
            'b' => 2,
        ], $appData);
    }

    /**
     * @expectedException \Symfony\Component\DependencyInjection\Exception\InvalidArgumentException
     * @expectedExceptionMessage Application data service not specified for provider acme.provider_a
     */
    public function testGetAppData_InvalidContainerConfiguration()
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
            ->addTag('frontend.spa.app_data_provider', ['app_data' => 'acme.app_data']);

        // app data
        $appDataDefinition = new Definition();
        $appDataDefinition->setClass(ApplicationData::class);

        // create container
        $container = new ContainerBuilder();
        $container->setDefinition('acme.provider_a', $providerADefinition);
        $container->setDefinition('acme.provider_B', $providerBDefinition);
        $container->setDefinition('acme.app_data', $appDataDefinition);

        // compile container
        $container->addCompilerPass(new ConfigureSpaWithAppDataPass());
        $container->compile();
    }
}