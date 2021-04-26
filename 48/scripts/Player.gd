extends Area2D


# signals
signal hit(msg)


# member variables
const WALL_WIDTH = 64

var screen_size

var edge_dist

var clamp_x_left
var clamp_x_right
var clamp_y_up
var clamp_y_down

var speed = 650


# life cycle methods
func _ready():
	hide()
	screen_size = get_viewport_rect().size

	edge_dist = $CollisionShape2D.shape.extents.x

	clamp_x_left = edge_dist + WALL_WIDTH
	clamp_x_right = screen_size.x - edge_dist - WALL_WIDTH
	clamp_y_up = edge_dist
	clamp_y_down = round(screen_size.y / 2) - edge_dist

func _process(delta):
	var velocity = Vector2()

	if Input.is_action_pressed("ui_right"):
		velocity.x += 1
	if Input.is_action_pressed("ui_left"):
		velocity.x -= 1
	if Input.is_action_pressed("ui_down"):
		velocity.y += 1
	if Input.is_action_pressed("ui_up"):
		velocity.y -= 1

	if velocity.length() > 0:
		velocity = velocity.normalized() * speed
		$AnimatedSprite.play()
	else:
		$AnimatedSprite.stop()

	position += velocity * delta
	position.x = clamp(position.x, clamp_x_left, clamp_x_right)
	position.y = clamp(position.y, clamp_y_up, clamp_y_down)


# signal callbacks
func _on_Player_area_entered(_area):
	damage()

func _on_Player_body_entered(_body):
	damage()


# helper methods
func damage():
	hide()
	emit_signal("hit", "Game Over")
	$CollisionShape2D.set_deferred("disabled", true)
	$DeathSFX.play()

func init(pos):
	position = pos
	show()
	$CollisionShape2D.disabled = false

