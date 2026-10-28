<?php
// Isolated tests: no WordPress connection, accounts, or real email.
define('ABSPATH', __DIR__);
$actions = $meta = $users = $routes = $fields = $messages = $options = $transients = [];
$actor = 1;
$send_ok = true;
$config = ['roleModuleVisibility' => ['author' => ['dashboard' => false, 'media' => true, 'blog' => true], 'editor' => ['blog' => true]]];
class WP_Error { public $code; public function __construct($code, $message = '', $data = []) { $this->code = $code; } }
function add_action($name, $callback, $priority = 10, $args = 1) { global $actions; $actions[$name][$priority][] = $callback; }
function add_filter($name, $callback, $priority = 10, $args = 1) { add_action($name, $callback, $priority, $args); }
function remove_action($name, $callback, $priority = 10) { global $actions; $actions[$name][$priority] = array_filter($actions[$name][$priority] ?? [], function($item) use ($callback) { return $item !== $callback; }); }
function get_option($name, $fallback = '') { global $config, $options; return $name === 'prag_admin_config' ? json_encode($config) : ($options[$name] ?? $fallback); }
function add_option($key, $value, $deprecated = '', $autoload = false) { global $options; if (isset($options[$key])) return false; $options[$key] = $value; return true; }
function delete_option($key) { global $options; unset($options[$key]); }
function get_transient($key) { global $transients; return $transients[$key] ?? false; }
function set_transient($key, $value, $ttl) { global $transients; $transients[$key] = $value; }
function is_email($email) { return filter_var($email, FILTER_VALIDATE_EMAIL); }
function wp_generate_password($length, $special = true, $extra = false) { return 'fresh-generated-temporary-password'; }
function wp_update_user($data) { global $users; if (!isset($users[$data['ID']])) return new WP_Error('missing'); $users[$data['ID']]->user_pass = $data['user_pass']; return $data['ID']; }

