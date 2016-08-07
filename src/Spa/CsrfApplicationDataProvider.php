<?php

namespace Sokil\FrontendBundle\Spa;

use \Symfony\Component\Security\Csrf\CsrfTokenManager;

class CsrfApplicationDataProvider implements ApplicationDataProviderInterface
{
    private $csrfTokenManager;

    private $tokenId;

    /**
     * @param CsrfTokenManager $csrfTokenManager e.g. service "@security.csrf.token_manager"
     * @param string $tokenId
     */
    public function __construct(
        CsrfTokenManager $csrfTokenManager,
        $tokenId
    ) {
        $this->csrfTokenManager = $csrfTokenManager;
        $this->tokenId = $tokenId;
    }

    /**
     * @return array
     */
    public function getData()
    {
        return [
            'csrf' => $this->csrfTokenManager->getToken($this->tokenId)->getValue(),
        ];
    }
}