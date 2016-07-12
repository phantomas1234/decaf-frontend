import {module} from 'angular';
import 'angular-material';
import 'angular-ui-router';
import MODULES_CONFIG from 'modules.config';

import {isProd} from './env';

import home from './components/home/home';


const CORE_COMPONENTS = [
	// Angular
	'ngAnimate',
	'ngAria',
	'ngMaterial',
	// 3rd Party
	'ui.router'
];

const APP_COMPONENTS = [
	home.name
];

const app = module('platform', [].concat(
	CORE_COMPONENTS,
	APP_COMPONENTS,
	MODULES_CONFIG.map((module) => module.name)
));


// AM theme config
app.config(function ($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('grey');
});

// Router config
app.config(function ($urlMatcherFactoryProvider, $stateProvider) {
	// Optional slash
	$urlMatcherFactoryProvider.strictMode(false);

	// Root state
	$stateProvider.state('root', {
		url: '',
		abstract: true
	});
});


// Main component
class AppController {
	modules: any[] = MODULES_CONFIG;
	constructor() {}
	$onInit() {
		console.info(`App running in ${isProd() ? 'production' : 'dev'} mode.`);
	}
}

app.component('app', {
	bindings: {},
	controller: AppController,
	controllerAs: 'app',
	transclude: {
		'navigation': '?appNavigation',
		'header': 'appHeader'
	},
	template: `
		<div layout="row" flex>
			<md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')">
				<div ng-transclude="navigation"></div>
				<md-list>
					<md-list-item ng-repeat="module in ::app.modules" ui-sref="{{module.navigation.state}}">
						<md-icon>{{ module.navigation.icon }}</md-icon>
						<p>{{ module.navigation.label }}</p>
					</md-list-item>
				</md-list>
			</md-sidenav>
			<div layout="column" flex id="content">
				<md-toolbar>
					<div class="md-toolbar-tools">
						<div ng-transclude="header"></div>
					</div>
				</md-toolbar>
				<md-content layout="column"
							ui-view="content"
							flex>
				</md-content>
			</div>
		</div>
	`
});


export default app;
