<?php
/** Shared Central access rules and account onboarding. */
if (!defined('ABSPATH')) exit;

class Prag_User_Access {
    private $pending_welcomes = [];

    public function __construct() {
        add_action('user_register', [$this, 'queue_welcome'], 10, 2);
        add_action('rest_after_insert_user', [$this, 'welcome_rest_user'], 20, 3);
        add_action('shutdown', [$this, 'send_pending_welcomes']);
        add_action('rest_api_init', [$this, 'register_account_routes']);
        add_action('after_password_reset', [$this, 'password_reset'], 10, 2);
        add_action('profile_update', [$this, 'profile_updated'], 10, 2);
        add_action('admin_menu', [$this, 'filter_menus'], 999);
        add_action('current_screen', [$this, 'guard_admin_screen']);
        add_action('admin_notices', [$this, 'password_change_notice']);
        add_filter('rest_pre_dispatch', [$this, 'guard_rest'], 10, 3);
        add_filter('map_meta_cap', [$this, 'guard_post_capability'], 20, 4);
    }

    private function config() {
        $raw = get_option('prag_admin_config', '');
        $config = is_array($raw) ? $raw : json_decode($raw, true);
        return is_array($config) ? $config : [];
    }

    /** null means administrator; [] means no managed modules. WP caps still apply. */
    public function allowed_modules($user) {
        if (in_array('administrator', (array) $user->roles, true)) return null;
        $config = $this->config();
        $state = $config['users'][(string) $user->ID] ?? ['active' => true, 'portals' => ['b2c']];
        if (empty($state['active']) || !in_array('b2c', $state['portals'] ?? [], true)) return [];
        $defaults = [
            'author' => ['media' => true, 'blog' => true],
            'contributor' => ['blog' => true],
            'editor' => ['dashboard' => true, 'media' => true, 'blog' => true],
            'shop_manager' => array_fill_keys(['dashboard', 'products', 'media', 'orders', 'reports', 'customers', 'blog', 'stores', 'siteSettings'], true),
        ];
        $modules = [];
        foreach ((array) $user->roles as $role) {
            $policy = $config['roleModuleVisibility'][$role] ?? ($defaults[$role] ?? []);
            foreach ($policy as $module => $enabled) {
                if ($enabled === true) $modules[] = $module;
            }
        }
        $modules = array_values(array_unique($modules));
        if (!empty($state['b2cModules'])) $modules = array_values(array_intersect($modules, $state['b2cModules']));
        return $modules;
    }

    private function post_module($type) {
        $map = ['post' => 'blog', 'attachment' => 'media', 'page' => 'pages', 'product' => 'products',
            'product_variation' => 'products', 'prag_document' => 'products', 'prag_store' => 'stores',
            'shop_order' => 'orders', 'shop_order_placehold' => 'orders'];
        return $map[$type] ?? null;
    }

    public function guard_post_capability($caps, $cap, $user_id, $args) {
        if (!in_array($cap, ['edit_post', 'delete_post', 'read_post'], true) || empty($args[0])) return $caps;
        $user = get_userdata($user_id);
        if (!$user) return $caps;
        $modules = $this->allowed_modules($user);
        if ($modules === null) return $caps;
        $type = get_post_type((int) $args[0]);
        // Public published content remains readable on the storefront.
        if ($cap === 'read_post' && get_post_status((int) $args[0]) === 'publish' && is_post_type_viewable($type)) return $caps;
        return in_array($this->post_module($type), $modules, true) ? $caps : ['do_not_allow'];
    }

    public function filter_menus() {
        $modules = $this->allowed_modules(wp_get_current_user());
        if ($modules === null) return;
        global $menu;
        foreach ((array) $menu as $item) {
            $slug = $item[2];
            $map = ['index.php' => 'dashboard', 'edit.php' => 'blog', 'upload.php' => 'media',
                'edit.php?post_type=page' => 'pages', 'edit.php?post_type=product' => 'products',
                'edit.php?post_type=prag_document' => 'products', 'edit.php?post_type=prag_store' => 'stores',
                'edit.php?post_type=shop_order' => 'orders', 'woocommerce' => 'orders', 'wc-admin' => 'reports',
                'edit-comments.php' => 'blog'];
            if ($slug === 'profile.php' || strpos($slug, 'separator') === 0) continue;
            if (!isset($map[$slug]) || !in_array($map[$slug], $modules, true)) remove_menu_page($slug);
        }
    }

