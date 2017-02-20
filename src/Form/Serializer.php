<?php

namespace Sokil\FrontendBundle\Form;

use Symfony\Component\Form\FormFactory;

class Serializer
{
    /**
     * @var FormFactory
     */
    private $formFactory;

    public function __construct(FormFactory $formFactory)
    {
        $this->formFactory = $formFactory;
    }

    public function serialize($formType)
    {
        $form = $this
            ->formFactory
            ->createBuilder($formType)
            ->getForm();

        $fields = [];
        foreach ($form->all() as $field) {
            $config = $field->getConfig();
            $data = $field->getData();
            $extraData = $field->getExtraData();
            $viewData = $field->getViewData();
            $view = $field->createView();
            $viewVars = $view->vars;
        }

        return $fields;
    }
}