extends Node


# member variables
const WINNING_SCORE = 100000

export (PackedScene) var Bullet
export (PackedScene) var Enemy

var score


# lifecycle methods
func _ready():
	OS.set_window_position(Vector2(128, 0))
	new_game()


# signal callbacks
func _on_BulletTimer_timeout():
	if Input.is_action_pressed("ui_select"):
		var start_pos = Vector2($Player.position.x, $Player.position.y + $Player.clamp_y_up)
		var bullet = Bullet.instance()
		bullet.init(start_pos, 0, get_name())
		add_child(bullet)
		$BulletSFX.play()


func _on_EnemyTimer_timeout():
	$EnemySpawnPath/EnemySpawnLocation.offset = randi()
	var enemy = Enemy.instance()
	enemy.connect("killed", self, "update_score")
	enemy.init($EnemySpawnPath/EnemySpawnLocation.position)
	add_child(enemy)


# helper methods
func game_over(msg):
	get_tree().call_group("enemies", "queue_free")

	$EndGUI/EndGameLabel.text = msg
	$EndGUI.show()

	$BulletTimer.stop()
	$EnemyTimer.stop()

	$BGMPlayer.stop()

func new_game():
	score = 0

	$GUI/StatusContainer/HBoxContainer/ScoreContainer/Score.text = str(score)
	$EndGUI.hide()

	$Player.init($StartPosition.position)

	$BulletTimer.start()
	$EnemyTimer.start()

	$BGMPlayer.play()

func update_score(val):
	score += val
	$GUI/StatusContainer/HBoxContainer/ScoreContainer/Score.text = str(score)
	if (score >= WINNING_SCORE):
		game_over("You Win!")
		$VictorySFX.play()