    public function guard_admin_screen($screen) {
        $user = wp_get_current_user();
        if (!$user->ID) return;
        if (get_user_meta($user->ID, 'prag_must_change_password', true) && $screen->base !== 'profile') {
            wp_safe_redirect(admin_url('profile.php?prag_change_password=1'));
            exit;
        }
        $modules = $this->allowed_modules($user);
        if ($modules === null || $screen->base === 'profile') return;
        $module = null;
        if (in_array($screen->base, ['post', 'edit'], true)) $module = $this->post_module($screen->post_type);
        elseif (in_array($screen->base, ['upload', 'media'], true)) $module = 'media';
        elseif ($screen->base === 'dashboard') $module = 'dashboard';
        elseif ($screen->base === 'edit-comments') $module = 'blog';
        elseif ($screen->base === 'edit-tags' || $screen->base === 'term') {
            $module = in_array($screen->taxonomy, ['category', 'post_tag'], true) ? 'blog' : 'products';
        } elseif ($screen->id === 'woocommerce_page_wc-orders') $module = 'orders';
        elseif ($screen->id === 'woocommerce_page_wc-reports') $module = 'reports';
        if ($module && in_array($module, $modules, true)) return;
        if ($screen->base === 'dashboard') {
            foreach (['blog' => 'edit.php', 'media' => 'upload.php', 'products' => 'edit.php?post_type=product'] as $key => $url) {
                if (in_array($key, $modules, true)) { wp_safe_redirect(admin_url($url)); exit; }
            }
        }
        wp_die('Your account does not have access to this area.', 'Access denied', ['response' => 403]);
    }

    public function guard_rest($result, $server, $request) {
        if ($result !== null || !is_user_logged_in()) return $result;
        $user = wp_get_current_user();
        $route = $request->get_route();
        $method = $request->get_method();
        $read = in_array($method, ['GET', 'HEAD', 'OPTIONS'], true);
        if (get_user_meta($user->ID, 'prag_must_change_password', true)) {
            $allowed = ($read && $route === '/wp/v2/users/me') || $route === '/prag-core/v1/change-temporary-password' || strpos($route, '/jwt-auth/') === 0;
            if (!$allowed) return new WP_Error('prag_password_change_required', 'Change your temporary password first.', ['status' => 403]);
        }
        $modules = $this->allowed_modules($user);
        if ($modules === null) return $result;
        $module = null;
        if (preg_match('#^/wp/v2/([^/]+)#', $route, $matches)) {
            $map = ['posts' => 'blog', 'categories' => 'blog', 'tags' => 'blog', 'comments' => 'blog',
                'media' => 'media', 'pages' => 'pages', 'prag_store' => 'stores', 'prag_document' => 'products',
                'product' => 'products', 'product_variation' => 'products'];
            $module = $map[$matches[1]] ?? null;
            if (!$module && in_array($matches[1], ['prag_contact', 'prag_career', 'prag_distributor'], true)) {
                return new WP_Error('prag_forbidden', 'Access denied.', ['status' => 403]);
            }
            // WordPress capabilities continue to guard users and all other core routes.
            if ($read && $request->get_param('context') !== 'edit' && in_array($matches[1], ['posts', 'pages', 'categories', 'tags'], true)) return $result;
        } elseif (preg_match('#^/wc/v[0-9]+/([^/]+)#', $route, $matches)) {
            $map = ['products' => 'products', 'orders' => 'orders', 'customers' => 'customers', 'reports' => 'reports', 'shipping' => 'shipping', 'settings' => 'siteSettings'];
            $module = $map[$matches[1]] ?? 'adminSettings';
        }
        if ($module && !in_array($module, $modules, true)) return new WP_Error('prag_forbidden', 'Access denied.', ['status' => 403]);
        return $result;
    }

