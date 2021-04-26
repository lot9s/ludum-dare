extends RigidBody2D


# member variables
var instanced_by

var speed = 1000
var velocity


# lifecycle methods
func _ready():
	pass # Replace with function body.

func _process(delta):
	position += velocity * delta


# signal callbacks
func _on_VisibilityNotifier2D_screen_exited():
	queue_free()


# helper methods
#	dir: -1 for up, 1 for down
func init(pos, dir, creator=""):
	position = pos
	position += Vector2(0, $CollisionShape2D.shape.extents.y * 5).rotated(dir)
	velocity = Vector2(0, speed).rotated(dir)
	instanced_by = creator
	if creator == "Main":
		$AnimatedSprite.animation = "player"
