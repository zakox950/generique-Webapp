'use strict';

// Boot
updateCartBadge();
var initialRoute = window.location.hash.slice(1) || 'home';
render(initialRoute);
