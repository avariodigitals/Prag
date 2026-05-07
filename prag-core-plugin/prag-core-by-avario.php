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
        add_filter('rest_pre_serve_request', [$this, 'add_rest_cors_headers'], 10, 4);
        // Register prag_wishlist user meta for REST API access
        add_action('init', [$this, 'register_user_meta']);
        // Register custom post types
        add_action('init', [$this, 'register_post_types']);
    }

    /**
     * Register Custom Post Types
     */
    public function register_post_types() {

        // prag_document — Technical Resources attached to products
        register_post_type('prag_document', [
            'labels'       => ['name' => 'Tech Documents', 'singular_name' => 'Tech Document'],
            'public'       => false,
            'show_ui'      => true,
            'show_in_rest' => true,
            'rest_base'    => 'prag_document',
            'supports'     => ['title', 'custom-fields'],
            'menu_icon'    => 'dashicons-media-document',
        ]);

        register_post_meta('prag_document', 'file_url', [
            'type' => 'string', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can('edit_posts'); },
        ]);
        register_post_meta('prag_document', 'file_type', [
            'type' => 'string', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can('edit_posts'); },
        ]);
        register_post_meta('prag_document', 'file_size', [
            'type' => 'string', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can('edit_posts'); },
        ]);
        register_post_meta('prag_document', 'pages', [
            'type' => 'string', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can('edit_posts'); },
        ]);
        register_post_meta('prag_document', 'product_id', [
            'type' => 'integer', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function() { return current_user_can('edit_posts'); },
        ]);

        // prag_store — Physical and online store locations
        register_post_type('prag_store', [
            'labels'       => ['name' => 'Stores', 'singular_name' => 'Store'],
            'public'       => false,
            'show_ui'      => true,
            'show_in_rest' => true,
            'rest_base'    => 'prag_store',
            'supports'     => ['title', 'custom-fields'],
            'menu_icon'    => 'dashicons-store',
        ]);

        foreach (['city', 'address', 'phone', 'map_url', 'store_type', 'logo_url', 'logo_alt'] as $field) {
            register_post_meta('prag_store', $field, [
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => true,
                'default'       => '',
                'auth_callback' => function() { return current_user_can('edit_posts'); },
            ]);
        }

        // prag_distributor — Distributor / Partnership applications
        register_post_type('prag_distributor', [
            'labels'       => ['name' => 'Distributors', 'singular_name' => 'Distributor Application'],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'supports'     => ['title', 'custom-fields'],
            'menu_icon'    => 'dashicons-groups',
            'capabilities' => ['create_posts' => 'do_not_allow'],
            'map_meta_cap' => true,
        ]);

        foreach (['applicant_name', 'applicant_email', 'applicant_phone', 'business_name', 'business_city', 'business_type', 'partnership_tier', 'applicant_message', 'submitted_at'] as $meta) {
            register_post_meta('prag_distributor', $meta, [
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => false,
                'auth_callback' => function() { return current_user_can('edit_posts'); },
            ]);
        }
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

        register_rest_route($namespace, '/profile', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_profile'],
                'permission_callback' => function() {
                    return is_user_logged_in();
                },
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'update_profile'],
                'permission_callback' => function() {
                    return is_user_logged_in();
                },
            ],
        ]);

        // Distributor application endpoint
        register_rest_route($namespace, '/distributor', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_distributor_application'],
            'permission_callback' => '__return_true',
        ]);

        // Contact form endpoint
        register_rest_route($namespace, '/contact', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_contact_form'],
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

        // Admin config endpoint — persists adminStore data (user states, tracking, SMTP, forms)
        // Authenticated via WordPress Application Password (Basic Auth) from Prag-Admin server
        register_rest_route($namespace, '/admin-config', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_admin_config'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'update_admin_config'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ]
        ]);

        register_rest_route($namespace, '/product-document', [
            [
                'methods' => 'POST',
                'callback' => [$this, 'upload_product_document'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
        ]);
    }

    public function add_rest_cors_headers($served, $result, $request, $server) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        return $served;
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

    private function build_profile_response($user_id) {
        $user = get_userdata($user_id);
        if (!$user) {
            return new WP_Error('profile_not_found', 'Profile not found.', ['status' => 404]);
        }

        $meta = [
            'prag_phone' => (string) get_user_meta($user_id, 'prag_phone', true),
            'prag_avatar' => (string) get_user_meta($user_id, 'prag_avatar', true),
            'billing_address_1' => (string) get_user_meta($user_id, 'billing_address_1', true),
            'billing_city' => (string) get_user_meta($user_id, 'billing_city', true),
            'billing_state' => (string) get_user_meta($user_id, 'billing_state', true),
            'billing_postcode' => (string) get_user_meta($user_id, 'billing_postcode', true),
        ];

        if (class_exists('WC_Customer')) {
            $customer = new WC_Customer($user_id);
            if ($customer && $customer->get_id()) {
                if (!$meta['prag_phone']) $meta['prag_phone'] = (string) $customer->get_billing_phone();
                if (!$meta['billing_address_1']) $meta['billing_address_1'] = (string) $customer->get_billing_address_1();
                if (!$meta['billing_city']) $meta['billing_city'] = (string) $customer->get_billing_city();
                if (!$meta['billing_state']) $meta['billing_state'] = (string) $customer->get_billing_state();
                if (!$meta['billing_postcode']) $meta['billing_postcode'] = (string) $customer->get_billing_postcode();
            }
        }

        return [
            'id' => $user->ID,
            'first_name' => (string) get_user_meta($user_id, 'first_name', true),
            'last_name' => (string) get_user_meta($user_id, 'last_name', true),
            'email' => (string) $user->user_email,
            'meta' => $meta,
            'avatar_urls' => [
                '96' => get_avatar_url($user_id, ['size' => 96]),
            ],
        ];
    }

    public function get_profile($request) {
        $user_id = get_current_user_id();
        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        return $this->build_profile_response($user_id);
    }

    public function update_profile($request) {
        $user_id = get_current_user_id();
        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        $params = $request->get_json_params();
        $email = sanitize_email($params['email'] ?? '');
        $first_name = sanitize_text_field($params['first_name'] ?? '');
        $last_name = sanitize_text_field($params['last_name'] ?? '');
        $phone = sanitize_text_field($params['meta']['prag_phone'] ?? '');
        $billing_address_1 = sanitize_text_field($params['meta']['billing_address_1'] ?? '');
        $billing_city = sanitize_text_field($params['meta']['billing_city'] ?? '');
        $billing_state = sanitize_text_field($params['meta']['billing_state'] ?? '');
        $billing_postcode = sanitize_text_field($params['meta']['billing_postcode'] ?? '');

        if (!$email) {
            return new WP_Error('missing_email', 'Email is required.', ['status' => 400]);
        }

        $existing = get_user_by('email', $email);
        if ($existing && (int) $existing->ID !== (int) $user_id) {
            return new WP_Error('email_exists', 'That email address is already in use.', ['status' => 409]);
        }

        $display_name = trim($first_name . ' ' . $last_name);
        $updated = wp_update_user([
            'ID' => $user_id,
            'user_email' => $email,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'display_name' => $display_name ?: null,
        ]);

        if (is_wp_error($updated)) {
            return $updated;
        }

        update_user_meta($user_id, 'first_name', $first_name);
        update_user_meta($user_id, 'last_name', $last_name);
        update_user_meta($user_id, 'prag_phone', $phone);
        update_user_meta($user_id, 'billing_email', $email);
        update_user_meta($user_id, 'billing_first_name', $first_name);
        update_user_meta($user_id, 'billing_last_name', $last_name);
        update_user_meta($user_id, 'billing_phone', $phone);
        update_user_meta($user_id, 'billing_address_1', $billing_address_1);
        update_user_meta($user_id, 'billing_city', $billing_city);
        update_user_meta($user_id, 'billing_state', $billing_state);
        update_user_meta($user_id, 'billing_postcode', $billing_postcode);
        update_user_meta($user_id, 'billing_country', 'NG');
        update_user_meta($user_id, 'shipping_first_name', $first_name);
        update_user_meta($user_id, 'shipping_last_name', $last_name);
        update_user_meta($user_id, 'shipping_address_1', $billing_address_1);
        update_user_meta($user_id, 'shipping_city', $billing_city);
        update_user_meta($user_id, 'shipping_state', $billing_state);
        update_user_meta($user_id, 'shipping_postcode', $billing_postcode);
        update_user_meta($user_id, 'shipping_country', 'NG');

        if (class_exists('WC_Customer')) {
            $customer = new WC_Customer($user_id);
            if ($customer) {
                $customer->set_email($email);
                $customer->set_first_name($first_name);
                $customer->set_last_name($last_name);
                $customer->set_billing_email($email);
                $customer->set_billing_first_name($first_name);
                $customer->set_billing_last_name($last_name);
                $customer->set_billing_phone($phone);
                $customer->set_billing_address_1($billing_address_1);
                $customer->set_billing_city($billing_city);
                $customer->set_billing_state($billing_state);
                $customer->set_billing_postcode($billing_postcode);
                $customer->set_billing_country('NG');
                $customer->set_shipping_first_name($first_name);
                $customer->set_shipping_last_name($last_name);
                $customer->set_shipping_address_1($billing_address_1);
                $customer->set_shipping_city($billing_city);
                $customer->set_shipping_state($billing_state);
                $customer->set_shipping_postcode($billing_postcode);
                $customer->set_shipping_country('NG');
                $customer->save();
            }
        }

        return $this->build_profile_response($user_id);
    }

    /**
     * Get email recipients for a form type from admin config.
     * Reads from the `forms` array stored by the PRAG admin panel,
     * matching on `formKey`. Falls back to the WordPress admin email.
     *
     * @param string $type  'contact' | 'distributor' | 'checkout'
     * @return array
     */
    private function get_form_recipients(string $type): array {
        $raw    = get_option('prag_admin_config', '');
        $config = $raw ? json_decode($raw, true) : [];
        $forms  = $config['forms'] ?? [];

        foreach ($forms as $rule) {
            if (($rule['formKey'] ?? '') !== $type) continue;
            $list = $rule['recipients'] ?? [];
            if (is_string($list)) {
                $list = array_filter(array_map('trim', explode(',', $list)));
            }
            if (!empty($list)) {
                return $list;
            }
        }

        return [get_option('admin_email')];
    }

    public function handle_contact_form($request) {
        $p = $request->get_json_params();

        $required = ['name', 'email', 'message'];
        foreach ($required as $field) {
            if (empty($p[$field])) {
                return new WP_Error('missing_fields', ucfirst($field) . ' is required.', ['status' => 400]);
            }
        }

        $name         = sanitize_text_field($p['name']);
        $email        = sanitize_email($p['email']);
        $phone        = sanitize_text_field($p['phone'] ?? '');
        $company      = sanitize_text_field($p['company'] ?? '');
        $enquiry_type = sanitize_text_field($p['enquiry_type'] ?? '');
        $message      = sanitize_textarea_field($p['message']);

        $site_name  = get_bloginfo('name');
        $from_email = 'noreply@' . parse_url(get_site_url(), PHP_URL_HOST);
        $recipients = $this->get_form_recipients('contact');

        $headers = [
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $site_name . ' <' . $from_email . '>',
            'Reply-To: ' . $name . ' <' . $email . '>',
        ];

        // --- Notification to staff ---
        $subject  = '[Contact Form] ' . ($enquiry_type ?: 'General Enquiry') . ' from ' . $name;
        $body     = "New contact form submission.\r\n\r\n";
        $body    .= "Name:         {$name}\r\n";
        $body    .= "Email:        {$email}\r\n";
        if ($phone)        { $body .= "Phone:        {$phone}\r\n"; }
        if ($company)      { $body .= "Company:      {$company}\r\n"; }
        if ($enquiry_type) { $body .= "Enquiry Type: {$enquiry_type}\r\n"; }
        $body    .= "\r\nMessage:\r\n{$message}\r\n\r\n";
        $body    .= "-- \r\n{$site_name}\r\n";

        $sent = wp_mail($recipients, $subject, $body, $headers);

        if (!$sent) {
            return new WP_Error('mail_failed', 'Failed to send message.', ['status' => 500]);
        }

        // --- Acknowledgment to customer ---
        $ack_subject = 'We received your message – ' . $site_name;
        $ack_body    = "Hi {$name},\r\n\r\n";
        $ack_body   .= "Thank you for reaching out. We have received your message and will get back to you shortly.\r\n\r\n";
        $ack_body   .= "Your message:\r\n{$message}\r\n\r\n";
        $ack_body   .= "-- \r\n{$site_name}\r\n";

        $ack_headers = [
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $site_name . ' <' . $from_email . '>',
        ];

        wp_mail($email, $ack_subject, $ack_body, $ack_headers);

        return ['success' => true, 'message' => 'Message sent'];
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

        // Email notification to staff
        $site_name  = get_bloginfo('name');
        $recipients = $this->get_form_recipients('distributor');
        $from_email = 'noreply@' . parse_url(get_site_url(), PHP_URL_HOST);

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

        wp_mail($recipients, $subject, $body, $headers);

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
        $defaults = [
            'contact_phone'             => '+2348032170129',
            'contact_email'             => 'sales@prag.global',
            'whatsapp'                  => '+2348032170129',
            'address'                   => '14 Industrial Layout, Victoria Island, Lagos, Nigeria',
            'business_hours_weekday'    => 'Mon–Fri: 8:00 AM – 6:00 PM',
            'business_hours_saturday'   => 'Sat: 9:00 AM – 2:00 PM',
            'announcement_bar'          => '',
            'footer_description'        => 'Nigeria\'s leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.',
            'brand_banner_title'        => 'No Hype. Just Inverters That Deliver.',
            'brand_banner_description'  => 'Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.',
            'brand_banner_cta'          => 'Buy Inverters Built to Last',
            'brand_banner_link'         => '/products/inverters',
            'brand_banner_image'        => 'https://central.prag.global/wp-content/uploads/2026/04/f80b14a4d9e3fc153ae2e60c3d8d11a58ebe33fe.png',
            'socials' => [
                'facebook'  => 'https://www.facebook.com/pragpowersolutions',
                'instagram' => 'https://www.instagram.com/prag_ng/',
                'linkedin'  => 'https://www.linkedin.com/company/prag/',
                'twitter'   => '',
                'whatsapp'  => 'https://wa.me/2348032170129',
            ],
            'slides' => [
                [
                    'title'        => 'No Hype. Just Inverters That Deliver.',
                    'description'  => 'Choose inverters engineered for real-world loads. Shop reliable power systems today.',
                    'cta'          => 'Buy Inverters Built to Last',
                    'link'         => '/products',
                    'productImage' => 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png',
                    'productAlt'   => 'Heavy Duty Inverter',
                ],
                [
                    'title'        => 'Power Your Home. Power Your Business.',
                    'description'  => 'From residential to industrial applications. Trusted inverters for every power need.',
                    'cta'          => 'Explore Our Range',
                    'link'         => '/products',
                    'productImage' => 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
                    'productAlt'   => 'Residential Inverter',
                ],
                [
                    'title'        => 'Built Tough. Tested Tougher.',
                    'description'  => 'Heavy-duty inverters designed to handle the toughest loads without compromise.',
                    'cta'          => 'Shop Heavy Duty Inverters',
                    'link'         => '/inverter',
                    'productImage' => 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
                    'productAlt'   => 'Industrial Inverter',
                ],
                [
                    'title'        => 'Reliable Power. Unbeatable Performance.',
                    'description'  => 'Experience consistent power delivery with inverters engineered for excellence.',
                    'cta'          => 'Get Started Today',
                    'link'         => '/products',
                    'productImage' => 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
                    'productAlt'   => 'Premium Inverter',
                ],
            ],
            'categories' => [
                ['name' => 'Voltage Stabilizers', 'slug' => 'voltage-stabilizers', 'image' => 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png'],
                ['name' => 'Inverters',           'slug' => 'inverters',            'image' => 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png'],
                ['name' => 'Solar Panels',        'slug' => 'solar',                'image' => 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png'],
                ['name' => 'Batteries',           'slug' => 'batteries',            'image' => 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png'],
            ],
        ];

        $saved = get_option('prag_site_settings', []);
        return array_merge($defaults, $saved);
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
     * Get Admin Config (persisted adminStore data)
     */
    public function get_admin_config() {
        $raw = get_option('prag_admin_config', '');
        if (empty($raw)) {
            return new WP_REST_Response(null, 204);
        }
        $decoded = json_decode($raw, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return new WP_REST_Response(null, 204);
        }
        return rest_ensure_response($decoded);
    }

    /**
     * Update Admin Config (persists adminStore data)
     */
    public function update_admin_config($request) {
        $params = $request->get_json_params();
        if (empty($params) || !is_array($params)) {
            return new WP_Error('empty_body', 'Request body is required', ['status' => 400]);
        }
        update_option('prag_admin_config', wp_json_encode($params), false);
        return ['success' => true, 'message' => 'Admin config saved'];
    }

    /**
     * Upload a technical product document directly in WordPress.
     * This bypasses Vercel request body limits for larger PDFs.
     */
    public function upload_product_document($request) {
        $files = $request->get_file_params();
        if (empty($files['file'])) {
            return new WP_Error('missing_file', 'File is required', ['status' => 400]);
        }

        $product_id = intval($request->get_param('product_id'));
        if ($product_id <= 0) {
            return new WP_Error('missing_product_id', 'Valid product_id is required', ['status' => 400]);
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $attachment_id = media_handle_upload('file', 0);
        if (is_wp_error($attachment_id)) {
            return new WP_Error('media_upload_failed', $attachment_id->get_error_message(), ['status' => 500]);
        }

        $file = $files['file'];
        $title = sanitize_text_field($request->get_param('title') ?: pathinfo($file['name'], PATHINFO_FILENAME));
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $file_size = size_format((int) $file['size'], 2);
        $file_url = wp_get_attachment_url($attachment_id);

        $doc_id = wp_insert_post([
            'post_type' => 'prag_document',
            'post_status' => 'publish',
            'post_title' => $title,
        ], true);

        if (is_wp_error($doc_id)) {
            wp_delete_attachment($attachment_id, true);
            return new WP_Error('document_create_failed', $doc_id->get_error_message(), ['status' => 500]);
        }

        update_post_meta($doc_id, 'file_url', $file_url ?: '');
        update_post_meta($doc_id, 'file_type', $extension ?: 'file');
        update_post_meta($doc_id, 'file_size', $file_size ?: '');
        update_post_meta($doc_id, 'pages', '');
        update_post_meta($doc_id, 'product_id', $product_id);

        return rest_ensure_response([
            'id' => $doc_id,
            'title' => $title,
            'file_url' => $file_url ?: '',
            'file_type' => $extension ?: 'file',
            'file_size' => $file_size ?: '',
            'pages' => '',
            'product_id' => $product_id,
        ]);
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
