<?php

namespace Sokil\FrontendBundle;

use Sokil\FrontendBundle\DependencyInjection\ConfigureSpaWithAppDataPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class FrontendBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new ConfigureSpaWithAppDataPass());
    }
}
