<?php

/* 
Plugin Name: Relate Sensorviz D3 Widget
Plugin URI: http://none/
Description: d3 widget
Author: mdf
Version: 0.1
Author URI: http://none/
*/

class relate_sensorviz_d3 extends WP_Widget
{

	function relate_sensorviz_d3()
	{
		parent::WP_Widget(false, $name = 'relate sensorviz d3');
	}

	function widget($args, $instance)
	{
		extract($args);

		$title = empty($instance['title']) ? 'default title ' : apply_filters('widget_title', $instance['title']);
		$sometext = empty($instance['sometext']) ? 'default text ' : $instance['sometext'];

		echo $before_widget;

		echo $before_title . $title . $after_title;

		echo $sometext;
		
		echo $args['widget_id'] ;

		echo "
			<script type=\"text/javascript\" src=\"/relatedev/wp-content/plugins/relate_sensorviz_d3/rpc.js\"></script>
			<script type=\"text/javascript\" src=\"/relatedev/wp-content/plugins/relate_sensorviz_d3/d3.v2.min.js\"></script>
			<script type=\"text/javascript\" src=\"/relatedev/wp-content/plugins/relate_sensorviz_d3/relate_viz_d3_v01.js\"></script>";

		/*wp_enqueue_script('rpc', '/wp-content/plugins/sensorviz/rpc.js');
		wp_enqueue_script('d3', '/wp-content/plugins/sensorviz/d3.v2.min.js');
		wp_enqueue_script('relate', '/wp-content/plugins/sensorviz/relate_viz_d3_v01.js');*/

		echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"/relatedev/wp-content/plugins/relate_sensorviz_d3/style.css\" />";

		echo "<parp>
				<script type=\"text/javascript\">

					new RelateDevice('1', {
						1: new RelateChart(\"temperature\", \"1\", 0, 30, \"red\", \"parp\"),
						4: new RelateChart(\"humidity\", \"4\", 0, 100, \"grey\",  \"parp\"),
						9: new RelateChart(\"rain\", \"9\", 0, 1000, \"blue\", \"parp\"),
					});

				</script>
			</parp>";

		echo $after_widget;
	}

	function update($new_instance, $old_instance)
	{
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['sometext'] = strip_tags($new_instance['sometext']);

		return $instance;
	}

	function form($instance)
	{
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'sometext' => '' ) );
		
		$title = strip_tags($instance['title']);
		$sometext = strip_tags($instance['sometext']);

		?>
		<p><label for="<?php echo $this->get_field_id('title'); ?>"><?php echo __('Title'); ?>: <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo attribute_escape($title); ?>" /></label></p>
		<p><label for="<?php echo $this->get_field_id('sometext'); ?>"><?php echo __('sometext'); ?>: <input class="widefat" id="<?php echo $this->get_field_id('sometext'); ?>" name="<?php echo $this->get_field_name('sometext'); ?>" type="text" value="<?php echo attribute_escape($sometext); ?>" /></label></p>
 
		<?php
	}
}

add_action('widgets_init', create_function('', 'return register_widget("relate_sensorviz_d3");'));

?>
