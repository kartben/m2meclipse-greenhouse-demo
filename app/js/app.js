'use strict';

/* App Module */
// FIXME it seems that we have to the the app dependent of restservice even we
// don't use it as this level.
angular.module('greenhouse', ['restservice', 'ui', 'ui.bootstrap']);
