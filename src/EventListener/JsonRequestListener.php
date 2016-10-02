<?php

namespace Sokil\FrontendBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JsonRequestListener implements EventSubscriberInterface
{
    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        if ('json' !== $request->getContentType()) {
            return;
        }

        $content = $request->getContent();
        $requestPayload = json_decode($content, true);

        // error decoding request
        if($requestPayload === null && json_last_error() !== JSON_ERROR_NONE) {
            return;
        }

        $request->request->replace($requestPayload);
    }

    public static function getSubscribedEvents()
    {
        return array(
            // must be registered after the Router to have access to the _locale
            KernelEvents::REQUEST => array(array('onKernelRequest', 16)),
        );
    }
}