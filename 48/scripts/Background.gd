extends ParallaxBackground


# member variables
export var camera_velocity: Vector2 = Vector2(0, -100)


# lifecycle methods
func _process(delta):
	var new_offset: Vector2 = get_scroll_offset() + camera_velocity * delta
	set_scroll_offset(new_offset)
