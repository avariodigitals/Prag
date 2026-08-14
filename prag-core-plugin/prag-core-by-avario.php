<?php
/**
 * Plugin Name: Prag Core by Avario
 * Plugin URI: https://www.avariodigitals.com
 * Description: Headless bridge for PRAG. Handles custom authentication, registration, site-wide settings via REST API, and SEO exclusion for central.prag.global.
 * Version: 1.1.0
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

        // SEO: central.prag.global is a headless CMS/backend and must not
        // appear in search results. These hooks ensure every public HTML
        // page is marked noindex/nofollow without affecting the REST API
        // (/wp-json/*), uploaded media (/wp-content/uploads/*), or admin.
        add_action('template_redirect', [$this, 'send_x_robots_tag_noindex']);
        add_filter('wp_robots', [$this, 'filter_wp_robots_noindex']);
        add_filter('wp_sitemaps_enabled', '__return_false');
        add_filter('robots_txt', [$this, 'filter_robots_txt_disallow_all'], 10, 2);
        // Ensure "Discourage search engines" is enabled even if the plugin
        // was activated before this feature existed (activation hooks only
        // fire on activation/re-activation).
        add_action('init', [$this, 'ensure_discourage_search_engines']);
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

        foreach (['applicant_name', 'applicant_email', 'applicant_phone', 'business_name', 'business_city', 'business_type', 'partnership_tier', 'applicant_message', 'submitted_at', 'application_status'] as $meta) {
            register_post_meta('prag_distributor', $meta, [
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => false,
                'auth_callback' => function() { return current_user_can('edit_posts'); },
            ]);
        }

        // prag_career — Career / Job applications
        register_post_type('prag_career', [
            'labels'       => ['name' => 'Careers', 'singular_name' => 'Career Application'],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'supports'     => ['title', 'custom-fields'],
            'menu_icon'    => 'dashicons-id-alt',
            'capabilities' => ['create_posts' => 'do_not_allow'],
            'map_meta_cap' => true,
        ]);

        foreach (['applicant_name', 'applicant_email', 'applicant_phone', 'applicant_location', 'position', 'experience', 'education', 'cover_letter', 'cv_filename', 'application_status', 'submitted_at'] as $meta) {
            register_post_meta('prag_career', $meta, [
                'type'          => 'string',
                'single'        => true,
                'show_in_rest'  => false,
                'auth_callback' => function() { return current_user_can('edit_posts'); },
            ]);
        }

        // prag_contact — Contact form submissions
        register_post_type('prag_contact', [
            'labels'       => ['name' => 'Enquiries', 'singular_name' => 'Contact Enquiry'],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'supports'     => ['title', 'custom-fields'],
            'menu_icon'    => 'dashicons-email-alt',
            'capabilities' => ['create_posts' => 'do_not_allow'],
            'map_meta_cap' => true,
        ]);

        foreach (['contact_name', 'contact_email', 'contact_phone', 'contact_company', 'enquiry_type', 'contact_message', 'submitted_at', 'contact_status'] as $meta) {
            register_post_meta('prag_contact', $meta, [
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

        // Post SEO meta — exposes Yoast postmeta (title, metadesc, focuskw)
        // for headless frontend consumption. Read-only, public.
        register_rest_route($namespace, '/post-seo/(?P<id>\d+)', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_post_seo_meta'],
                'permission_callback' => '__return_true',
            ],
        ]);

        register_rest_route($namespace, '/product-document', [
            [
                'methods' => 'POST',
                'callback' => [$this, 'upload_product_document'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
        ]);

        // Product Custom Tabs (YIKES Custom Product Tabs data)
        register_rest_route($namespace, '/products/(?P<id>\d+)/custom-tabs', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_product_custom_tabs'],
                'permission_callback' => '__return_true',
            ],
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'update_product_custom_tabs'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
        ]);

        // B2B Enquiries (contact form submissions)
        register_rest_route($namespace, '/b2b/enquiries', [
            'methods'             => 'GET',
            'callback'            => [$this, 'list_enquiries'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);
        register_rest_route($namespace, '/b2b/enquiries/(?P<id>\d+)', [
            [
                'methods'             => 'PATCH',
                'callback'            => [$this, 'update_enquiry_status'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [$this, 'delete_enquiry'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
        ]);

        // B2B Distributor Applications
        register_rest_route($namespace, '/b2b/distributors', [
            'methods'             => 'GET',
            'callback'            => [$this, 'list_distributors'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);
        register_rest_route($namespace, '/b2b/distributors/(?P<id>\d+)', [
            [
                'methods'             => 'PATCH',
                'callback'            => [$this, 'update_distributor_status'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [$this, 'delete_distributor'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
        ]);

        // Career application submission (public)
        register_rest_route($namespace, '/careers', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_career_application'],
            'permission_callback' => '__return_true',
        ]);

        // B2B Career Applications (admin)
        register_rest_route($namespace, '/b2b/careers', [
            'methods'             => 'GET',
            'callback'            => [$this, 'list_careers'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);
        register_rest_route($namespace, '/b2b/careers/(?P<id>\d+)', [
            [
                'methods'             => 'PATCH',
                'callback'            => [$this, 'update_career_status'],
                'permission_callback' => [$this, 'check_admin_permissions'],
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [$this, 'delete_career'],
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
     * SEO: Send X-Robots-Tag: noindex, nofollow on all frontend HTML pages.
     *
     * template_redirect only fires on the frontend (posts, pages, archives,
     * feeds, etc.) — NOT on REST API requests (/wp-json/*), admin pages
     * (/wp-admin/*), AJAX (admin-ajax.php), or static uploads
     * (/wp-content/uploads/*), so those remain unaffected.
     */
    public function send_x_robots_tag_noindex() {
        if (headers_sent()) {
            return;
        }
        header('X-Robots-Tag: noindex, nofollow', true);
    }

    /**
     * SEO: Force the <meta name="robots"> tag to noindex, nofollow on all
     * frontend pages. Defense-in-depth alongside the X-Robots-Tag header.
     */
    public function filter_wp_robots_noindex(array $robots): array {
        $robots['noindex']  = true;
        $robots['nofollow'] = true;
        return $robots;
    }

    /**
     * SEO: Return a robots.txt that disallows all crawling. This is
     * defense-in-depth; the primary exclusion is the X-Robots-Tag header
     * and noindex meta tag. No sitemap is referenced.
     */
    public function filter_robots_txt_disallow_all(string $output, string $public): string {
        return "User-agent: *\nDisallow: /\n";
    }

    /**
     * SEO: Ensure "Discourage search engines from indexing this site" is
     * enabled (blog_public = '0'). Runs once; a flag option prevents
     * repeated writes. This covers the case where the plugin was already
     * active before the activation hook existed.
     */
    public function ensure_discourage_search_engines() {
        if (get_option('prag_core_seo_initialized') === 'yes') {
            return;
        }
        if (get_option('blog_public') !== '0') {
            update_option('blog_public', '0');
        }
        update_option('prag_core_seo_initialized', 'yes');
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

        // Persist to prag_contact CPT so the admin can view/manage submissions
        $post_id = wp_insert_post([
            'post_type'   => 'prag_contact',
            'post_title'  => $name . ' – ' . ($enquiry_type ?: 'General Enquiry'),
            'post_status' => 'private',
            'meta_input'  => [
                'contact_name'    => $name,
                'contact_email'   => $email,
                'contact_phone'   => $phone,
                'contact_company' => $company,
                'enquiry_type'    => $enquiry_type ?: 'General Enquiry',
                'contact_message' => $message,
                'contact_status'  => 'new',
                'submitted_at'    => current_time('c'),
            ],
        ]);

        return ['success' => true, 'message' => 'Message received', 'id' => $post_id];
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
                // Prag-Admin B2B UI defaults distributor applications to "pending"
                'application_status' => 'pending',
                'submitted_at'       => current_time('mysql'),
            ],
        ]);

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
            'brand_banner_kicker'       => 'HELP ME CHOOSE',
            'brand_banner_title'        => 'Not Sure What to Buy?',
            'brand_banner_description'  => 'Tell us what you want to power and we\'ll help you find the right PRAG setup.',
            'brand_banner_cta'          => 'Use Power Calculator',
            'brand_banner_link'         => '/power-calculator',
            'brand_banner_whatsapp_text'=> 'Ask PRAG on WhatsApp',
            'brand_banner_image'        => '',
            'final_cta_title'           => 'Ready for More Reliable Power?',
            'final_cta_subtitle'        => 'Shop PRAG power solutions for your home today.',
            'final_cta_shop_text'       => 'Shop Now',
            'final_cta_shop_link'       => '/products',
            'final_cta_whatsapp_text'   => 'Chat with PRAG on WhatsApp',
            'checkout_faq_kicker'       => 'FAQ',
            'checkout_faq_title'        => 'Still deciding? Here\'s what you need to know before you buy.',
            'checkout_faq_subtitle'     => 'Straight answers on sizing, warranty, delivery and installation — so you can shop with confidence and never second-guess your power setup.',
            'checkout_faq_link_text'    => 'Find your perfect inverter size',
            'checkout_faq_link_url'     => '/power-calculator',
            'checkout_faq_items'        => [
                ['question' => 'Which inverter size should I buy?', 'answer' => 'The right inverter size depends on the total wattage of the appliances you want to power and how long you need them running. Add up the wattage of your essential loads (fridge, lights, TV, fans) and add a 20–30% buffer for surge power. Use our Power Calculator for an instant recommendation, or chat with our team for a tailored sizing.'],
                ['question' => 'How do I know what battery I need?', 'answer' => 'Battery sizing depends on your inverter size, how long you want backup power, and your daily energy usage. A 12V system works for small setups, while 48V is better for larger loads. Lithium batteries last longer and charge faster than lead-acid. Use our Power Calculator or talk to our team to match the right battery capacity (Ah) to your inverter and runtime needs.'],
                ['question' => 'How long will my battery last?', 'answer' => 'Battery runtime depends on capacity (kWh), the load you are running, and battery chemistry. A 2.4kWh lithium battery powering a 300W load gives roughly 6–7 hours of backup. Lithium batteries typically last 5–10 years with proper use, while lead-acid batteries last 2–4 years. Our team can help you estimate runtime for your specific setup.'],
                ['question' => 'Do PRAG products come with warranty?', 'answer' => 'Yes. All PRAG products come with a manufacturer\'s warranty — typically 5 years for inverters and stabilizers, and up to 10 years for lithium batteries. Warranty covers manufacturing defects and component failures under normal use. Your warranty is activated automatically at purchase.'],
                ['question' => 'Do you deliver nationwide?', 'answer' => 'Yes, we deliver to all 36 states in Nigeria. Orders within Lagos arrive within 1–2 business days, while other states typically take 2–5 business days. Shipping is free on orders over ₦500,000. You will receive tracking details once your order is dispatched.'],
                ['question' => 'Can I get help choosing the right product?', 'answer' => 'Absolutely. You can use our Power Calculator for an instant recommendation, chat with us on WhatsApp, call our support line, or visit any PRAG store. Our team will guide you to the right inverter, battery, or solar setup based on your budget and power needs.'],
                ['question' => 'Can PRAG help with installation?', 'answer' => 'Yes. PRAG offers professional installation through our certified engineers and authorized partner network across Nigeria. We handle everything from residential inverter setups to full solar installations. Schedule an installation by contacting us or visiting a PRAG store after your purchase.'],
            ],
            'checkout_faq_banner_enabled' => true,
            'checkout_faq_banner_image'   => 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png',
            'checkout_faq_banner_link'    => '/products/inverters',
            'testimonial_enabled'        => true,
            'testimonial_title'          => 'Trusted in Homes Across Nigeria',
            'testimonial_subtitle'       => 'Real reviews from real PRAG customers who took control of their power.',
            'testimonial_items'          => [
                ['rating' => 5, 'quote' => 'I bought a 3.5kVA inverter and two lithium batteries for my flat. From the day it was installed, I have not had a single dark night. The team came, sized everything properly, and installed it clean. Worth every naira.', 'name' => 'Chidi', 'location' => 'Lekki, Lagos', 'product' => '3.5kVA Inverter + Lithium Battery', 'image' => ''],
                ['rating' => 5, 'quote' => 'The stabilizer saved my fridge and TV during the voltage spikes in our area. It has been running silently for eight months now — no issues at all. PRAG makes solid products.', 'name' => 'Aisha', 'location' => 'Kano', 'product' => '5kVA Voltage Stabilizer', 'image' => ''],
                ['rating' => 5, 'quote' => 'I was tired of spending on fuel. PRAG set up a solar system for my home and I barely touch my generator now. Installation was professional and the support team answered every question.', 'name' => 'Emeka', 'location' => 'Port Harcourt', 'product' => 'Solar System Installation', 'image' => ''],
            ],
            'home_need_enabled'      => true,
            'home_need_title'        => 'Power Your Home Your Way',
            'home_need_subtitle'     => 'Whatever your setup, PRAG has a reliable power solution sized for how you actually live.',
            'home_need_items'        => [
                ['title' => 'For Apartments', 'description' => 'Compact inverter and battery combos that fit tight spaces and keep your essentials running through every outage.', 'cta' => 'Get Recommendations', 'link' => '/home-needs/apartments', 'icon' => '', 'image' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
                ['title' => 'For Family Homes', 'description' => 'Higher-capacity inverters with extended-life lithium batteries for longer runtime across more rooms and appliances.', 'cta' => 'Get Recommendations', 'link' => '/home-needs/family-homes', 'icon' => '', 'image' => 'https://images.unsplash.com/photo-1568605114967-8130f81a6e54?w=800&q=80'],
                ['title' => 'For Home Offices', 'description' => 'Quiet, clean power that keeps your laptop, internet router, and essential devices online without missing a beat.', 'cta' => 'Get Recommendations', 'link' => '/home-needs/home-offices', 'icon' => '', 'image' => 'https://images.unsplash.com/photo-1593696954577-ab3d39817b21?w=800&q=80'],
                ['title' => 'For Solar Homes', 'description' => 'Solar panels and hybrid inverters that cut your grid and generator dependence — and your fuel bill.', 'cta' => 'Get Recommendations', 'link' => '/home-needs/solar-homes', 'icon' => '', 'image' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'],
            ],
            'socials' => [
                'facebook'  => 'https://www.facebook.com/pragpowersolutions',
                'instagram' => 'https://www.instagram.com/prag_ng/',
                'linkedin'  => 'https://www.linkedin.com/company/prag/',
                'twitter'   => '',
                'whatsapp'  => 'https://wa.me/2348032170129',
            ],
            'slide_transition' => 'fade',
            'slides' => [
                [
                    'title'             => 'No Hype. Just Inverters That Deliver.',
                    'description'       => 'Choose inverters engineered for real-world loads. Shop reliable power systems today.',
                    'cta'               => 'Buy Inverters Built to Last',
                    'link'              => '/products',
                    'productImage'      => 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png',
                    'productAlt'        => 'Heavy Duty Inverter',
                    'backgroundImage'   => 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png',
                    'showProductImage'  => true,
                    'enabled'           => true,
                ],
                [
                    'title'             => 'Power Your Home. Power Your Business.',
                    'description'       => 'From residential to industrial applications. Trusted inverters for every power need.',
                    'cta'               => 'Explore Our Range',
                    'link'              => '/products',
                    'productImage'      => 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
                    'productAlt'        => 'Residential Inverter',
                    'backgroundImage'   => 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png',
                    'showProductImage'  => true,
                    'enabled'           => true,
                ],
                [
                    'title'             => 'Built Tough. Tested Tougher.',
                    'description'       => 'Heavy-duty inverters designed to handle the toughest loads without compromise.',
                    'cta'               => 'Shop Heavy Duty Inverters',
                    'link'              => '/inverter',
                    'productImage'      => 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
                    'productAlt'        => 'Industrial Inverter',
                    'backgroundImage'   => 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png',
                    'showProductImage'  => true,
                    'enabled'           => true,
                ],
                [
                    'title'             => 'Reliable Power. Unbeatable Performance.',
                    'description'       => 'Experience consistent power delivery with inverters engineered for excellence.',
                    'cta'               => 'Get Started Today',
                    'link'              => '/products',
                    'productImage'      => 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
                    'productAlt'        => 'Premium Inverter',
                    'backgroundImage'   => 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png',
                    'showProductImage'  => true,
                    'enabled'           => true,
                ],
            ],
            'categories' => [
                ['name' => 'Voltage Stabilizers', 'slug' => 'voltage-stabilizers', 'image' => 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png'],
                ['name' => 'Inverters',           'slug' => 'inverters',            'image' => 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png'],
                ['name' => 'Solar Panels',        'slug' => 'solar',                'image' => 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png'],
                ['name' => 'Batteries',           'slug' => 'batteries',            'image' => 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png'],
            ],
            'hidden_categories' => [],
            'category_order' => [],
            'subcategory_order' => [],
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
     * Get Post SEO Meta (Yoast postmeta for headless frontend)
     * Returns Yoast title, metadesc, and focuskw for a given post ID.
     * Read-only, publicly accessible.
     */
    public function get_post_seo_meta($request) {
        $id = (int) $request->get_param('id');
        if ($id <= 0) {
            return new WP_Error('invalid_id', 'Valid post ID is required', ['status' => 400]);
        }
        return rest_ensure_response([
            'id'              => $id,
            'seo_title'       => get_post_meta($id, '_yoast_wpseo_title', true),
            'meta_description' => get_post_meta($id, '_yoast_wpseo_metadesc', true),
            'focus_keyphrase' => get_post_meta($id, '_yoast_wpseo_focuskw', true),
        ]);
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

    // -----------------------------------------------------------------------
    // Product Custom Tabs (YIKES Custom Product Tabs for WooCommerce)
    // -----------------------------------------------------------------------

    /**
     * Get product custom tabs as JSON (parsed from yikes_woo_products_tabs serialized meta).
     */
    public function get_product_custom_tabs($request) {
        $product_id = intval($request->get_param('id'));
        if (!$product_id) {
            return new WP_Error('missing_id', 'Product ID is required', ['status' => 400]);
        }

        $raw = get_post_meta($product_id, 'yikes_woo_products_tabs', true);
        if (empty($raw)) {
            return rest_ensure_response([]);
        }

        $tabs = maybe_unserialize($raw);
        if (!is_array($tabs)) {
            return rest_ensure_response([]);
        }

        // Normalize: ensure each tab has title, id, content
        $normalized = array_map(function($tab) {
            return [
                'title'   => isset($tab['title']) ? (string) $tab['title'] : '',
                'id'      => isset($tab['id']) ? (string) $tab['id'] : '',
                'content' => isset($tab['content']) ? (string) $tab['content'] : '',
            ];
        }, array_values($tabs));

        return rest_ensure_response($normalized);
    }

    /**
     * Update product custom tabs (saves back as serialized yikes_woo_products_tabs meta).
     */
    public function update_product_custom_tabs($request) {
        $product_id = intval($request->get_param('id'));
        if (!$product_id) {
            return new WP_Error('missing_id', 'Product ID is required', ['status' => 400]);
        }

        $params = $request->get_json_params();
        if (!is_array($params)) {
            return new WP_Error('invalid_body', 'Expected an array of tab objects', ['status' => 400]);
        }

        // Build the array in the format YIKES plugin expects
        $tabs = [];
        foreach ($params as $tab) {
            $tabs[] = [
                'title'   => sanitize_text_field($tab['title'] ?? 'Specifications'),
                'id'      => sanitize_title($tab['id'] ?? 'specifications'),
                'content' => $tab['content'] ?? '',
            ];
        }

        update_post_meta($product_id, 'yikes_woo_products_tabs', maybe_serialize($tabs));

        return rest_ensure_response([
            'success' => true,
            'message' => 'Custom tabs updated',
            'tabs'    => $tabs,
        ]);
    }

    // -----------------------------------------------------------------------
    // B2B Enquiries (prag_contact CPT)
    // -----------------------------------------------------------------------

    public function list_enquiries($request) {
        $page     = max(1, intval($request->get_param('page') ?: 1));
        $search   = sanitize_text_field($request->get_param('search') ?: '');
        $status   = sanitize_text_field($request->get_param('status') ?: '');
        $per_page = 20;

        $args = [
            'post_type'      => 'prag_contact',
            // Form submissions can be saved under other non-trash statuses depending on capabilities.
            'post_status'    => ['private', 'publish', 'draft', 'pending'],
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ];

        $meta_query = ['relation' => 'AND'];
        if ($status) {
            // Treat missing status as "new" so legacy records still appear.
            if ($status === 'new') {
                $meta_query[] = [
                    'relation' => 'OR',
                    ['key' => 'contact_status', 'compare' => 'NOT EXISTS'],
                    ['key' => 'contact_status', 'value' => 'new', 'compare' => '='],
                ];
            } else {
                $meta_query[] = [
                    'key'     => 'contact_status',
                    'value'   => $status,
                    'compare' => '=',
                ];
            }
        }
        if ($search) {
            $meta_query[] = [
                'relation' => 'OR',
                ['key' => 'contact_name', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'contact_email', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'contact_company', 'value' => $search, 'compare' => 'LIKE'],
            ];
        }
        if (count($meta_query) > 1) {
            $args['meta_query'] = $meta_query;
        }

        $query = new WP_Query($args);
        $total = $query->found_posts;

        $data = array_map(function($post) {
            return [
                'id'      => strval($post->ID),
                'name'    => get_post_meta($post->ID, 'contact_name', true)    ?: '',
                'company' => get_post_meta($post->ID, 'contact_company', true) ?: '',
                'email'   => get_post_meta($post->ID, 'contact_email', true)   ?: '',
                'phone'   => get_post_meta($post->ID, 'contact_phone', true)   ?: '',
                'type'    => get_post_meta($post->ID, 'enquiry_type', true)    ?: 'General Enquiry',
                'message' => get_post_meta($post->ID, 'contact_message', true) ?: '',
                'status'  => get_post_meta($post->ID, 'contact_status', true)  ?: 'new',
                'date'    => get_post_meta($post->ID, 'submitted_at', true)    ?: $post->post_date,
            ];
        }, $query->posts);

        // Return an array (WP list-endpoint convention). Total stays in header for pagination.
        $response = rest_ensure_response($data);
        $response->header('X-WP-Total', $total);
        return $response;
    }

    public function update_enquiry_status($request) {
        $id     = intval($request->get_param('id'));
        $body   = $request->get_json_params();
        $status = sanitize_text_field($body['status'] ?? '');

        if (!$id || get_post_type($id) !== 'prag_contact') {
            return new WP_Error('not_found', 'Enquiry not found', ['status' => 404]);
        }

        update_post_meta($id, 'contact_status', $status);
        return ['ok' => true];
    }

    public function delete_enquiry($request) {
        $id = intval($request->get_param('id'));

        if (!$id || get_post_type($id) !== 'prag_contact') {
            return new WP_Error('not_found', 'Enquiry not found', ['status' => 404]);
        }

        wp_trash_post($id);
        return ['ok' => true];
    }

    // -----------------------------------------------------------------------
    // B2B Distributor Applications (prag_distributor CPT)
    // -----------------------------------------------------------------------

    public function list_distributors($request) {
        $page     = max(1, intval($request->get_param('page') ?: 1));
        $search   = sanitize_text_field($request->get_param('search') ?: '');
        $status   = sanitize_text_field($request->get_param('status') ?: '');
        $per_page = 20;

        $args = [
            'post_type'      => 'prag_distributor',
            // Form submissions can be saved under other non-trash statuses depending on capabilities.
            'post_status'    => ['private', 'publish', 'draft', 'pending'],
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ];

        $meta_query = ['relation' => 'AND'];
        if ($status) {
            // Treat missing status as "pending" so legacy records still appear.
            if ($status === 'pending') {
                $meta_query[] = [
                    'relation' => 'OR',
                    ['key' => 'application_status', 'compare' => 'NOT EXISTS'],
                    ['key' => 'application_status', 'value' => 'pending', 'compare' => '='],
                ];
            } else {
                $meta_query[] = [
                    'key'     => 'application_status',
                    'value'   => $status,
                    'compare' => '=',
                ];
            }
        }
        if ($search) {
            $meta_query[] = [
                'relation' => 'OR',
                ['key' => 'applicant_name', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'applicant_email', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'business_name', 'value' => $search, 'compare' => 'LIKE'],
            ];
        }
        if (count($meta_query) > 1) {
            $args['meta_query'] = $meta_query;
        }

        $query = new WP_Query($args);
        $total = $query->found_posts;

        $data = array_map(function($post) {
            return [
                'id'      => strval($post->ID),
                'name'    => get_post_meta($post->ID, 'applicant_name', true)    ?: '',
                'company' => get_post_meta($post->ID, 'business_name', true)     ?: '',
                'email'   => get_post_meta($post->ID, 'applicant_email', true)   ?: '',
                'phone'   => get_post_meta($post->ID, 'applicant_phone', true)   ?: '',
                'city'    => get_post_meta($post->ID, 'business_city', true)     ?: '',
                'state'   => '',
                'tier'    => get_post_meta($post->ID, 'partnership_tier', true)  ?: '',
                'type'    => get_post_meta($post->ID, 'business_type', true)     ?: '',
                'message' => get_post_meta($post->ID, 'applicant_message', true) ?: '',
                'status'  => get_post_meta($post->ID, 'application_status', true) ?: 'pending',
                'date'    => get_post_meta($post->ID, 'submitted_at', true)      ?: $post->post_date,
            ];
        }, $query->posts);

        // Return an array (WP list-endpoint convention). Total stays in header for pagination.
        $response = rest_ensure_response($data);
        $response->header('X-WP-Total', $total);
        return $response;
    }

    public function update_distributor_status($request) {
        $id     = intval($request->get_param('id'));
        $body   = $request->get_json_params();
        $status = sanitize_text_field($body['status'] ?? '');

        if (!$id || get_post_type($id) !== 'prag_distributor') {
            return new WP_Error('not_found', 'Application not found', ['status' => 404]);
        }

        update_post_meta($id, 'application_status', $status);
        return ['ok' => true];
    }

    public function delete_distributor($request) {
        $id = intval($request->get_param('id'));

        if (!$id || get_post_type($id) !== 'prag_distributor') {
            return new WP_Error('not_found', 'Application not found', ['status' => 404]);
        }

        wp_trash_post($id);
        return ['ok' => true];
    }

    /**
     * Handle Career Application Submission
     */
    public function handle_career_application($request) {
        $p = $request->get_json_params();

        $required = ['name', 'email', 'phone', 'position'];
        foreach ($required as $field) {
            if (empty($p[$field])) {
                return new WP_Error('missing_fields', ucfirst($field) . ' is required.', ['status' => 400]);
            }
        }

        $name        = sanitize_text_field($p['name']);
        $email       = sanitize_email($p['email']);
        $phone       = sanitize_text_field($p['phone']);
        $location    = sanitize_text_field($p['location'] ?? '');
        $position    = sanitize_text_field($p['position']);
        $experience  = sanitize_text_field($p['experience'] ?? '');
        $education   = sanitize_text_field($p['education'] ?? '');
        $cover_letter = sanitize_textarea_field($p['message'] ?? $p['coverLetter'] ?? '');
        $cv_filename = sanitize_text_field($p['cvFilename'] ?? '');

        $post_id = wp_insert_post([
            'post_type'   => 'prag_career',
            'post_title'  => $name . ' – ' . $position,
            'post_status' => 'private',
            'meta_input'  => [
                'applicant_name'      => $name,
                'applicant_email'     => $email,
                'applicant_phone'     => $phone,
                'applicant_location'  => $location,
                'position'            => $position,
                'experience'          => $experience,
                'education'           => $education,
                'cover_letter'        => $cover_letter,
                'cv_filename'         => $cv_filename,
                'application_status'  => 'new',
                'submitted_at'        => current_time('c'),
            ],
        ]);

        return ['success' => true, 'message' => 'Application received', 'id' => $post_id];
    }

    // -----------------------------------------------------------------------
    // B2B Career Applications (prag_career CPT)
    // -----------------------------------------------------------------------

    public function list_careers($request) {
        $page     = max(1, intval($request->get_param('page') ?: 1));
        $search   = sanitize_text_field($request->get_param('search') ?: '');
        $status   = sanitize_text_field($request->get_param('status') ?: '');
        $per_page = max(1, intval($request->get_param('per_page') ?: 20));

        $args = [
            'post_type'      => 'prag_career',
            'post_status'    => ['private', 'publish', 'draft', 'pending'],
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ];

        $meta_query = ['relation' => 'AND'];
        if ($status) {
            if ($status === 'new') {
                $meta_query[] = [
                    'relation' => 'OR',
                    ['key' => 'application_status', 'compare' => 'NOT EXISTS'],
                    ['key' => 'application_status', 'value' => 'new', 'compare' => '='],
                ];
            } else {
                $meta_query[] = [
                    'key'     => 'application_status',
                    'value'   => $status,
                    'compare' => '=',
                ];
            }
        }
        if ($search) {
            $meta_query[] = [
                'relation' => 'OR',
                ['key' => 'applicant_name', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'applicant_email', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'position', 'value' => $search, 'compare' => 'LIKE'],
                ['key' => 'applicant_location', 'value' => $search, 'compare' => 'LIKE'],
            ];
        }
        if (count($meta_query) > 1) {
            $args['meta_query'] = $meta_query;
        }

        $query = new WP_Query($args);
        $total = $query->found_posts;

        $data = array_map(function($post) {
            return [
                'id'         => strval($post->ID),
                'name'       => get_post_meta($post->ID, 'applicant_name', true)     ?: '',
                'email'      => get_post_meta($post->ID, 'applicant_email', true)    ?: '',
                'phone'      => get_post_meta($post->ID, 'applicant_phone', true)     ?: '',
                'location'   => get_post_meta($post->ID, 'applicant_location', true)  ?: '',
                'position'   => get_post_meta($post->ID, 'position', true)            ?: '',
                'experience' => get_post_meta($post->ID, 'experience', true)         ?: '',
                'education'  => get_post_meta($post->ID, 'education', true)          ?: '',
                'message'    => get_post_meta($post->ID, 'cover_letter', true)         ?: '',
                'cvFilename' => get_post_meta($post->ID, 'cv_filename', true)         ?: '',
                'status'     => get_post_meta($post->ID, 'application_status', true)  ?: 'new',
                'date'       => get_post_meta($post->ID, 'submitted_at', true)        ?: $post->post_date,
            ];
        }, $query->posts);

        $response = rest_ensure_response($data);
        $response->header('X-WP-Total', $total);
        return $response;
    }

    public function update_career_status($request) {
        $id     = intval($request->get_param('id'));
        $body   = $request->get_json_params();
        $status = sanitize_text_field($body['status'] ?? '');

        if (!$id || get_post_type($id) !== 'prag_career') {
            return new WP_Error('not_found', 'Career application not found', ['status' => 404]);
        }

        update_post_meta($id, 'application_status', $status);
        return ['ok' => true];
    }

    public function delete_career($request) {
        $id = intval($request->get_param('id'));

        if (!$id || get_post_type($id) !== 'prag_career') {
            return new WP_Error('not_found', 'Career application not found', ['status' => 404]);
        }

        wp_trash_post($id);
        return ['ok' => true];
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

/**
 * SEO: On plugin activation, enable "Discourage search engines from indexing
 * this site" (Settings → Reading). This sets blog_public to '0' so WordPress
 * core itself outputs noindex/nofollow and blocks the core sitemap.
 */
register_activation_hook(__FILE__, 'prag_core_seo_activation');
function prag_core_seo_activation() {
    update_option('blog_public', '0');
}
