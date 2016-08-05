<?php

namespace Sokil\SpaBundle;

use Sokil\SpaBundle\DependencyInjection\ConfigureWithAppDataPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class SpaBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new ConfigureWithAppDataPass());
    }
}
