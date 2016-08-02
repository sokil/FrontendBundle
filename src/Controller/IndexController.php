<?php

namespace Sokil\SpaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class IndexController extends Controller
{
    private $view;

    public function __construct($view)
    {
        $this->view = $view;
    }

    public function indexAction(Request $request)
    {
        if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw $this->createAccessDeniedException();
        }

        /* @var $csrfProfider \Symfony\Component\Security\Csrf\CsrfTokenManager */
        $csrfProvider = $this->get('security.csrf.token_manager');
        $csrfToken = $csrfProvider->getToken('common')->getValue();

        // prepare response
        return $this->render($this->view, [
            'applicationOptions' => [
                'locale'    => $request->getLocale(),
                'locales'   => $this->container->getParameter('locales'),
                'csrf'      => $csrfToken,
            ]
        ]);
    }
}
