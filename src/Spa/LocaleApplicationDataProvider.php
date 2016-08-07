<?php

namespace Sokil\FrontendBundle\Spa;

use Symfony\Component\HttpFoundation\RequestStack;

class LocaleApplicationDataProvider implements ApplicationDataProviderInterface
{
    private $requestStack;

    /**
     * @param RequestStack $requestStack instance of "@request_stack" service
     */
    public function __construct(
        RequestStack $requestStack
    ) {
        $this->requestStack = $requestStack;
    }

    /**
     * @return array
     */
    public function getData()
    {
        return [
            'locale' => $this->requestStack->getCurrentRequest()->getLocale(),
        ];
    }
}