    public function register_account_routes() {
        register_rest_field('user', 'prag_must_change_password', [
            'get_callback' => function($user) {
                return (get_current_user_id() === (int) $user['id'] || current_user_can('list_users'))
                    && (bool) get_user_meta($user['id'], 'prag_must_change_password', true);
            },
            'schema' => ['type' => 'boolean', 'context' => ['edit'], 'readonly' => true],
        ]);
        register_rest_field('user', 'prag_welcome_email_status', [
            'get_callback' => function($user) {
                return current_user_can('list_users') ? (string) get_user_meta($user['id'], 'prag_welcome_email_status', true) : '';
            },
            'schema' => ['type' => 'string', 'context' => ['edit'], 'readonly' => true],
        ]);
        register_rest_route('prag-core/v1', '/users/(?P<id>\d+)/resend-welcome', [
            'methods' => 'POST',
            'permission_callback' => function($request) {
                return current_user_can('manage_options') && current_user_can('edit_user', (int) $request->get_param('id'));
            },
            'callback' => [$this, 'resend_welcome'],
        ]);
        register_rest_route('prag-core/v1', '/change-temporary-password', [
            'methods' => 'POST',
            'permission_callback' => function() { return is_user_logged_in() && (bool) get_user_meta(get_current_user_id(), 'prag_must_change_password', true); },
            'callback' => function($request) {
                $password = $request->get_param('password');
                $user = wp_get_current_user();
                if (!is_string($password) || strlen($password) < 12) return new WP_Error('weak_password', 'Use at least 12 characters.', ['status' => 400]);
                if (wp_check_password($password, $user->user_pass, $user->ID)) return new WP_Error('same_password', 'Choose a different password.', ['status' => 400]);
                wp_set_password($password, $user->ID);
                delete_user_meta($user->ID, 'prag_must_change_password');
                return ['success' => true];
            },
        ]);
    }

    public function resend_welcome($request) {
        $user_id = (int) $request->get_param('id');
        $user = get_userdata($user_id);
        if (!$user || !is_email($user->user_email)) return new WP_Error('prag_invalid_recipient', 'This user has no valid email address.', ['status' => 400]);
        if ($user_id === get_current_user_id()) return new WP_Error('prag_self_reset', 'Use your profile to change your own password.', ['status' => 400]);
        $config = $this->config();
        $state = $config['users'][(string) $user_id] ?? ['active' => true, 'portals' => ['b2c']];
        if (empty($state['active']) || empty($state['portals'])) return new WP_Error('prag_inactive_user', 'Activate this account and assign portal access before sending access details.', ['status' => 400]);
        $lock = 'prag_welcome_resend_lock_' . $user_id;
        $cooldown = 'prag_welcome_resend_' . $user_id;
        if (get_transient($cooldown)) return new WP_Error('prag_resend_cooldown', 'An access email was recently sent. Wait five minutes before resending.', ['status' => 429]);
        // Atomic lock prevents concurrent requests from issuing different passwords.
        $lock_time = (int) get_option($lock, 0);
        if ($lock_time && $lock_time < time() - 300) delete_option($lock);
        if (!add_option($lock, time(), '', false)) return new WP_Error('prag_resend_in_progress', 'An access email is already being sent.', ['status' => 429]);
        try {
            $password = wp_generate_password(24, true, false);
            $updated = wp_update_user(['ID' => $user_id, 'user_pass' => $password]);
            if (is_wp_error($updated)) return new WP_Error('prag_password_update_failed', 'The password could not be replaced. No email was sent.', ['status' => 500]);
            $this->pending_welcomes[$user_id] = ['password' => $password, 'staff_created' => true];
            update_user_meta($user_id, 'prag_must_change_password', 1);
            update_user_meta($user_id, 'prag_welcome_email_status', 'pending');
            $sent = $this->send_welcome($user_id);
            if (!$sent) return new WP_Error('prag_welcome_failed', 'The password was replaced, but the email could not be sent. Check mail settings and retry Resend Access Email.', ['status' => 502]);
            set_transient($cooldown, 1, 300);
            return ['success' => true, 'message' => 'A fresh temporary password and login link were emailed to the account address. The previous password no longer works.'];
        } finally {
            delete_option($lock);
        }
    }

