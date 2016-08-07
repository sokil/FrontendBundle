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

        $applicationData = null;
        if ($this->applicationData) {
            $applicationData = $this->applicationData->getData();
        }

        // render response
        return $this->render($this->view, [
            'applicationData' => $applicationData
        ]);
    }
}
