extends Area2D


signal killed(val)


# member variables
export (PackedScene) var Bullet

var speed = 125
var edge_dist


# life cycle methods
func _ready():
	edge_dist = $CollisionShape2D.shape.extents.y
	$BulletTimer.start()

func _process(delta):
	position += Vector2(0, -1 * speed) * delta


# signal callbacks
func _on_BulletTimer_timeout():
	var start_pos = Vector2(position.x, position.y - edge_dist)
	var bullet = Bullet.instance()
	bullet.init(start_pos, PI, get_name())
	$"..".add_child(bullet) # add bullet as child of parent (should be Main)

func _on_Enemy_body_entered(body):
	# get name of creator
	var creator_obj_name = get_obj_name_from_instance_name(body.instanced_by)
	var self_obj_name = get_obj_name_from_instance_name(name)
	if creator_obj_name == self_obj_name:
		return

	hide()
	$CollisionShape2D.set_deferred("disabled", true)
	emit_signal("killed", 999)
	queue_free()

func _on_VisibilityNotifier2D_screen_exited():
	queue_free()


# helper methods
func init(pos):
	position = pos
	$CollisionShape2D.disabled = false

func get_obj_name_from_instance_name(instance_name):
	var instanced_name_split = instance_name.split("@")
	if (instanced_name_split.size() > 1):
		return instanced_name_split[1]
	return instance_name
