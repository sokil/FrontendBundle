Frontend Bundle
===============

## Installation

Add composer dependency:

```
composer require sokil/frontend-bundle
```

Add bundle to AppKernel:
```php
<?php

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Sokil\FrontendBundle\FrontendBundle(),
        );
    }
}
```

Build resources:
```
bower install
npm install
grunt
```

Bundle uses assetic so you need to register it in assetic config:
```yaml
assetic:
    bundles:
        - FrontendBundle
```

## Single Page Application

### Controller

We need to configure our controller, responsible for rendering single page application.

You can use already prepared controller as service:

```yaml
acme.spa.controller:
  class: Sokil\FrontendBundle\Controller\IndexController
  arguments:
    - 'AcmeBundle:Spa:index.html.twig'
  calls:
    - [setContainer, ["@service_container"]]
```

Or use own controller:
```php

<?php

<?php

namespace Acme\SiteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SpaController extends Controller
{
    public function indexAction(Request $request)
    {
        if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw $this->createAccessDeniedException();
        }

        // render response
        return $this->render('SiteBundle:Spa:index.html.twig', [
            'applicationData' => $this->get('acme.spa.app_data')->getData(), // optional appdata
        ]);
    }
}
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
  class: Sokil\FrontendBundle\Controller\IndexController
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

### Template

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
        (function() {
            // app options may be accessed through applicationData variable
            var options = {{ applicationData|json_encode|raw }};
            // router may be passed as option
            options.router = new AcmeRouter();
            // container with fromtend services may be passed as option
            options.container = new Container(acmeServiceDefinition);
            // start app
            window.app = new Application(options);
            window.app.start();
        })();
    </script>
</html>
```

### Router

Router is instance of `Backbone.Router`. Also you can use `Marionette.AppRouter`.

If you have few routes, you can merge them into one router:

```javascript
// create instance of router
options.router = new Marionette.AppRouter();

// add first router
var bundle1Router = new Bundle1Router();
options.router.processAppRoutes(bundle1Router, bundle1Router.routes);
// add second router
var bundle2Router = new Bundle2Router();
options.router.processAppRoutes(bundle2Router, bundle2Router.routes);
```

### Service container

Container is a registry to build and get already built servies. Service definitions, passed as first Container argument, is just an object with methods to build service instances, where `this`  refers to `Container` instance:

```javascript 
acmeServiceDefinition = {
    someService: function() {
        return new SomeService(this.get('otherService'));
    },
    otherService: function() {
        return new OtherService();
    }
}
```

Definitions also may be merged and passed to container:

```javascript
options.container = new Container(_.extend(
        {},
        Bundle1ServiceDefinition,
        Bundle2ServiceDefinition
));
```

Services then may be get from container:
```php
var someService = app.container.get('someService');
```
