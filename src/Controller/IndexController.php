<?php

namespace Sokil\FrontendBundle\Controller;

use Sokil\FrontendBundle\Spa\ApplicationData;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class IndexController extends Controller
{
    /**
     * @var string name of template
     */
    private $view;

    /**
     * @var ApplicationData
     */
    private $applicationData;

    public function __construct(
        $view,
        ApplicationData $appData = null
    ) {
        $this->view = $view;
        $this->applicationData = $appData;
    }

    public function indexAction(Request $request)
    {
        if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw $this->createAccessDeniedException();
        }

        // @todo: move CSRF token to provider
        /* @var $csrfProvider \Symfony\Component\Security\Csrf\CsrfTokenManager */
        $csrfProvider = $this->get('security.csrf.token_manager');
        $csrfToken = $csrfProvider->getToken('common')->getValue();

        // prepare application data
        $applicationData = [
            // @todo: move request parameters to provider
            'locale'    => $request->getLocale(),
            // @todo: move locales to provider
            'locales'   => $this->container->getParameter('locales'),
            // @todo: move CSRF token to provider
            'csrf'      => $csrfToken,
        ];

        if ($this->applicationData) {
            $applicationData += $this->applicationData->getData();
        }

        // render response
        return $this->render($this->view, [
            'applicationData' => $applicationData
        ]);
    }
}