function get_userdata($id) { global $users; return isset($users[$id]) ? clone $users[$id] : false; }
function wp_get_current_user() { global $actor; return get_userdata($actor); }
function get_current_user_id() { global $actor; return $actor; }
function is_user_logged_in() { return (bool) get_current_user_id(); }
function current_user_can($cap) { return in_array('administrator', (array) (wp_get_current_user()->roles ?? []), true); }
function get_user_meta($id, $key, $single = true) { global $meta; return $meta[$id][$key] ?? ''; }
function update_user_meta($id, $key, $value) { global $meta; $meta[$id][$key] = $value; }
function delete_user_meta($id, $key) { global $meta; unset($meta[$id][$key]); }
function wp_unslash($text) { return stripslashes($text); }
function get_password_reset_key($user) { return 'test-reset-key'; }
function network_site_url($url, $scheme = '') { return 'https://central.example.test/' . $url; }
function is_wp_error($value) { return $value instanceof WP_Error; }
function register_rest_field($type, $name, $value) { global $fields; $fields[$name] = $value; }
function register_rest_route($namespace, $route, $options) { global $routes; $routes[$namespace . $route] = $options; }
function wp_check_password($password, $hash, $id) { return $password === $hash; }
function wp_set_password($password, $id) { global $users; $users[$id]->user_pass = $password; }
function wp_die($message, $title = '', $args = []) { throw new Exception('denied:' . ($args['response'] ?? '')); }
function admin_url($path) { return 'https://central.example.test/wp-admin/' . $path; }
function wp_safe_redirect($url) { throw new Exception('redirect:' . $url); }
function get_post_type($id) { return $id === 99 ? 'prag_contact' : 'post'; }
function get_post_status($id) { return 'private'; }
function is_post_type_viewable($type) { return $type === 'post'; }
function wp_mail($to, $subject, $body) {
    global $messages, $send_ok;
    $messages[] = compact('to', 'subject', 'body');
    return $send_ok;
}
class TestRequest {
    private $route; private $method; private $params;
    public function __construct($route, $method = 'GET', $params = []) { $this->route = $route; $this->method = $method; $this->params = $params; }
    public function get_route() { return $this->route; }
    public function get_method() { return $this->method; }
    public function get_param($name) { return $this->params[$name] ?? null; }
}
function check($condition, $message) { if (!$condition) throw new Exception($message); echo "PASS $message\n"; }
function user_fixture($id, $roles) { return (object) ['ID' => $id, 'roles' => $roles, 'user_login' => 'user' . $id, 'display_name' => 'Test User', 'user_email' => "test$id@example.test", 'user_pass' => 'temporary-password']; }
$users[1] = user_fixture(1, ['administrator']);
$users[261] = user_fixture(261, ['author', 'editor']);
require __DIR__ . '/../prag-core-plugin/prag-user-access.php';
$access = new Prag_User_Access();
check($access->allowed_modules($users[261]) === ['media', 'blog'], 'Author plus Editor keeps configured media/blog permissions');
$actor = 261;
try { $access->guard_admin_screen((object) ['base' => 'dashboard']); throw new Exception('Expected redirect'); }
catch (Exception $error) { check(strpos($error->getMessage(), 'redirect:') === 0, 'Central Dashboard redirects restricted authors into an allowed area'); }
try { $access->guard_admin_screen((object) ['base' => 'post', 'post_type' => 'page']); throw new Exception('Expected denial'); }
catch (Exception $error) { check($error->getMessage() === 'denied:403', 'Central direct page editor is forbidden'); }
check($access->guard_admin_screen((object) ['base' => 'upload']) === null, 'Central media screen remains available');
check(is_wp_error($access->guard_rest(null, null, new TestRequest('/wp/v2/pages/5', 'POST'))), 'Direct WordPress page writes are blocked');
check(is_wp_error($access->guard_rest(null, null, new TestRequest('/wc/v3/orders', 'GET'))), 'WooCommerce orders are blocked');
check($access->guard_rest(null, null, new TestRequest('/wp/v2/posts/5', 'POST')) === null, 'Allowed blog writes defer to WordPress ownership capabilities');
check($access->guard_rest(null, null, new TestRequest('/wp/v2/posts', 'GET')) === null, 'Public content reads still work');
check($access->guard_post_capability(['edit_posts'], 'edit_post', 261, [99]) === ['do_not_allow'], 'Inherited edit_posts does not expose enquiry records');
$config['users']['261'] = ['active' => true, 'portals' => ['b2c'], 'b2cModules' => ['blog', 'orders']];
check($access->allowed_modules($users[261]) === ['blog'], 'Individual restrictions cannot grant orders');
unset($config['users']);
$actor = 1;
$secret = "Temporary-'\\-password";
$access->queue_welcome(261, ['user_pass' => addslashes($secret)]);
check(get_user_meta(261, 'prag_must_change_password', true) === 1, 'Staff creation requires password replacement');
$access->welcome_rest_user($users[261], null, true);
check(count($messages) === 1 && strpos($messages[0]['body'], $secret) !== false, 'Staff welcome includes the exact temporary password');
check(strpos($messages[0]['body'], 'https://portal.prag.global/login') !== false, 'Staff welcome points to the portal');
check(get_user_meta(261, 'prag_welcome_email_status', true) === 'sent', 'Mail transport acceptance is recorded');
check(strpos(json_encode($meta), $secret) === false, 'Temporary password is never persisted');
$access->send_pending_welcomes();
check(count($messages) === 1, 'REST and shutdown hooks do not duplicate welcome emails');
$access->register_account_routes();
$actor = 261;
check(is_wp_error($access->guard_rest(null, null, new TestRequest('/wp/v2/posts', 'POST'))), 'Temporary credentials cannot write posts before password change');
check($access->guard_rest(null, null, new TestRequest('/wp/v2/users/me', 'GET')) === null, 'Temporary credentials can resolve their own identity');
$route = $routes['prag-core/v1/change-temporary-password'];
check(call_user_func($route['permission_callback']) === true, 'Only pending password changes may use the endpoint');
check(is_wp_error(call_user_func($route['callback'], new TestRequest('', 'POST', ['password' => 'short']))), 'Short permanent password is rejected');
check(is_wp_error(call_user_func($route['callback'], new TestRequest('', 'POST', ['password' => 'temporary-password']))), 'Temporary password cannot be reused');
check(call_user_func($route['callback'], new TestRequest('', 'POST', ['password' => 'new-permanent-password'])) === ['success' => true], 'Permanent password is saved');
check(!get_user_meta(261, 'prag_must_change_password', true), 'Password replacement clears the restriction');
check(call_user_func($route['permission_callback']) === false, 'Password endpoint closes after replacement');
$actor = 0;
$users[300] = user_fixture(300, ['customer']);
$access->queue_welcome(300, ['user_pass' => 'customer-chosen-secret']);
$access->send_pending_welcomes();
check(strpos($messages[1]['body'], 'customer-chosen-secret') === false, 'Customer-chosen passwords are not emailed');
check(strpos($messages[1]['body'], 'https://shop.prag.global/login') !== false, 'Customer welcome points to the shop');
$actor = 1; $send_ok = false;
$users[301] = user_fixture(301, ['author']);
$access->queue_welcome(301, ['user_pass' => 'temporary-password']);
$access->send_pending_welcomes();
check(get_user_meta(301, 'prag_welcome_email_status', true) === 'failed', 'Email failure is reported without losing the created user');
$send_ok = true;
$users[302] = user_fixture(302, ['customer']);
$access->queue_welcome(302, ['user_pass' => 'admin-created-customer-temp']);
$access->send_pending_welcomes();
check(strpos($messages[3]['body'], 'admin-created-customer-temp') !== false, 'Administrator-created customer receives their temporary password');
$resend = $routes['prag-core/v1/users/(?P<id>\d+)/resend-welcome'];
$request = new TestRequest('', 'POST', ['id' => 261]);
$actor = 261;
check(call_user_func($resend['permission_callback'], $request) === false, 'Author cannot resend account credentials');
$actor = 1;
check(call_user_func($resend['permission_callback'], $request) === true, 'Administrator can resend account credentials');
check(is_wp_error($access->resend_welcome(new TestRequest('', 'POST', ['id' => 1]))), 'Resend cannot reset the current administrator');
$config['users']['261'] = ['active' => false, 'portals' => ['b2c']];
check(is_wp_error($access->resend_welcome($request)), 'Deactivated user cannot receive access email');
unset($config['users']);
$before = count($messages);
$result = $access->resend_welcome($request);
check(!is_wp_error($result) && $result['success'], 'Existing Odunayo account can receive a fresh access email');
check(count($messages) === $before + 1, 'Resend sends exactly one email');
check(strpos($messages[$before]['body'], 'fresh-generated-temporary-password') !== false, 'Resend includes the newly generated temporary password');
check($users[261]->user_pass === 'fresh-generated-temporary-password', 'Resend replaces the previous password');
check((bool) get_user_meta(261, 'prag_must_change_password', true), 'Resend requires changing the fresh password');
check(strpos(json_encode($meta), 'fresh-generated-temporary-password') === false, 'Resent password is not persisted in metadata');
check(!get_option('prag_welcome_resend_lock_261'), 'Resend releases its request lock');
check(is_wp_error($access->resend_welcome($request)) && count($messages) === $before + 1, 'Cooldown prevents duplicate resets and emails');
unset($transients['prag_welcome_resend_261']);
$options['prag_welcome_resend_lock_261'] = time();
check(is_wp_error($access->resend_welcome($request)), 'Concurrent reset is blocked');
unset($options['prag_welcome_resend_lock_261']);
$send_ok = false;
$result = $access->resend_welcome($request);
check(is_wp_error($result) && $result->code === 'prag_welcome_failed', 'Failed resend explicitly reports the changed password and mail failure');
check(!get_option('prag_welcome_resend_lock_261') && !get_transient('prag_welcome_resend_261'), 'Mail failure releases the lock and allows correction and retry');
echo "All account access and onboarding tests passed.\n";
