<?php
/**
 * Plugin Name: Prag Core by Avario
 * Plugin URI: https://www.avariodigitals.com
 * Description: Headless bridge for PRAG. Handles custom authentication, registration, and site-wide settings via REST API.
 * Version: 1.0.0
 * Author: Avario Digitals
 * Author URI: https://www.avariodigitals.com
 * Text Domain: prag-core
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Prag_Core_Bridge {

    public function __construct() {
        // Register REST API routes
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        $namespace = 'prag-core/v1';

        // Registration endpoint
        register_rest_route($namespace, '/register', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_registration'],
            'permission_callback' => '__return_true',
        ]);

        // Settings endpoint (GET/POST)
        register_rest_route($namespace, '/settings', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_settings'],
                'permission_callback' => '__return_true',
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'update_settings'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        ]);
    }

    /**
     * Handle User Registration
     */
    public function handle_registration($request) {
        $params = $request->get_json_params();

        if (empty($params['username']) || empty($params['email']) || empty($params['password'])) {
            return new WP_Error('missing_fields', 'Username, email, and password are required', ['status' => 400]);
        }

        $user_id = wp_create_user($params['username'], $params['password'], $params['email']);

        if (is_wp_error($user_id)) {
            return $user_id;
        }

        // Optional: Set user role to customer for WooCommerce compatibility
        $user = new WP_User($user_id);
        $user->set_role('customer');

        return [
            'success' => true,
            'user_id' => $user_id,
            'message' => 'User registered successfully'
        ];
    }

    /**
     * Get Site Settings
     */
    public function get_settings() {
        $settings = get_option('prag_site_settings', [
            'hero_title' => 'Shop Reliable Power Systems',
            'hero_subtitle' => 'Built for Real-World Performance',
            'contact_phone' => '+2348032170129',
            'contact_email' => 'info@prag.global',
            'announcement_bar' => 'Free shipping on orders over ₦500,000!',
        ]);

        return $settings;
    }

    /**
     * Update Site Settings
     */
    public function update_settings($request) {
        $params = $request->get_json_params();
        
        // Merge with existing settings or overwrite
        $current_settings = get_option('prag_site_settings', []);
        $new_settings = array_merge($current_settings, $params);
        
        update_option('prag_site_settings', $new_settings);

        return [
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $new_settings
        ];
    }

    /**
     * Check if user has administrative permissions via JWT
     */
    public function check_admin_permissions() {
        // The JWT Auth plugin already populates the current user
        return current_user_can('manage_options');
    }
}

new Prag_Core_Bridge();
