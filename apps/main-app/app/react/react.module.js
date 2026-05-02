/**
 * React Bridge Module for AngularJS
 * 
 * This module provides the infrastructure to run React components
 * alongside AngularJS during the incremental migration.
 */

import angular from 'angular';
import { react2angular } from 'react2angular';

// Import React components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Card } from './components/Card';
import { Badge } from './components/Badge';
import { Avatar } from './components/Avatar';

// Import React pages
import { About } from './pages/About';
import { Settings } from './pages/Settings';

const reactModule = angular.module('ringid.react', []);

// Register React components as AngularJS directives
reactModule
  .directive('reactHeader', react2angular(Header, ['user', 'notifications', 'onLogout']))
  .directive('reactFooter', react2angular(Footer, []))
  .directive('reactLoadingSpinner', react2angular(LoadingSpinner, ['size', 'message']))
  .directive('reactButton', react2angular(Button, ['variant', 'size', 'onClick', 'disabled', 'children']))
  .directive('reactInput', react2angular(Input, ['type', 'value', 'onChange', 'placeholder', 'label', 'error']))
  .directive('reactCard', react2angular(Card, ['title', 'subtitle', 'children']))
  .directive('reactBadge', react2angular(Badge, ['variant', 'children']))
  .directive('reactAvatar', react2angular(Avatar, ['src', 'alt', 'size', 'fallback']))
  .directive('reactAbout', react2angular(About, []))
  .directive('reactSettings', react2angular(Settings, []));

export default reactModule;
