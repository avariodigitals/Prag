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
        // Register prag_wishlist user meta for REST API access
        add_action('init', [$this, 'register_user_meta']);
    }

    /**
     * Register prag_wishlist user meta so it's accessible via /wp/v2/users/me
     */
    public function register_user_meta() {
        register_meta('user', 'prag_wishlist', [
            'type'              => 'string',
            'description'       => 'PRAG storefront wishlist (JSON array of product items)',
            'single'            => true,
            'default'           => '[]',
            'show_in_rest'      => true,
            'auth_callback'     => function() {
                return is_user_logged_in();
            },
        ]);

        register_meta('user', 'prag_avatar', [
            'type'          => 'string',
            'description'   => 'PRAG storefront custom avatar URL',
            'single'        => true,
            'default'       => '',
            'show_in_rest'  => true,
            'auth_callback' => function() {
                return is_user_logged_in();
            },
        ]);

        register_meta('user', 'prag_phone', [
            'type'          => 'string',
            'description'   => 'PRAG storefront phone number',
            'single'        => true,
            'default'       => '',
            'show_in_rest'  => true,
            'auth_callback' => function() {
                return is_user_logged_in();
            },
        ]);
    }

    public function register_routes() {
        $namespace = 'prag-core/v1';

        // Registration endpoint
        register_rest_route($namespace, '/register', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_registration'],
            'permission_callback' => '__return_true',
        ]);

        // OTP: send code to email
        register_rest_route($namespace, '/otp/send', [
            'methods' => 'POST',
            'callback' => [$this, 'send_otp'],
            'permission_callback' => '__return_true',
        ]);

        // OTP: verify code
        register_rest_route($namespace, '/otp/verify', [
            'methods' => 'POST',
            'callback' => [$this, 'verify_otp'],
            'permission_callback' => '__return_true',
        ]);

        // Forgot password endpoint
        register_rest_route($namespace, '/forgot-password', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_forgot_password'],
            'permission_callback' => '__return_true',
        ]);

        // Distributor application endpoint
        register_rest_route($namespace, '/distributor', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_distributor_application'],
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

        if (email_exists($params['email'])) {
            return new WP_Error('email_exists', 'An account with this email already exists.', ['status' => 409]);
        }

        $user_id = wp_create_user($params['username'], $params['password'], $params['email']);

        if (is_wp_error($user_id)) {
            return $user_id;
        }

        $user = new WP_User($user_id);
        $user->set_role('customer');

        if (!empty($params['first_name'])) update_user_meta($user_id, 'first_name', sanitize_text_field($params['first_name']));
        if (!empty($params['last_name']))  update_user_meta($user_id, 'last_name',  sanitize_text_field($params['last_name']));
        if (!empty($params['phone']))      update_user_meta($user_id, 'prag_phone', sanitize_text_field($params['phone']));

        return [
            'success' => true,
            'user_id' => $user_id,
            'message' => 'User registered successfully'
        ];
    }

    public function send_otp($request) {
        $params = $request->get_json_params();
        $email  = sanitize_email($params['email'] ?? '');

        if (!$email) {
            return new WP_Error('missing_email', 'Email is required', ['status' => 400]);
        }

        $user = get_user_by('email', $email);
        if (!$user) {
            return new WP_Error('user_not_found', 'No account found with that email.', ['status' => 404]);
        }

        $code    = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expires = time() + 600; // 10 minutes

        update_user_meta($user->ID, 'prag_otp_code',    $code);
        update_user_meta($user->ID, 'prag_otp_expires', $expires);

        $site_name = get_bloginfo('name');
        $from_email = 'noreply@' . parse_url(get_site_url(), PHP_URL_HOST);

        $subject = 'Your PRAG verification code: ' . $code;

        $message = "Hi " . esc_html($user->display_name) . ",\r\n\r\n";
        $message .= "Your PRAG email verification code is:\r\n\r\n";
        $message .= "    " . $code . "\r\n\r\n";
        $message .= "This code expires in 10 minutes.\r\n";
        $message .= "If you did not request this, you can safely ignore this email.\r\n\r\n";
        $message .= "-- \r\n";
        $message .= $site_name . "\r\n";
        $message .= get_site_url() . "\r\n";

        $headers = [
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $site_name . ' <' . $from_email . '>',
        ];

        $sent = wp_mail($email, $subject, $message, $headers);

        if (!$sent) {
            return new WP_Error('mail_failed', 'Failed to send OTP email.', ['status' => 500]);
        }

        return ['success' => true, 'message' => 'OTP sent'];
    }

    public function verify_otp($request) {
        $params = $request->get_json_params();
        $email  = sanitize_email($params['email'] ?? '');
        $code   = sanitize_text_field($params['code'] ?? '');

        if (!$email || !$code) {
            return new WP_Error('missing_fields', 'Email and code are required', ['status' => 400]);
        }

        $user = get_user_by('email', $email);
        if (!$user) {
            return new WP_Error('user_not_found', 'No account found.', ['status' => 404]);
        }

        $stored_code    = get_user_meta($user->ID, 'prag_otp_code',    true);
        $stored_expires = get_user_meta($user->ID, 'prag_otp_expires', true);

        if (!$stored_code || $code !== $stored_code) {
            return new WP_Error('invalid_code', 'Invalid verification code.', ['status' => 400]);
        }

        if (time() > (int) $stored_expires) {
            return new WP_Error('code_expired', 'Verification code has expired.', ['status' => 400]);
        }

        // Clear OTP
        delete_user_meta($user->ID, 'prag_otp_code');
        delete_user_meta($user->ID, 'prag_otp_expires');

        return ['success' => true, 'user_id' => $user->ID, 'message' => 'Email verified'];
    }

    public function handle_forgot_password($request) {
        $email = sanitize_email($request->get_json_params()['email'] ?? '');
        if (!$email) return new WP_Error('missing_email', 'Email required', ['status' => 400]);

        $user = get_user_by('email', $email);
        if (!$user) return new WP_Error('not_found', 'No account found', ['status' => 404]);

        retrieve_password($user->user_login);
        return ['success' => true];
    }

    public function handle_distributor_application($request) {
        $p = $request->get_json_params();

        $required = ['name', 'email', 'business'];
        foreach ($required as $field) {
            if (empty($p[$field])) {
                return new WP_Error('missing_fields', ucfirst($field) . ' is required.', ['status' => 400]);
            }
        }

        $name     = sanitize_text_field($p['name']);
        $email    = sanitize_email($p['email']);
        $business = sanitize_text_field($p['business']);
        $phone    = sanitize_text_field($p['phone'] ?? '');
        $city     = sanitize_text_field($p['city'] ?? '');
        $type     = sanitize_text_field($p['type'] ?? '');
        $tier     = sanitize_text_field($p['tier'] ?? '');
        $message  = sanitize_textarea_field($p['message'] ?? '');

        // Store as a custom post for the admin to review
        wp_insert_post([
            'post_type'   => 'prag_distributor',
            'post_title'  => $name . ' – ' . $business,
            'post_status' => 'private',
            'meta_input'  => [
                'applicant_name'     => $name,
                'applicant_email'    => $email,
                'applicant_phone'    => $phone,
                'business_name'      => $business,
                'business_city'      => $city,
                'business_type'      => $type,
                'partnership_tier'   => $tier,
                'applicant_message'  => $message,
                'submitted_at'       => current_time('mysql'),
            ],
        ]);

        // Email notification to admin
        $site_name  = get_bloginfo('name');
        $admin_email = get_option('admin_email');
        $from_email  = 'noreply@' . parse_url(get_site_url(), PHP_URL_HOST);

        $subject = 'New Distributor Application – ' . $name;
        $body  = "New distributor application received.\r\n\r\n";
        $body .= "Name:             {$name}\r\n";
        $body .= "Email:            {$email}\r\n";
        $body .= "Phone:            {$phone}\r\n";
        $body .= "Business:         {$business}\r\n";
        $body .= "City:             {$city}\r\n";
        $body .= "Business Type:    {$type}\r\n";
        $body .= "Partnership Tier: {$tier}\r\n\r\n";
        $body .= "Message:\r\n{$message}\r\n\r\n";
        $body .= "-- \r\n{$site_name}\r\n";

        $headers = [
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $site_name . ' <' . $from_email . '>',
            'Reply-To: ' . $name . ' <' . $email . '>',
        ];

        wp_mail($admin_email, $subject, $body, $headers);

        // Confirmation email to applicant
        $confirm_subject = 'We received your PRAG partnership application';
        $confirm_body  = "Hi {$name},\r\n\r\n";
        $confirm_body .= "Thank you for applying to become a PRAG distributor.\r\n";
        $confirm_body .= "Our partnership team will review your application and contact you within 2 business days.\r\n\r\n";
        $confirm_body .= "Application summary:\r\n";
        $confirm_body .= "Business: {$business}\r\n";
        $confirm_body .= "Tier: {$tier}\r\n\r\n";
        $confirm_body .= "-- \r\n{$site_name}\r\n";

        wp_mail($email, $confirm_subject, $confirm_body, $headers);

        return ['success' => true, 'message' => 'Application received'];
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
