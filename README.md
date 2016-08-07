Frontend Bundle
===============

## Single Page Application

### Controller

We need to configure our controller, responsible for rendering single page application.
It may be configured as service:

```yaml
acme.spa.controller:
  class: Sokil\SpaBundle\Controller\IndexController
  arguments:
    - 'AcmeBundle:Spa:index.html.twig'
  calls:
    - [setContainer, ["@service_container"]]
```

If some additional data required to be passed from backend to frontend, this may be done through `Application data`.

### Application data

Application data may be used to pass some data from backend to frontend.
Create service, responsible for obtaining application data from different sources:

```yaml
acme.spa.app_data:
    class: Sokil\FrontendBundle\Spa\ApplicationData
```

Now pass name of this service to definition of your spa action:

```yaml
acme.spa.controller:
  class: Sokil\SpaBundle\Controller\IndexController
  arguments:
    - 'AcmeBundle:Spa:index.html.twig'
    - '@acme.spa.app_data'
  calls:
    - [setContainer, ["@service_container"]]
```

Application data generated from number of providers. provider is a servise identified by tag `frontend.spa.app_data_provider`.
Also app data service must be defined by key `app_data`, pointing to the instance of application data service.

```yaml
acme.spa.some_app_data_provider;
    class: Acme\Spa\SomeApplicationDataprovider
    tags:
        - {name: frontend.spa.app_data_provider, app_data: acme.spa.app_data}
    
```

Provider class must implement `Sokil\FrontendBundle\Spa\ApplicationDataProviderInterface`. It must implement one method `getData()`
which return map of application parameters.

## View

View renders `Marionette 2` application and starts it. `Bootstrap 3` used as UI framework. For adding some CSS and JS resorses 
on page, use macro from `src/Resources/views/macro.html.twig`:

```twig
{% import "@FrontendBundle/Resources/views/macro.html.twig" as frontend %}
<!DOCTYPE html>
<html>
    <head>
        {{ frontend.commonCssResources() }}
    </head>
    <body>
    
    </body>
    {{ frontend.commonJsResources() }}
    <script type="text/javascript">
        // app options may be accessed through applicationData variable
        var options = {{ applicationData|json_encode|raw }};
        // router may be passed as option
        options.router = new Router();
        // container with fromtend services may be passed as option
        options.container = new Container(serviceDefinition);
        // start app
        window.app = new Application(options);
        window.app.start();
    </script>
</html>
```