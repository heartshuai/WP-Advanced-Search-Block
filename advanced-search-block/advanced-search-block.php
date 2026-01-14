<?php
/**
 * Plugin Name: Advanced Search Block
 * Plugin URI: https://github.com/yourusername/advanced-search-block
 * Description: A custom Gutenberg block for advanced post search with keyword, category, and tag filtering.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: advanced-search-block
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ASB_VERSION', '1.0.0');
define('ASB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ASB_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Register the block
 */
function asb_register_block() {
    // Check if Gutenberg is active
    if (!function_exists('register_block_type')) {
        return;
    }

    // Register block script and style
    wp_register_script(
        'advanced-search-block-editor',
        ASB_PLUGIN_URL . 'build/index.js',
        array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'),
        ASB_VERSION,
        true
    );

    wp_register_style(
        'advanced-search-block-editor',
        ASB_PLUGIN_URL . 'build/index.css',
        array(),
        ASB_VERSION
    );

    wp_register_style(
        'advanced-search-block-frontend',
        ASB_PLUGIN_URL . 'build/style-frontend.css',
        array(),
        ASB_VERSION
    );

    // Register frontend script
    wp_register_script(
        'advanced-search-block-frontend',
        ASB_PLUGIN_URL . 'build/frontend.js',
        array('wp-element'),
        ASB_VERSION,
        true
    );

    // Localize script with REST API URL
    wp_localize_script('advanced-search-block-frontend', 'asbData', array(
        'restUrl' => rest_url('advanced-search/v1/'),
        'nonce' => wp_create_nonce('wp_rest'),
    ));

    // Register the block
    register_block_type('advanced-search-block/advanced-search', array(
        'editor_script' => 'advanced-search-block-editor',
        'editor_style' => 'advanced-search-block-editor',
        'style' => 'advanced-search-block-frontend',
        'render_callback' => 'asb_render_block',
    ));
}
add_action('init', 'asb_register_block');

/**
 * Render the block on the frontend
 */
function asb_render_block($attributes) {
    // Enqueue frontend script and style
    wp_enqueue_script('advanced-search-block-frontend');
    wp_enqueue_style('advanced-search-block-frontend');

    // Create a unique ID for this block instance
    $block_id = 'asb-' . uniqid();

    return '<div id="' . esc_attr($block_id) . '" class="advanced-search-block-container"></div>';
}

/**
 * Register REST API endpoint
 */
function asb_register_rest_routes() {
    register_rest_route('advanced-search/v1', '/search', array(
        'methods' => 'GET',
        'callback' => 'asb_search_posts',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('advanced-search/v1', '/categories', array(
        'methods' => 'GET',
        'callback' => 'asb_get_categories',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('advanced-search/v1', '/tags', array(
        'methods' => 'GET',
        'callback' => 'asb_get_tags',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'asb_register_rest_routes');

/**
 * Search posts endpoint
 */
function asb_search_posts($request) {
    $keyword = sanitize_text_field($request->get_param('keyword'));
    $category = intval($request->get_param('category'));
    $tags = $request->get_param('tags');
    $page = max(1, intval($request->get_param('page')));
    $per_page = max(1, min(100, intval($request->get_param('per_page')))) ?: 10;

    // Build query args
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'orderby' => 'date',
        'order' => 'DESC',
    );

    // Keyword search
    if (!empty($keyword)) {
        $args['s'] = $keyword;
    }

    // Category filter
    if (!empty($category)) {
        $args['cat'] = $category;
    }

    // Tags filter
    if (!empty($tags) && is_array($tags)) {
        $tag_ids = array_map('intval', $tags);
        $args['tag__in'] = $tag_ids;
    }

    // Execute query
    $query = new WP_Query($args);

    // Format results
    $posts = array();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            
            $posts[] = array(
                'id' => $post_id,
                'title' => get_the_title(),
                'excerpt' => get_the_excerpt(),
                'content' => get_the_content(),
                'permalink' => get_permalink(),
                'date' => get_the_date('c'),
                'author' => get_the_author(),
                'featured_image' => get_the_post_thumbnail_url($post_id, 'medium'),
                'categories' => wp_get_post_categories($post_id, array('fields' => 'names')),
                'tags' => wp_get_post_tags($post_id, array('fields' => 'names')),
            );
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response(array(
        'posts' => $posts,
        'total' => $query->found_posts,
        'totalPages' => $query->max_num_pages,
        'currentPage' => $page,
    ), 200);
}

/**
 * Get categories endpoint
 */
function asb_get_categories($request) {
    $categories = get_categories(array(
        'orderby' => 'name',
        'order' => 'ASC',
        'hide_empty' => false,
    ));

    $result = array();
    foreach ($categories as $category) {
        $result[] = array(
            'id' => $category->term_id,
            'name' => $category->name,
            'slug' => $category->slug,
            'count' => $category->count,
        );
    }

    return new WP_REST_Response($result, 200);
}

/**
 * Get tags endpoint
 */
function asb_get_tags($request) {
    $tags = get_tags(array(
        'orderby' => 'name',
        'order' => 'ASC',
        'hide_empty' => false,
    ));

    $result = array();
    foreach ($tags as $tag) {
        $result[] = array(
            'id' => $tag->term_id,
            'name' => $tag->name,
            'slug' => $tag->slug,
            'count' => $tag->count,
        );
    }

    return new WP_REST_Response($result, 200);
}

