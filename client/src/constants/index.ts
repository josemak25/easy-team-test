/*
 ****************************************************************
 ******************    ALL APP CONSTANTS   **********************
 ****************************************************************
 */

import {name} from '../../app.json';
import {version} from '../../package.json';

/**
 * extending app global constants for app name
 * @constant APP_NAME default value
 */
export const APP_NAME: string = `${name.charAt(0).toUpperCase()}${name.slice(
  1,
)}`;

/**
 * extending app global constants for app version
 * @constant APP_VERSION default value
 */
export const APP_VERSION = version;

/**
 * extending app global constants for app language
 * @constant LANGUAGE_DEFAULT default value
 */
export const LANGUAGE_DEFAULT: string = 'en';

/**
 * extending app global constants for page loading
 * @constant DEFAULT_PAGINATION default value
 */
export const DEFAULT_PAGINATION: number = 10;

/**
 * extending app global constants
 * @constant CACHE_TIME default value
 */
export const CACHE_TIME: number = 1000 * 60 * 60 * 24 * 30; // 1 month
