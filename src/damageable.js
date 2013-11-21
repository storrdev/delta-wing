(function() {

    game.component.damageable = {
        damage: function(amount) {
            this.hp -= amount;
        }
    }

}());