    public function queue_welcome($user_id, $userdata) {
        // Keep credentials in request memory only; never write them to options, meta, or logs.
        $this->pending_welcomes[$user_id] = [
            'password' => isset($userdata['user_pass']) ? (string) wp_unslash($userdata['user_pass']) : '',
            'staff_created' => current_user_can('create_users'),
        ];
        update_user_meta($user_id, 'prag_welcome_email_status', 'pending');
        if ($this->pending_welcomes[$user_id]['staff_created']) update_user_meta($user_id, 'prag_must_change_password', 1);
    }

    public function welcome_rest_user($user, $request, $creating) {
        if ($creating) $this->send_welcome($user->ID);
    }

    public function send_pending_welcomes() {
        foreach (array_keys($this->pending_welcomes) as $user_id) $this->send_welcome($user_id);
    }

    private function send_welcome($user_id) {
        if (!isset($this->pending_welcomes[$user_id])) return;
        $pending = $this->pending_welcomes[$user_id];
        unset($this->pending_welcomes[$user_id]);
        $user = get_userdata($user_id);
        if (!$user || !$user->user_email) return;
        $staff = (bool) array_intersect(['administrator', 'shop_manager', 'editor', 'author', 'contributor'], (array) $user->roles);
        $temporary = $pending['staff_created'];
        if (!$temporary || !$staff) delete_user_meta($user_id, 'prag_must_change_password');
        $login_url = $staff ? 'https://portal.prag.global/login' : 'https://shop.prag.global/login';
        $lines = ['Hello ' . $user->display_name . ',', '', 'Welcome to PRAG. Your account has been created.', '', 'Username: ' . $user->user_login, 'Sign in: ' . $login_url];
        if ($temporary && $pending['password'] !== '') {
            $lines[] = 'Temporary password: ' . $pending['password'];
            $lines[] = '';
            $lines[] = $staff ? 'You must replace this temporary password before accessing your assigned portal areas.'
                : 'Use the password reset link below to choose your own password.';
        }
        // Customers who chose a password are welcomed without emailing their chosen secret.
        $key = get_password_reset_key($user);
        if (!is_wp_error($key)) {
            $lines[] = '';
            $lines[] = 'Set or reset your password: ' . network_site_url('wp-login.php?action=rp&key=' . rawurlencode($key) . '&login=' . rawurlencode($user->user_login), 'login');
        }
        $lines[] = '';
        $lines[] = 'PRAG';
        $smtp = $this->config()['smtp'] ?? [];
        $configure_mailer = function($mailer) use ($smtp) {
            if (!empty($smtp['useWordPressMailer']) || empty($smtp['host']) || empty($smtp['username']) || empty($smtp['password'])) return;
            $mailer->isSMTP();
            $mailer->Host = $smtp['host'];
            $mailer->Port = (int) ($smtp['port'] ?? 587);
            $mailer->SMTPAuth = true;
            $mailer->Username = $smtp['username'];
            $mailer->Password = $smtp['password'];
            $mailer->SMTPSecure = !empty($smtp['secure']) ? 'ssl' : 'tls';
            if (!empty($smtp['fromEmail'])) $mailer->setFrom($smtp['fromEmail'], $smtp['fromName'] ?? 'PRAG');
        };
        add_action('phpmailer_init', $configure_mailer, 999);
        $sent = false;
        try { $sent = wp_mail($user->user_email, 'Welcome to PRAG — your account details', implode("\n", $lines)); }
        catch (Throwable $error) { /* Do not log a transport exception that might include credentials. */ }
        finally { remove_action('phpmailer_init', $configure_mailer, 999); }
        update_user_meta($user_id, 'prag_welcome_email_status', $sent ? 'sent' : 'failed');
        return $sent;
    }

    public function password_change_notice() {
        if (get_user_meta(get_current_user_id(), 'prag_must_change_password', true)) {
            echo '<div class="notice notice-warning"><p>Please set a new password below to replace your temporary password and unlock your assigned areas.</p></div>';
        }
    }

    public function password_reset($user, $password) {
        delete_user_meta($user->ID, 'prag_must_change_password');
    }

    public function profile_updated($user_id, $old_user) {
        $new_user = get_userdata($user_id);
        if ($new_user && $new_user->user_pass !== $old_user->user_pass) delete_user_meta($user_id, 'prag_must_change_password');
    }
}

new Prag_User_Access();
